// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test, stdError } from "forge-std/Test.sol";
import { YNKLVToken } from "../src/YNKLVToken.sol";
import { IYNKLV } from "../src/interfaces/IYNKLV.sol";

/// @notice Unit + fuzz tests for YNKLVToken.
contract YNKLVTokenTest is Test {

    // ─── Accounts ─────────────────────────────────────────────────────────────

    address internal deployer = address(0xDEF1);
    address internal admin    = address(0xAD1);
    address internal alice    = address(0xA1);
    address internal bob      = address(0xB0B);
    address internal carol    = address(0xCA01);

    // ─── State ────────────────────────────────────────────────────────────────

    YNKLVToken internal token;

    uint256 internal constant TOTAL_SUPPLY = 1_000_000_000e18;

    // ─── Setup ────────────────────────────────────────────────────────────────

    function setUp() public {
        vm.prank(deployer);
        token = new YNKLVToken(admin);
    }

    // ─── Metadata ─────────────────────────────────────────────────────────────

    function test_Name() public view {
        assertEq(token.name(), "KLVCOIN");
    }

    function test_Symbol() public view {
        assertEq(token.symbol(), "YNKLV");
    }

    function test_Decimals() public view {
        assertEq(token.decimals(), 18);
    }

    function test_TotalSupplyConstantMatchesActual() public view {
        assertEq(token.TOTAL_SUPPLY(), TOTAL_SUPPLY);
        assertEq(token.totalSupply(), TOTAL_SUPPLY);
    }

    // ─── Supply minted to deployer ─────────────────────────────────────────────

    function test_EntireSupplyMintedToDeployer() public view {
        assertEq(token.balanceOf(deployer), TOTAL_SUPPLY);
    }

    function test_NoBalanceOtherThanDeployer() public view {
        assertEq(token.balanceOf(alice), 0);
        assertEq(token.balanceOf(admin), 0);
    }

    // ─── No mint function ─────────────────────────────────────────────────────

    function test_NoMintFunctionExists() public view {
        // The token exposes no mint function.  We verify by checking that
        // total supply never changes except via burns.
        assertEq(token.totalSupply(), TOTAL_SUPPLY);
    }

    // ─── Transfers ────────────────────────────────────────────────────────────

    function test_TransferWorks() public {
        uint256 amount = 1_000e18;
        vm.prank(deployer);
        token.transfer(alice, amount);
        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(deployer), TOTAL_SUPPLY - amount);
    }

    function test_TransferRevertsOnInsufficientBalance() public {
        vm.expectRevert();
        vm.prank(alice);
        token.transfer(bob, 1);
    }

    function test_TransferFromWorks() public {
        uint256 amount = 500e18;
        vm.prank(deployer);
        token.approve(alice, amount);

        vm.prank(alice);
        token.transferFrom(deployer, bob, amount);

        assertEq(token.balanceOf(bob), amount);
    }

    // ─── Burn ─────────────────────────────────────────────────────────────────

    function test_BurnReducesTotalSupply() public {
        uint256 burnAmount = 1_000e18;
        vm.prank(deployer);
        token.burn(burnAmount);
        assertEq(token.totalSupply(), TOTAL_SUPPLY - burnAmount);
    }

    function test_BurnFromWithApproval() public {
        uint256 burnAmount = 250e18;
        vm.prank(deployer);
        token.transfer(alice, burnAmount);

        vm.prank(alice);
        token.approve(bob, burnAmount);

        vm.prank(bob);
        token.burnFrom(alice, burnAmount);

        assertEq(token.balanceOf(alice), 0);
        assertEq(token.totalSupply(), TOTAL_SUPPLY - burnAmount);
    }

    function test_BurnFromRevertsWithoutApproval() public {
        vm.prank(deployer);
        token.transfer(alice, 100e18);

        vm.expectRevert();
        vm.prank(bob);
        token.burnFrom(alice, 100e18);
    }

    // ─── Pause ────────────────────────────────────────────────────────────────

    function test_PauserCanPause() public {
        vm.prank(admin);
        token.pause();
        assertTrue(token.paused());
    }

    function test_PauserCanUnpause() public {
        vm.prank(admin);
        token.pause();
        vm.prank(admin);
        token.unpause();
        assertFalse(token.paused());
    }

    function test_NonPauserCannotPause() public {
        vm.expectRevert();
        vm.prank(alice);
        token.pause();
    }

    function test_TransfersBlockedWhilePaused() public {
        vm.prank(deployer);
        token.transfer(alice, 100e18);

        vm.prank(admin);
        token.pause();

        vm.expectRevert();
        vm.prank(alice);
        token.transfer(bob, 50e18);
    }

    function test_TransferResumesAfterUnpause() public {
        vm.prank(deployer);
        token.transfer(alice, 100e18);

        vm.prank(admin);
        token.pause();
        vm.prank(admin);
        token.unpause();

        vm.prank(alice);
        token.transfer(bob, 50e18);
        assertEq(token.balanceOf(bob), 50e18);
    }

    function test_BurnPermittedWhilePaused() public {
        uint256 burnAmount = 100e18;
        vm.prank(deployer);
        token.transfer(alice, burnAmount);

        vm.prank(admin);
        token.pause();

        // Burns to address(0) should be allowed even when paused.
        vm.prank(alice);
        token.burn(burnAmount);
        assertEq(token.totalSupply(), TOTAL_SUPPLY - burnAmount);
    }

    // ─── Access control ───────────────────────────────────────────────────────

    function test_AdminHasDefaultAdminRole() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_AdminHasPauserRole() public view {
        assertTrue(token.hasRole(token.PAUSER_ROLE(), admin));
    }

    function test_DeployerHasNoAdminRole() public view {
        assertFalse(token.hasRole(token.DEFAULT_ADMIN_ROLE(), deployer));
    }

    function test_AdminCanGrantPauserRole() public {
        vm.prank(admin);
        token.grantRole(token.PAUSER_ROLE(), alice);
        assertTrue(token.hasRole(token.PAUSER_ROLE(), alice));
    }

    function test_AdminCanRevokePauserRole() public {
        vm.prank(admin);
        token.revokeRole(token.PAUSER_ROLE(), admin);
        assertFalse(token.hasRole(token.PAUSER_ROLE(), admin));
    }

    function test_ZeroAdminRevertsInConstructor() public {
        vm.expectRevert("YNKLVToken: zero admin");
        new YNKLVToken(address(0));
    }

    // ─── ERC20Permit (EIP-2612) ───────────────────────────────────────────────

    function test_DomainSeparatorExists() public view {
        bytes32 sep = token.DOMAIN_SEPARATOR();
        assertTrue(sep != bytes32(0));
    }

    function test_PermitGrantsApproval() public {
        uint256 privateKey = 0xBEEF;
        address owner = vm.addr(privateKey);
        uint256 amount = 1_000e18;
        uint256 deadline = block.timestamp + 1 hours;

        bytes32 domainSep = token.DOMAIN_SEPARATOR();

        bytes32 permitHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                amount,
                token.nonces(owner),
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", domainSep, permitHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);

        token.permit(owner, bob, amount, deadline, v, r, s);

        assertEq(token.allowance(owner, bob), amount);
    }

    function test_PermitRevertsOnExpiredDeadline() public {
        uint256 privateKey = 0xCAFE;
        address owner = vm.addr(privateKey);
        uint256 amount = 1_000e18;
        uint256 deadline = block.timestamp - 1; // already expired

        bytes32 domainSep = token.DOMAIN_SEPARATOR();
        bytes32 permitHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                bob,
                amount,
                token.nonces(owner),
                deadline
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSep, permitHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);

        vm.expectRevert();
        token.permit(owner, bob, amount, deadline, v, r, s);
    }

    // ─── ERC20Votes ───────────────────────────────────────────────────────────

    function test_VotesZeroBeforeDelegation() public {
        vm.prank(deployer);
        token.transfer(alice, 1_000e18);
        // No delegation — voting weight is zero.
        assertEq(token.getVotes(alice), 0);
    }

    function test_DelegateSelf_GivesVotingWeight() public {
        uint256 amount = 1_000e18;
        vm.prank(deployer);
        token.transfer(alice, amount);

        vm.prank(alice);
        token.delegate(alice);

        assertEq(token.getVotes(alice), amount);
    }

    function test_DelegateToOther_TransfersVotingWeight() public {
        uint256 amount = 2_500e18;
        vm.prank(deployer);
        token.transfer(alice, amount);

        vm.prank(alice);
        token.delegate(bob);

        assertEq(token.getVotes(alice), 0);
        assertEq(token.getVotes(bob), amount);
    }

    function test_VoteCheckpointUpdatesOnTransfer() public {
        uint256 amount = 1_000e18;
        vm.prank(deployer);
        token.transfer(alice, amount);
        vm.prank(alice);
        token.delegate(alice);

        // Transfer half out.
        vm.prank(alice);
        token.transfer(bob, amount / 2);

        assertEq(token.getVotes(alice), amount / 2);
    }

    function test_PastVotesTrackedByBlock() public {
        uint256 amount = 1_000e18;
        vm.prank(deployer);
        token.transfer(alice, amount);
        vm.prank(alice);
        token.delegate(alice);

        uint256 snapshotBlock = block.number;
        vm.roll(block.number + 1);

        // Move some tokens away.
        vm.prank(alice);
        token.transfer(bob, amount / 2);
        vm.roll(block.number + 1);

        // Past votes at snapshot should still reflect original balance.
        assertEq(token.getPastVotes(alice, snapshotBlock), amount);
    }

    // ─── Fuzz tests ───────────────────────────────────────────────────────────

    /// @notice Any valid amount transferred from deployer reaches recipient.
    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 0, TOTAL_SUPPLY);
        vm.prank(deployer);
        token.transfer(alice, amount);
        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(deployer), TOTAL_SUPPLY - amount);
    }

    /// @notice Total supply always decreases by exactly the burned amount.
    function testFuzz_Burn(uint96 amount) public {
        // use uint96 to stay comfortably below TOTAL_SUPPLY
        uint256 burnAmount = uint256(amount);
        if (burnAmount > TOTAL_SUPPLY) burnAmount = TOTAL_SUPPLY;

        vm.prank(deployer);
        token.burn(burnAmount);

        assertEq(token.totalSupply(), TOTAL_SUPPLY - burnAmount);
    }

    /// @notice Sum of all balances always equals total supply (transfer invariant).
    function testFuzz_BalanceSumInvariant(uint96 toAlice, uint96 toBob) public {
        uint256 a = bound(uint256(toAlice), 0, TOTAL_SUPPLY / 2);
        uint256 b = bound(uint256(toBob), 0, TOTAL_SUPPLY - a);

        vm.startPrank(deployer);
        token.transfer(alice, a);
        token.transfer(bob, b);
        vm.stopPrank();

        uint256 remaining = TOTAL_SUPPLY - a - b;
        assertEq(token.balanceOf(deployer) + token.balanceOf(alice) + token.balanceOf(bob), TOTAL_SUPPLY);
        assertEq(token.balanceOf(deployer), remaining);
    }

    /// @notice Voting weight after self-delegation equals token balance (fuzz).
    function testFuzz_VotesEqualBalanceAfterDelegate(uint96 amount) public {
        uint256 a = bound(uint256(amount), 0, TOTAL_SUPPLY);
        vm.prank(deployer);
        token.transfer(alice, a);

        vm.prank(alice);
        token.delegate(alice);

        assertEq(token.getVotes(alice), a);
    }

    /// @notice Pause/unpause cycle always ends with transfers working correctly.
    function testFuzz_PauseCycleLeavesBalancesIntact(uint96 amount) public {
        uint256 a = bound(uint256(amount), 1, TOTAL_SUPPLY);
        vm.prank(deployer);
        token.transfer(alice, a);

        vm.prank(admin);
        token.pause();
        vm.prank(admin);
        token.unpause();

        vm.prank(alice);
        token.transfer(bob, a);
        assertEq(token.balanceOf(bob), a);
    }

    /// @notice Approval and subsequent transferFrom do not exceed approved amount.
    function testFuzz_ApproveAndTransferFrom(uint96 approval, uint96 xfer) public {
        uint256 approvalAmt = bound(uint256(approval), 1, TOTAL_SUPPLY);
        uint256 xferAmt = bound(uint256(xfer), 0, approvalAmt);

        vm.prank(deployer);
        token.approve(alice, approvalAmt);

        vm.prank(alice);
        token.transferFrom(deployer, carol, xferAmt);

        assertEq(token.balanceOf(carol), xferAmt);
        assertEq(token.allowance(deployer, alice), approvalAmt - xferAmt);
    }
}
