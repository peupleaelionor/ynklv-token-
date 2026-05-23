// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title  YNKLVVesting
 * @notice Linear vesting with cliff for YNKLV token allocations.
 *
 * Each beneficiary has one schedule. Schedules are set once at deployment
 * or during an admin setup window. After the setup window closes, no new
 * schedules can be added (admin function permanently disabled).
 *
 * Revocable schedules (advisors only) can have unvested tokens returned
 * to the treasury by governance — not by the owner alone.
 *
 * Security properties:
 *   - Only beneficiary can release their own tokens.
 *   - No early release mechanism.
 *   - Revocation (for advisor schedules only) requires governance timelock.
 *   - All activity emits events for full on-chain auditability.
 */
contract YNKLVVesting is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ──────────────────────────────────────────────
    // TYPES
    // ──────────────────────────────────────────────

    struct VestingSchedule {
        uint256 total;           // Total tokens allocated
        uint256 cliff;           // Unix timestamp: earliest possible release
        uint256 start;           // Unix timestamp: vesting calculation start
        uint256 duration;        // Vesting duration in seconds (post-cliff)
        uint256 released;        // Amount already released
        bool    revocable;       // If true, governance can revoke unvested
        bool    revoked;         // True if schedule has been revoked
    }

    // ──────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────

    IERC20  public immutable token;
    address public           governance;   // Can revoke advisor schedules

    mapping(address => VestingSchedule) public schedules;
    address[] public beneficiaries;

    bool public setupClosed;  // Once true, addSchedule is permanently disabled

    // ──────────────────────────────────────────────
    // EVENTS
    // ──────────────────────────────────────────────

    event ScheduleAdded(
        address indexed beneficiary,
        uint256 total,
        uint256 cliffTimestamp,
        uint256 startTimestamp,
        uint256 duration,
        bool    revocable
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(address indexed beneficiary, uint256 returnedAmount);
    event SetupClosed();

    // ──────────────────────────────────────────────
    // CONSTRUCTOR
    // ──────────────────────────────────────────────

    constructor(address _token, address _governance) Ownable2Step() {
        require(_token      != address(0), "YNKLVVesting: zero token");
        require(_governance != address(0), "YNKLVVesting: zero governance");
        token      = IERC20(_token);
        governance = _governance;
    }

    // ──────────────────────────────────────────────
    // ADMIN — SETUP PHASE ONLY
    // ──────────────────────────────────────────────

    /**
     * @notice Add a vesting schedule. Only callable during setup window.
     * @dev    Owner must have already transferred `total` tokens to this contract.
     */
    function addSchedule(
        address beneficiary,
        uint256 total,
        uint256 cliffSeconds,
        uint256 vestingDuration,
        bool    revocable
    ) external onlyOwner {
        require(!setupClosed,                            "YNKLVVesting: setup closed");
        require(beneficiary != address(0),               "YNKLVVesting: zero address");
        require(total > 0,                               "YNKLVVesting: zero total");
        require(vestingDuration > 0,                     "YNKLVVesting: zero duration");
        require(schedules[beneficiary].total == 0,       "YNKLVVesting: schedule exists");

        uint256 start = block.timestamp;
        uint256 cliff = start + cliffSeconds;

        schedules[beneficiary] = VestingSchedule({
            total:     total,
            cliff:     cliff,
            start:     start,
            duration:  vestingDuration,
            released:  0,
            revocable: revocable,
            revoked:   false
        });
        beneficiaries.push(beneficiary);

        emit ScheduleAdded(beneficiary, total, cliff, start, vestingDuration, revocable);
    }

    /**
     * @notice Permanently close the setup window. Irreversible.
     */
    function closeSetup() external onlyOwner {
        setupClosed = true;
        emit SetupClosed();
    }

    // ──────────────────────────────────────────────
    // BENEFICIARY — RELEASE
    // ──────────────────────────────────────────────

    /**
     * @notice Release all currently vested tokens for msg.sender.
     */
    function release() external nonReentrant {
        VestingSchedule storage s = schedules[msg.sender];
        require(s.total > 0,    "YNKLVVesting: no schedule");
        require(!s.revoked,     "YNKLVVesting: revoked");

        uint256 releasable = _vestedAmount(s) - s.released;
        require(releasable > 0, "YNKLVVesting: nothing to release");

        s.released += releasable;
        token.safeTransfer(msg.sender, releasable);

        emit TokensReleased(msg.sender, releasable);
    }

    // ──────────────────────────────────────────────
    // GOVERNANCE — REVOCATION (advisors only)
    // ──────────────────────────────────────────────

    /**
     * @notice Revoke a revocable schedule. Unvested tokens return to governance.
     * @dev    Only callable by governance address (timelock contract).
     */
    function revoke(address beneficiary) external {
        require(msg.sender == governance, "YNKLVVesting: not governance");

        VestingSchedule storage s = schedules[beneficiary];
        require(s.total > 0,     "YNKLVVesting: no schedule");
        require(s.revocable,     "YNKLVVesting: not revocable");
        require(!s.revoked,      "YNKLVVesting: already revoked");

        // Release any already-vested tokens to beneficiary first
        uint256 vested      = _vestedAmount(s);
        uint256 toRelease   = vested - s.released;
        uint256 toReturn    = s.total - vested;

        s.revoked   = true;
        s.released += toRelease;

        if (toRelease > 0) {
            token.safeTransfer(beneficiary, toRelease);
            emit TokensReleased(beneficiary, toRelease);
        }
        if (toReturn > 0) {
            token.safeTransfer(governance, toReturn);
        }

        emit ScheduleRevoked(beneficiary, toReturn);
    }

    // ──────────────────────────────────────────────
    // VIEWS
    // ──────────────────────────────────────────────

    function releasable(address beneficiary) external view returns (uint256) {
        VestingSchedule storage s = schedules[beneficiary];
        if (s.total == 0 || s.revoked) return 0;
        return _vestedAmount(s) - s.released;
    }

    function vested(address beneficiary) external view returns (uint256) {
        VestingSchedule storage s = schedules[beneficiary];
        if (s.total == 0) return 0;
        return _vestedAmount(s);
    }

    function getBeneficiaries() external view returns (address[] memory) {
        return beneficiaries;
    }

    // ──────────────────────────────────────────────
    // INTERNAL
    // ──────────────────────────────────────────────

    function _vestedAmount(VestingSchedule storage s) internal view returns (uint256) {
        if (block.timestamp < s.cliff) return 0;
        if (block.timestamp >= s.cliff + s.duration) return s.total;

        uint256 elapsed = block.timestamp - s.cliff;
        return (s.total * elapsed) / s.duration;
    }
}
