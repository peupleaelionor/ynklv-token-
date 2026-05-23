// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { MembershipRegistry } from "../src/MembershipRegistry.sol";
import { MockYNKLV } from "./mocks/MockYNKLV.sol";

contract MembershipRegistryTest is Test {
    MockYNKLV internal token;
    MembershipRegistry internal registry;

    address internal admin = address(0xA11CE);
    address internal scorer = address(0x5C04E2);
    address internal alice = address(0xA1);
    address internal bob = address(0xB0B);

    function setUp() public {
        token = new MockYNKLV(1_000_000_000e18);
        registry = new MembershipRegistry(address(token), admin);

        vm.prank(admin);
        registry.grantRole(registry.SCORER_ROLE(), scorer);
    }

    function test_DefaultTierIsObserver() public view {
        assertEq(registry.tierOf(alice), 0);
    }

    function test_BalanceAloneInsufficientWithoutScore() public {
        token.transfer(alice, 100e18);
        // Builder requires balance >= 100 AND score >= 100.
        assertEq(registry.tierOf(alice), 0);
    }

    function test_BalanceAndScoreReachBuilder() public {
        token.transfer(alice, 100e18);
        vm.prank(scorer);
        registry.awardContribution(alice, 100);
        assertEq(registry.tierOf(alice), 1);
    }

    function test_HighestSatisfiedTierWins() public {
        token.transfer(alice, 10_000e18);
        vm.prank(scorer);
        registry.awardContribution(alice, 2_500);
        assertEq(registry.tierOf(alice), 4); // Guardian
    }

    function test_GenesisTimestampSetOnFirstAward() public {
        assertEq(registry.genesisTimestamp(alice), 0);
        vm.prank(scorer);
        registry.awardContribution(alice, 10);
        assertEq(registry.genesisTimestamp(alice), uint64(block.timestamp));
    }

    function test_OnlyScorerCanAward() public {
        vm.expectRevert();
        vm.prank(bob);
        registry.awardContribution(alice, 100);
    }

    function test_SlashIsGovernorOnly() public {
        vm.prank(scorer);
        registry.awardContribution(alice, 500);

        vm.expectRevert();
        vm.prank(scorer);
        registry.slashContribution(alice, 100);

        vm.prank(admin);
        registry.slashContribution(alice, 200);
        assertEq(registry.contributionScore(alice), 300);
    }

    function test_SlashCannotUnderflow() public {
        vm.prank(scorer);
        registry.awardContribution(alice, 50);
        vm.prank(admin);
        registry.slashContribution(alice, 1_000);
        assertEq(registry.contributionScore(alice), 0);
    }

    function test_SetThresholdRespectsBounds() public {
        vm.prank(admin);
        vm.expectRevert(MembershipRegistry.ThresholdTooHigh.selector);
        registry.setThreshold(1, 2_000_000e18, 0);
    }

    function test_CannotSetObserverThreshold() public {
        vm.prank(admin);
        vm.expectRevert(MembershipRegistry.InvalidTier.selector);
        registry.setThreshold(0, 1, 1);
    }

    function test_PauseBlocksAwards() public {
        vm.prank(admin);
        registry.pause();
        vm.expectRevert();
        vm.prank(scorer);
        registry.awardContribution(alice, 10);
    }

    function testFuzz_TierMonotonicInScore(uint96 bal, uint32 score) public {
        token.transfer(alice, bal);
        vm.prank(scorer);
        registry.awardContribution(alice, score);
        uint256 t = registry.tierOf(alice);
        assertLe(t, 4);
    }
}
