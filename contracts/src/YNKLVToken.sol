// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title  YNKLVToken
 * @notice The canonical YNKLV ERC-20 utility token.
 *
 * Design properties:
 *   - Fixed supply of 1,000,000,000 YNKLV minted at genesis to allocation contracts.
 *   - No mint function after construction. Supply is permanently fixed.
 *   - Burn is enabled via ERC20Burnable — ecosystem contracts call burn() as value flows.
 *   - ERC20Permit (EIP-2612) enables gasless approvals — critical for low-fee African UX.
 *   - ERC20Votes enables on-chain governance via OpenZeppelin Governor without separate delegation.
 *   - No owner. No admin. No blacklist. No fee-on-transfer. Immutable behavior.
 *
 * Total supply: 1,000,000,000 YNKLV
 * Allocation:
 *   30% → Ecosystem & Community  (ecosystemCommunity — vesting contract)
 *   20% → Creator & Builder      (creatorBuilder     — vesting contract)
 *   15% → Treasury               (treasury           — multisig safe)
 *   10% → Early Backers          (earlyBackers        — vesting contract)
 *   10% → Team & Founders        (teamFounders        — vesting contract)
 *    8% → Liquidity Provision    (liquidityManager    — multisig + DEX)
 *    5% → Ecosystem Grants       (ecosystemGrants     — multisig)
 *    2% → Advisors & Partners    (advisors            — vesting contract)
 */
contract YNKLVToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {

    // ──────────────────────────────────────────────
    // CONSTANTS
    // ──────────────────────────────────────────────

    uint256 public constant TOTAL_SUPPLY         = 1_000_000_000e18;

    uint256 public constant ECOSYSTEM_COMMUNITY  =   300_000_000e18; // 30%
    uint256 public constant CREATOR_BUILDER      =   200_000_000e18; // 20%
    uint256 public constant TREASURY             =   150_000_000e18; // 15%
    uint256 public constant EARLY_BACKERS        =   100_000_000e18; // 10%
    uint256 public constant TEAM_FOUNDERS        =   100_000_000e18; // 10%
    uint256 public constant LIQUIDITY            =    80_000_000e18; //  8%
    uint256 public constant ECOSYSTEM_GRANTS     =    50_000_000e18; //  5%
    uint256 public constant ADVISORS             =    20_000_000e18; //  2%

    // ──────────────────────────────────────────────
    // EVENTS
    // ──────────────────────────────────────────────

    event GenesisAllocation(address indexed recipient, uint256 amount, string label);

    // ──────────────────────────────────────────────
    // CONSTRUCTOR
    // ──────────────────────────────────────────────

    /**
     * @param ecosystemCommunity  Vesting contract for community allocation (30%)
     * @param creatorBuilder      Vesting contract for creator rewards (20%)
     * @param treasury            Gnosis Safe treasury (15%)
     * @param earlyBackers        Vesting contract for strategic backers (10%)
     * @param teamFounders        Vesting contract for team (10%)
     * @param liquidityManager    Liquidity management multisig (8%)
     * @param ecosystemGrants     Grants multisig (5%)
     * @param advisors            Vesting contract for advisors (2%)
     */
    constructor(
        address ecosystemCommunity,
        address creatorBuilder,
        address treasury,
        address earlyBackers,
        address teamFounders,
        address liquidityManager,
        address ecosystemGrants,
        address advisors
    )
        ERC20("YNKLV", "YNKLV")
        ERC20Permit("YNKLV")
    {
        // Validate all addresses are non-zero
        require(ecosystemCommunity != address(0), "YNKLVToken: zero address");
        require(creatorBuilder     != address(0), "YNKLVToken: zero address");
        require(treasury           != address(0), "YNKLVToken: zero address");
        require(earlyBackers       != address(0), "YNKLVToken: zero address");
        require(teamFounders       != address(0), "YNKLVToken: zero address");
        require(liquidityManager   != address(0), "YNKLVToken: zero address");
        require(ecosystemGrants    != address(0), "YNKLVToken: zero address");
        require(advisors           != address(0), "YNKLVToken: zero address");

        // Mint genesis allocations — these are the only mints ever
        _mint(ecosystemCommunity, ECOSYSTEM_COMMUNITY);
        emit GenesisAllocation(ecosystemCommunity, ECOSYSTEM_COMMUNITY, "Ecosystem & Community");

        _mint(creatorBuilder, CREATOR_BUILDER);
        emit GenesisAllocation(creatorBuilder, CREATOR_BUILDER, "Creator & Builder");

        _mint(treasury, TREASURY);
        emit GenesisAllocation(treasury, TREASURY, "Treasury");

        _mint(earlyBackers, EARLY_BACKERS);
        emit GenesisAllocation(earlyBackers, EARLY_BACKERS, "Early Backers");

        _mint(teamFounders, TEAM_FOUNDERS);
        emit GenesisAllocation(teamFounders, TEAM_FOUNDERS, "Team & Founders");

        _mint(liquidityManager, LIQUIDITY);
        emit GenesisAllocation(liquidityManager, LIQUIDITY, "Liquidity");

        _mint(ecosystemGrants, ECOSYSTEM_GRANTS);
        emit GenesisAllocation(ecosystemGrants, ECOSYSTEM_GRANTS, "Ecosystem Grants");

        _mint(advisors, ADVISORS);
        emit GenesisAllocation(advisors, ADVISORS, "Advisors");

        // Invariant: total supply must match constant
        assert(totalSupply() == TOTAL_SUPPLY);
    }

    // ──────────────────────────────────────────────
    // OVERRIDES (OpenZeppelin multi-inheritance)
    // ──────────────────────────────────────────────

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    // ──────────────────────────────────────────────
    // NO OTHER FUNCTIONS
    // ──────────────────────────────────────────────
    //
    // This contract has no owner, no admin, no pause,
    // no blacklist, no fee switch, no upgrade proxy.
    // The code above is the complete and permanent behavior.
    // Verify this on Basescan after deployment.
}
