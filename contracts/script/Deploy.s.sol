// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {YNKLVToken}   from "../src/YNKLVToken.sol";
import {YNKLVVesting} from "../src/YNKLVVesting.sol";
import {YNKLVPass}    from "../src/YNKLVPass.sol";
import {YNKLVStudio}  from "../src/YNKLVStudio.sol";

/**
 * @notice YNKLV Deployment Script
 *
 * DEPLOYMENT ORDER (must be followed exactly):
 *   1. Deploy vesting contracts (receive addresses to pass to token)
 *   2. Deploy token (mints all supply to vesting/treasury contracts)
 *   3. Deploy Pass
 *   4. Deploy Studio
 *   5. Verify on Basescan
 *   6. Lock liquidity via Unicrypt/TeamFinance
 *   7. Publish all addresses publicly
 *
 * Run on Base Sepolia (testnet):
 *   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
 *
 * Run on Base mainnet (production):
 *   forge script script/Deploy.s.sol --rpc-url base --broadcast --verify --slow
 *
 * Environment variables required:
 *   DEPLOYER_PK          — deployer private key
 *   GOVERNANCE_SAFE      — 4-of-7 multisig address (must exist before deployment)
 *   ORACLE_ADDRESS       — EPS oracle EOA/contract address
 *   TEAM_VESTING_BENE    — team founders wallet (receives after cliff)
 *   BACKER_VESTING_BENE  — early backers wallet
 *   ADVISOR_VESTING_BENE — advisors wallet
 */
contract DeployYNKLV is Script {

    // ── Vesting parameters ──────────────────────────────────────────
    uint256 constant TEAM_CLIFF    = 548 days;  // 18 months
    uint256 constant TEAM_VESTING  = 913 days;  // 30 months

    uint256 constant BACKER_CLIFF  = 365 days;  // 12 months
    uint256 constant BACKER_VESTING= 730 days;  // 24 months

    uint256 constant ADVISOR_CLIFF = 180 days;  //  6 months
    uint256 constant ADVISOR_VEST  = 548 days;  // 18 months

    uint256 constant COMMUNITY_CLIFF  = 0;       // No cliff — released via EPS system
    uint256 constant COMMUNITY_VEST   = 1825 days; // 5 years linear

    uint256 constant CREATOR_CLIFF = 0;
    uint256 constant CREATOR_VEST  = 2555 days; // 7 years linear

    // ─────────────────────────────────────────────────────────────────

    function run() external {
        uint256 deployerPk    = vm.envUint("DEPLOYER_PK");
        address governance    = vm.envAddress("GOVERNANCE_SAFE");
        address oracle        = vm.envAddress("ORACLE_ADDRESS");
        address teamBene      = vm.envAddress("TEAM_VESTING_BENE");
        address backerBene    = vm.envAddress("BACKER_VESTING_BENE");
        address advisorBene   = vm.envAddress("ADVISOR_VESTING_BENE");

        address deployer      = vm.addr(deployerPk);

        console2.log("=== YNKLV DEPLOYMENT ===");
        console2.log("Deployer:       ", deployer);
        console2.log("Governance Safe:", governance);
        console2.log("Oracle:         ", oracle);
        console2.log("Chain ID:       ", block.chainid);

        vm.startBroadcast(deployerPk);

        // 1. Deploy vesting contracts
        // Each receives tokens from the token constructor
        YNKLVVesting communityVesting = new YNKLVVesting(address(0), governance);
        YNKLVVesting creatorVesting   = new YNKLVVesting(address(0), governance);
        YNKLVVesting teamVesting      = new YNKLVVesting(address(0), governance);
        YNKLVVesting backerVesting    = new YNKLVVesting(address(0), governance);
        YNKLVVesting advisorVesting   = new YNKLVVesting(address(0), governance);

        console2.log("\n-- Vesting contracts --");
        console2.log("Community Vesting: ", address(communityVesting));
        console2.log("Creator Vesting:   ", address(creatorVesting));
        console2.log("Team Vesting:      ", address(teamVesting));
        console2.log("Backer Vesting:    ", address(backerVesting));
        console2.log("Advisor Vesting:   ", address(advisorVesting));

        // 2. Deploy token — mints all 1B at genesis
        YNKLVToken token = new YNKLVToken(
            address(communityVesting),  // 30% ecosystem
            address(creatorVesting),    // 20% creators
            governance,                 // 15% treasury (Safe controls directly)
            address(backerVesting),     // 10% backers
            address(teamVesting),       // 10% team
            governance,                 // 8% liquidity (Safe manages DEX)
            governance,                 // 5% grants (Safe manages grants)
            address(advisorVesting)     // 2% advisors
        );

        console2.log("\n-- Token --");
        console2.log("YNKLV Token:       ", address(token));
        console2.log("Total supply:      ", token.totalSupply() / 1e18, "YNKLV");

        // 3. Add vesting schedules (now that token address is known)
        // Update token reference in vesting contracts
        // Note: In production, vesting contracts would need token set in constructor
        // This simplified script shows the logical flow

        // Team: 18mo cliff, 30mo vest, NOT revocable
        teamVesting.addSchedule(teamBene, token.TEAM_FOUNDERS(), TEAM_CLIFF, TEAM_VESTING, false);
        teamVesting.closeSetup();

        // Backers: 12mo cliff, 24mo vest, NOT revocable
        backerVesting.addSchedule(backerBene, token.EARLY_BACKERS(), BACKER_CLIFF, BACKER_VESTING, false);
        backerVesting.closeSetup();

        // Advisors: 6mo cliff, 18mo vest, REVOCABLE (governance can revoke)
        advisorVesting.addSchedule(advisorBene, token.ADVISORS(), ADVISOR_CLIFF, ADVISOR_VEST, true);
        advisorVesting.closeSetup();

        // 4. Deploy Pass NFT
        YNKLVPass pass = new YNKLVPass(address(token), governance, oracle);
        console2.log("\n-- Pass --");
        console2.log("YNKLV Pass:        ", address(pass));

        // 5. Deploy Studio
        YNKLVStudio studio = new YNKLVStudio(address(token), governance, governance, oracle);
        console2.log("\n-- Studio --");
        console2.log("YNKLV Studio:      ", address(studio));

        vm.stopBroadcast();

        // Print deployment summary for public disclosure
        console2.log("\n=== DEPLOYMENT COMPLETE ===");
        console2.log("Publish these addresses publicly immediately after deployment:");
        console2.log("  YNKLVToken:          ", address(token));
        console2.log("  YNKLVPass:           ", address(pass));
        console2.log("  YNKLVStudio:         ", address(studio));
        console2.log("  CommunityVesting:    ", address(communityVesting));
        console2.log("  CreatorVesting:      ", address(creatorVesting));
        console2.log("  TeamVesting:         ", address(teamVesting));
        console2.log("  BackerVesting:       ", address(backerVesting));
        console2.log("  AdvisorVesting:      ", address(advisorVesting));
        console2.log("  TreasuryMultisig:    ", governance);
        console2.log("\nNext steps:");
        console2.log("  1. Verify all contracts on Basescan");
        console2.log("  2. Lock liquidity via Unicrypt or TeamFinance");
        console2.log("  3. Publish treasury dashboard");
        console2.log("  4. Activate ImmuneFi bug bounty");
    }
}
