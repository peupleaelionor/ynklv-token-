// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IYNKLV } from "./interfaces/IYNKLV.sol";

/// @title EcosystemRewardsVault
/// @author YNKLV
/// @notice Distributes pre-funded YNKLV to recognize contribution and
///         participation. This is NOT yield, NOT interest, and NOT a return on
///         investment. It cannot mint. It can only allocate tokens that have
///         already been deposited, within a governance-set per-epoch budget.
/// @dev Allocation is push-recorded by a DISTRIBUTOR (the indexer/Indaba),
///      then pulled by members via {claim}. A per-epoch budget cap makes
///      distribution bounded and auditable — never an automated APY.
contract EcosystemRewardsVault is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IYNKLV;

    // ─── Roles ───────────────────────────────────────────────────────────────

    /// @notice May allocate rewards and roll epochs (indexer / Indaba executor).
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    /// @notice May set the per-epoch budget (the Indaba / timelock).
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    /// @notice May pause claims/allocations in an emergency (the Askari).
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ─── State ───────────────────────────────────────────────────────────────

    IYNKLV public immutable token;

    /// @notice Claimable balance per member (wei).
    mapping(address => uint256) public claimable;
    /// @notice Lifetime claimed per member (wei).
    mapping(address => uint256) public lifetimeClaimed;

    /// @notice Current epoch index.
    uint256 public epoch;
    /// @notice Maximum total that may be allocated within a single epoch.
    uint256 public epochBudget;
    /// @notice Amount already allocated in the current epoch.
    uint256 public epochAllocated;
    /// @notice Total currently owed to members but not yet claimed.
    uint256 public totalOutstanding;

    // ─── Events ────────────────────────────────────────────────────────────────

    event Allocated(address indexed member, uint256 amount, string reason, uint256 indexed epoch);
    event Claimed(address indexed member, uint256 amount);
    event EpochRolled(uint256 indexed newEpoch, uint256 budget);
    event BudgetUpdated(uint256 budget);
    event Funded(address indexed from, uint256 amount);
    event Swept(address indexed to, uint256 amount);

    // ─── Errors ────────────────────────────────────────────────────────────────

    error ZeroAmount();
    error BudgetExceeded();
    error NothingToClaim();
    error InsufficientUnreservedBalance();
    error LengthMismatch();

    constructor(address ynklvToken, address admin, uint256 initialEpochBudget) {
        token = IYNKLV(ynklvToken);
        epochBudget = initialEpochBudget;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GOVERNOR_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        emit BudgetUpdated(initialEpochBudget);
    }

    // ─── Funding ───────────────────────────────────────────────────────────────

    /// @notice Convenience funder. Anyone may donate to the vault; tokens may
    ///         also simply be transferred directly to this contract.
    function fund(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Funded(msg.sender, amount);
    }

    // ─── Allocation (DISTRIBUTOR_ROLE) ───────────────────────────────────────

    /// @notice Records `amount` claimable for `member`. Cannot exceed the
    ///         remaining epoch budget, and cannot reserve more than the vault
    ///         actually holds (after existing obligations).
    function allocate(address member, uint256 amount, string calldata reason)
        public
        whenNotPaused
        onlyRole(DISTRIBUTOR_ROLE)
    {
        if (amount == 0) revert ZeroAmount();
        if (epochAllocated + amount > epochBudget) revert BudgetExceeded();

        // Never promise more than the vault can pay.
        uint256 unreserved = token.balanceOf(address(this)) - totalOutstanding;
        if (amount > unreserved) revert InsufficientUnreservedBalance();

        epochAllocated += amount;
        totalOutstanding += amount;
        claimable[member] += amount;

        emit Allocated(member, amount, reason, epoch);
    }

    /// @notice Batch allocation for epoch settlement by the indexer.
    function allocateBatch(
        address[] calldata members,
        uint256[] calldata amounts,
        string calldata reason
    ) external whenNotPaused onlyRole(DISTRIBUTOR_ROLE) {
        if (members.length != amounts.length) revert LengthMismatch();
        for (uint256 i = 0; i < members.length; i++) {
            allocate(members[i], amounts[i], reason);
        }
    }

    /// @notice Opens a new epoch, resetting the per-epoch allocation counter.
    function rollEpoch() external onlyRole(DISTRIBUTOR_ROLE) {
        epoch += 1;
        epochAllocated = 0;
        emit EpochRolled(epoch, epochBudget);
    }

    // ─── Claiming (members) ──────────────────────────────────────────────────

    /// @notice Transfers the caller's full claimable balance to them.
    function claim() external nonReentrant whenNotPaused returns (uint256 amount) {
        amount = claimable[msg.sender];
        if (amount == 0) revert NothingToClaim();

        claimable[msg.sender] = 0;
        lifetimeClaimed[msg.sender] += amount;
        totalOutstanding -= amount;

        token.safeTransfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    // ─── Governance ──────────────────────────────────────────────────────────

    function setEpochBudget(uint256 newBudget) external onlyRole(GOVERNOR_ROLE) {
        epochBudget = newBudget;
        emit BudgetUpdated(newBudget);
    }

    /// @notice Recovers only UNRESERVED tokens (never funds owed to members).
    function sweepUnreserved(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 unreserved = token.balanceOf(address(this)) - totalOutstanding;
        if (amount > unreserved) revert InsufficientUnreservedBalance();
        token.safeTransfer(to, amount);
        emit Swept(to, amount);
    }

    // ─── Emergency ───────────────────────────────────────────────────────────

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
