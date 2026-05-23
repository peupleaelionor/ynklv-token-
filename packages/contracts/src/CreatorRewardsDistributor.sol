// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IYNKLV } from "./interfaces/IYNKLV.sol";

/// @title CreatorRewardsDistributor
/// @author YNKLV
/// @notice Settles a Soko purchase by splitting the payment immutably:
///         90% to the creator, 8.5% to the Baraka treasury, 1.5% burned.
///         The split is hardcoded as constants and cannot be changed without
///         deploying a new contract — it is law, not policy.
/// @dev Pulls YNKLV from the buyer via allowance, then distributes atomically.
contract CreatorRewardsDistributor is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IYNKLV;

    // ─── Immutable split (basis points; 10_000 = 100%) ───────────────────────

    uint256 public constant CREATOR_SHARE_BPS = 9_000; // 90.0%
    uint256 public constant TREASURY_SHARE_BPS = 850; // 8.5%
    uint256 public constant BURN_SHARE_BPS = 150; // 1.5%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    // ─── Roles ───────────────────────────────────────────────────────────────

    /// @notice May update the treasury sink (the Indaba / timelock).
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    /// @notice May pause purchases in an emergency (the Askari).
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ─── State ───────────────────────────────────────────────────────────────

    IYNKLV public immutable token;
    address public treasury;

    mapping(address => uint256) public lifetimeEarned;
    uint256 public totalBurned;
    uint256 public totalToTreasury;

    // ─── Events ────────────────────────────────────────────────────────────────

    event Purchase(
        address indexed buyer,
        address indexed creator,
        uint256 indexed productId,
        uint256 amount,
        uint256 toCreator,
        uint256 toTreasury,
        uint256 burned
    );
    event TreasuryUpdated(address indexed treasury);

    // ─── Errors ────────────────────────────────────────────────────────────────

    error ZeroAmount();
    error ZeroAddress();
    error SplitInvariantBroken();

    constructor(address ynklvToken, address treasury_, address admin) {
        if (ynklvToken == address(0) || treasury_ == address(0) || admin == address(0)) {
            revert ZeroAddress();
        }
        // Compile-time-style guard: the split must sum to exactly 100%.
        if (CREATOR_SHARE_BPS + TREASURY_SHARE_BPS + BURN_SHARE_BPS != BPS_DENOMINATOR) {
            revert SplitInvariantBroken();
        }

        token = IYNKLV(ynklvToken);
        treasury = treasury_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GOVERNOR_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // ─── Purchase ──────────────────────────────────────────────────────────────

    /// @notice Settles a purchase of `amount` YNKLV from the caller to `creator`.
    /// @dev Buyer must approve this contract for `amount` first. Distribution is
    ///      atomic: creator + treasury + burn always equals `amount`.
    function purchase(address creator, uint256 productId, uint256 amount)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 toCreator, uint256 toTreasury, uint256 burned)
    {
        if (creator == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        token.safeTransferFrom(msg.sender, address(this), amount);

        toTreasury = (amount * TREASURY_SHARE_BPS) / BPS_DENOMINATOR;
        burned = (amount * BURN_SHARE_BPS) / BPS_DENOMINATOR;
        // Creator receives the remainder so rounding dust never strands tokens.
        toCreator = amount - toTreasury - burned;

        token.safeTransfer(creator, toCreator);
        token.safeTransfer(treasury, toTreasury);
        token.burn(burned);

        lifetimeEarned[creator] += toCreator;
        totalToTreasury += toTreasury;
        totalBurned += burned;

        emit Purchase(msg.sender, creator, productId, amount, toCreator, toTreasury, burned);
    }

    // ─── Governance ──────────────────────────────────────────────────────────

    function setTreasury(address treasury_) external onlyRole(GOVERNOR_ROLE) {
        if (treasury_ == address(0)) revert ZeroAddress();
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    // ─── Emergency ───────────────────────────────────────────────────────────

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
