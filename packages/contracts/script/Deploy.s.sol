// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { MembershipRegistry } from "../src/MembershipRegistry.sol";
import { EcosystemRewardsVault } from "../src/EcosystemRewardsVault.sol";
import { CreatorRewardsDistributor } from "../src/CreatorRewardsDistributor.sol";

/// @notice Deploys the YNKLV ecosystem utility contracts.
/// @dev Requires env: YNKLV_TOKEN_ADDRESS, TREASURY_ADDRESS, ADMIN_ADDRESS.
///      ADMIN_ADDRESS should be a multisig (the Indaba/Council), never an EOA
///      in production. Roles are assigned to the admin and then narrowed via
///      governance once the timelock and operational accounts are live.
contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address token = vm.envAddress("YNKLV_TOKEN_ADDRESS");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address admin = vm.envAddress("ADMIN_ADDRESS");

        uint256 initialEpochBudget = vm.envOr("REWARDS_EPOCH_BUDGET", uint256(1_000_000e18));

        vm.startBroadcast(deployerKey);

        MembershipRegistry registry = new MembershipRegistry(token, admin);
        EcosystemRewardsVault vault = new EcosystemRewardsVault(token, admin, initialEpochBudget);
        CreatorRewardsDistributor distributor = new CreatorRewardsDistributor(token, treasury, admin);

        vm.stopBroadcast();

        console2.log("=== YNKLV Ecosystem Deployment ===");
        console2.log("Network chainid:        ", block.chainid);
        console2.log("YNKLV token:            ", token);
        console2.log("Treasury (Baraka):      ", treasury);
        console2.log("Admin (multisig):       ", admin);
        console2.log("MembershipRegistry:     ", address(registry));
        console2.log("EcosystemRewardsVault:  ", address(vault));
        console2.log("CreatorRewardsDistributor:", address(distributor));
        console2.log("Epoch budget (wei):     ", initialEpochBudget);
        console2.log("Remember: assign SCORER_ROLE to the indexer, narrow admin to timelock.");
    }
}
