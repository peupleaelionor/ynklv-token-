// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { EcosystemRewardsVault } from "../src/EcosystemRewardsVault.sol";
import { MockYNKLV } from "./mocks/MockYNKLV.sol";

contract EcosystemRewardsVaultTest is Test {
    MockYNKLV internal token;
    EcosystemRewardsVault internal vault;

    address internal admin = address(0xA11CE);
    address internal distributor = address(0xD15);
    address internal alice = address(0xA1);
    address internal bob = address(0xB0B);

    uint256 internal constant BUDGET = 1_000_000e18;

    function setUp() public {
        token = new MockYNKLV(1_000_000_000e18);
        vault = new EcosystemRewardsVault(address(token), admin, BUDGET);

        vm.prank(admin);
        vault.grantRole(vault.DISTRIBUTOR_ROLE(), distributor);

        // Fund the vault.
        token.transfer(address(vault), 10_000_000e18);
    }

    function test_AllocateThenClaim() public {
        vm.prank(distributor);
        vault.allocate(alice, 1_000e18, "epoch-1 contribution");

        assertEq(vault.claimable(alice), 1_000e18);
        assertEq(vault.totalOutstanding(), 1_000e18);

        vm.prank(alice);
        uint256 claimed = vault.claim();

        assertEq(claimed, 1_000e18);
        assertEq(token.balanceOf(alice), 1_000e18);
        assertEq(vault.claimable(alice), 0);
        assertEq(vault.totalOutstanding(), 0);
        assertEq(vault.lifetimeClaimed(alice), 1_000e18);
    }

    function test_CannotExceedEpochBudget() public {
        vm.prank(admin);
        vault.setEpochBudget(500e18);

        vm.prank(distributor);
        vm.expectRevert(EcosystemRewardsVault.BudgetExceeded.selector);
        vault.allocate(alice, 501e18, "too much");
    }

    function test_CannotReserveMoreThanBalance() public {
        // New vault with budget but no funding.
        EcosystemRewardsVault empty = new EcosystemRewardsVault(address(token), admin, BUDGET);
        vm.prank(admin);
        empty.grantRole(empty.DISTRIBUTOR_ROLE(), distributor);

        vm.prank(distributor);
        vm.expectRevert(EcosystemRewardsVault.InsufficientUnreservedBalance.selector);
        empty.allocate(alice, 1e18, "unfunded");
    }

    function test_RollEpochResetsCounter() public {
        vm.prank(distributor);
        vault.allocate(alice, 1_000e18, "e1");
        assertEq(vault.epochAllocated(), 1_000e18);

        vm.prank(distributor);
        vault.rollEpoch();

        assertEq(vault.epoch(), 1);
        assertEq(vault.epochAllocated(), 0);
        // Outstanding obligation persists across epochs.
        assertEq(vault.totalOutstanding(), 1_000e18);
    }

    function test_ClaimNothingReverts() public {
        vm.prank(bob);
        vm.expectRevert(EcosystemRewardsVault.NothingToClaim.selector);
        vault.claim();
    }

    function test_SweepCannotTakeReservedFunds() public {
        vm.prank(distributor);
        vault.allocate(alice, 9_999_999e18, "almost all");

        uint256 unreserved = token.balanceOf(address(vault)) - vault.totalOutstanding();
        vm.prank(admin);
        vm.expectRevert(EcosystemRewardsVault.InsufficientUnreservedBalance.selector);
        vault.sweepUnreserved(admin, unreserved + 1);
    }

    function test_PauseBlocksClaim() public {
        vm.prank(distributor);
        vault.allocate(alice, 1_000e18, "e1");
        vm.prank(admin);
        vault.pause();
        vm.prank(alice);
        vm.expectRevert();
        vault.claim();
    }

    function test_OnlyDistributorAllocates() public {
        vm.prank(bob);
        vm.expectRevert();
        vault.allocate(alice, 1e18, "nope");
    }

    function invariant_OutstandingNeverExceedsBalance() public view {
        assertLe(vault.totalOutstanding(), token.balanceOf(address(vault)));
    }
}
