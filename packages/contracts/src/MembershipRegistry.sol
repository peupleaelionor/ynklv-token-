// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { IYNKLV } from "./interfaces/IYNKLV.sol";

/// @title MembershipRegistry
/// @author YANKELV
/// @notice Resolves a member's tier from their YNKLV balance and their
///         contribution score (EPS). Tiers describe ACCESS and PARTICIPATION
///         rights only — never financial return or yield.
/// @dev The registry holds no funds. It is a pure read/derive layer plus a
///      scorer-maintained contribution score. Thresholds are governance-tunable
///      within hard bounds to prevent abuse.
contract MembershipRegistry is AccessControl, Pausable {
    // ─── Roles ───────────────────────────────────────────────────────────────

    /// @notice May update contribution scores (the Sankofa oracle / indexer).
    bytes32 public constant SCORER_ROLE = keccak256("SCORER_ROLE");
    /// @notice May tune thresholds within bounds (the Indaba / timelock).
    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");
    /// @notice May pause score updates in an emergency (the Askari).
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ─── Tiers ─────────────────────────────────────────────────────────────────

    uint256 public constant TIER_COUNT = 5; // Observer, Builder, Creator, Architect, Guardian

    /// @notice Hard upper bound on any balance threshold (sanity guard).
    uint256 public constant MAX_BALANCE_THRESHOLD = 1_000_000e18;
    /// @notice Hard upper bound on any score threshold.
    uint256 public constant MAX_SCORE_THRESHOLD = 1_000_000;

    struct Threshold {
        uint256 minBalance; // wei of YNKLV
        uint256 minScore; // contribution points
    }

    /// @notice Per-tier requirements, indexed 0..TIER_COUNT-1.
    Threshold[TIER_COUNT] public thresholds;

    // ─── State ───────────────────────────────────────────────────────────────

    IYNKLV public immutable token;

    /// @notice Contribution score (EPS) per member. Non-transferable by design.
    mapping(address => uint256) public contributionScore;
    /// @notice Unix seconds of a member's first recorded contribution.
    mapping(address => uint64) public genesisTimestamp;

    // ─── Events ────────────────────────────────────────────────────────────────

    event ContributionUpdated(address indexed member, uint256 newScore, uint256 delta, bool increase);
    event ThresholdUpdated(uint256 indexed tier, uint256 minBalance, uint256 minScore);

    // ─── Errors ────────────────────────────────────────────────────────────────

    error InvalidTier();
    error ThresholdTooHigh();
    error LengthMismatch();

    constructor(address ynklvToken, address admin) {
        token = IYNKLV(ynklvToken);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GOVERNOR_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        // Sensible defaults — mirror @ynklv/config TIER_LADDER.
        thresholds[0] = Threshold(0, 0); // Observer
        thresholds[1] = Threshold(100e18, 100); // Builder
        thresholds[2] = Threshold(500e18, 500); // Creator
        thresholds[3] = Threshold(2_500e18, 1_000); // Architect
        thresholds[4] = Threshold(10_000e18, 2_500); // Guardian
    }

    // ─── Tier resolution (view) ──────────────────────────────────────────────

    /// @notice Returns the highest tier index satisfied by `member`.
    function tierOf(address member) public view returns (uint256 tier) {
        uint256 balance = token.balanceOf(member);
        uint256 score = contributionScore[member];
        tier = 0;
        // Walk upward; the highest satisfied tier wins.
        for (uint256 i = 1; i < TIER_COUNT; i++) {
            Threshold storage th = thresholds[i];
            if (balance >= th.minBalance && score >= th.minScore) {
                tier = i;
            }
        }
    }

    /// @notice Convenience: does `member` meet at least `minTier`?
    function hasTier(address member, uint256 minTier) external view returns (bool) {
        if (minTier >= TIER_COUNT) revert InvalidTier();
        return tierOf(member) >= minTier;
    }

    // ─── Contribution score maintenance (SCORER_ROLE) ────────────────────────

    /// @notice Increases a member's contribution score.
    /// @dev Increase-only path used for awarding contribution. Decreases use
    ///      {slashContribution} and are reserved for verified abuse only.
    function awardContribution(address member, uint256 points)
        external
        whenNotPaused
        onlyRole(SCORER_ROLE)
    {
        if (genesisTimestamp[member] == 0) {
            genesisTimestamp[member] = uint64(block.timestamp);
        }
        uint256 updated = contributionScore[member] + points;
        contributionScore[member] = updated;
        emit ContributionUpdated(member, updated, points, true);
    }

    /// @notice Batch award — used by the indexer to settle an epoch.
    function awardContributionBatch(address[] calldata members, uint256[] calldata points)
        external
        whenNotPaused
        onlyRole(SCORER_ROLE)
    {
        if (members.length != points.length) revert LengthMismatch();
        for (uint256 i = 0; i < members.length; i++) {
            address member = members[i];
            if (genesisTimestamp[member] == 0) {
                genesisTimestamp[member] = uint64(block.timestamp);
            }
            uint256 updated = contributionScore[member] + points[i];
            contributionScore[member] = updated;
            emit ContributionUpdated(member, updated, points[i], true);
        }
    }

    /// @notice Reduces a member's score. Reserved for verified abuse remediation.
    /// @dev Governance-gated, not scorer-gated, because slashing reputation is
    ///      a heavier action than awarding it.
    function slashContribution(address member, uint256 points)
        external
        onlyRole(GOVERNOR_ROLE)
    {
        uint256 current = contributionScore[member];
        uint256 updated = points >= current ? 0 : current - points;
        contributionScore[member] = updated;
        emit ContributionUpdated(member, updated, points, false);
    }

    // ─── Governance: threshold tuning ────────────────────────────────────────

    function setThreshold(uint256 tier, uint256 minBalance, uint256 minScore)
        external
        onlyRole(GOVERNOR_ROLE)
    {
        if (tier == 0 || tier >= TIER_COUNT) revert InvalidTier();
        if (minBalance > MAX_BALANCE_THRESHOLD || minScore > MAX_SCORE_THRESHOLD) {
            revert ThresholdTooHigh();
        }
        thresholds[tier] = Threshold(minBalance, minScore);
        emit ThresholdUpdated(tier, minBalance, minScore);
    }

    // ─── Emergency ───────────────────────────────────────────────────────────

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
