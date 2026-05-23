// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { CreatorRewardsDistributor } from "../src/CreatorRewardsDistributor.sol";
import { MockYNKLV } from "./mocks/MockYNKLV.sol";

contract CreatorRewardsDistributorTest is Test {
    MockYNKLV internal token;
    CreatorRewardsDistributor internal dist;

    address internal admin = address(0xA11CE);
    address internal treasury = address(0x7EA5);
    address internal creator = address(0xC0DE);
    address internal buyer = address(0xB0B);

    function setUp() public {
        token = new MockYNKLV(1_000_000_000e18);
        dist = new CreatorRewardsDistributor(address(token), treasury, admin);

        token.transfer(buyer, 1_000_000e18);
        vm.prank(buyer);
        token.approve(address(dist), type(uint256).max);
    }

    function test_SplitIsExactly90_8_5_1_5() public {
        uint256 amount = 10_000e18;
        uint256 supplyBefore = token.totalSupply();

        vm.prank(buyer);
        (uint256 toCreator, uint256 toTreasury, uint256 burned) = dist.purchase(creator, 42, amount);

        assertEq(toTreasury, (amount * 850) / 10_000); // 8.5%
        assertEq(burned, (amount * 150) / 10_000); // 1.5%
        assertEq(toCreator, amount - toTreasury - burned); // remainder ~90%

        assertEq(token.balanceOf(creator), toCreator);
        assertEq(token.balanceOf(treasury), toTreasury);
        assertEq(token.totalSupply(), supplyBefore - burned);
    }

    function test_SplitSumsToInput() public {
        uint256 amount = 12_345e18;
        vm.prank(buyer);
        (uint256 c, uint256 t, uint256 b) = dist.purchase(creator, 1, amount);
        assertEq(c + t + b, amount);
    }

    function test_AccountingAccumulates() public {
        vm.startPrank(buyer);
        dist.purchase(creator, 1, 1_000e18);
        dist.purchase(creator, 2, 1_000e18);
        vm.stopPrank();

        assertGt(dist.lifetimeEarned(creator), 0);
        assertEq(dist.totalToTreasury(), (2_000e18 * 850) / 10_000);
        assertEq(dist.totalBurned(), (2_000e18 * 150) / 10_000);
    }

    function test_ZeroAmountReverts() public {
        vm.prank(buyer);
        vm.expectRevert(CreatorRewardsDistributor.ZeroAmount.selector);
        dist.purchase(creator, 1, 0);
    }

    function test_ZeroCreatorReverts() public {
        vm.prank(buyer);
        vm.expectRevert(CreatorRewardsDistributor.ZeroAddress.selector);
        dist.purchase(address(0), 1, 1_000e18);
    }

    function test_PauseBlocksPurchase() public {
        vm.prank(admin);
        dist.pause();
        vm.prank(buyer);
        vm.expectRevert();
        dist.purchase(creator, 1, 1_000e18);
    }

    function test_GovernorCanUpdateTreasury() public {
        address newTreasury = address(0xFEE5);
        vm.prank(admin);
        dist.setTreasury(newTreasury);
        assertEq(dist.treasury(), newTreasury);
    }

    function testFuzz_SplitConservation(uint96 amount) public {
        vm.assume(amount > 0);
        token.transfer(buyer, amount);
        vm.prank(buyer);
        (uint256 c, uint256 t, uint256 b) = dist.purchase(creator, 1, amount);
        assertEq(c + t + b, amount);
        // Creator always receives at least the other two combined (>=90%).
        assertGe(c, t + b);
    }
}
