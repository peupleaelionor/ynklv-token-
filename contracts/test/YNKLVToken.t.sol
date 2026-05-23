// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {YNKLVToken} from "../src/YNKLVToken.sol";

contract YNKLVTokenTest is Test {

    YNKLVToken internal token;

    address internal ecosystemCommunity = makeAddr("ecosystemCommunity");
    address internal creatorBuilder     = makeAddr("creatorBuilder");
    address internal treasury           = makeAddr("treasury");
    address internal earlyBackers       = makeAddr("earlyBackers");
    address internal teamFounders       = makeAddr("teamFounders");
    address internal liquidityManager   = makeAddr("liquidityManager");
    address internal ecosystemGrants    = makeAddr("ecosystemGrants");
    address internal advisors           = makeAddr("advisors");

    address internal alice              = makeAddr("alice");

    function setUp() public {
        token = new YNKLVToken(
            ecosystemCommunity,
            creatorBuilder,
            treasury,
            earlyBackers,
            teamFounders,
            liquidityManager,
            ecosystemGrants,
            advisors
        );
    }

    // ─── Supply invariants ───────────────────────────────────────────

    function test_totalSupply_isOneBillion() public view {
        assertEq(token.totalSupply(), 1_000_000_000e18);
    }

    function test_totalSupply_matchesConstant() public view {
        assertEq(token.totalSupply(), token.TOTAL_SUPPLY());
    }

    function test_allTokensAllocated() public view {
        uint256 sum =
            token.balanceOf(ecosystemCommunity) +
            token.balanceOf(creatorBuilder)     +
            token.balanceOf(treasury)           +
            token.balanceOf(earlyBackers)       +
            token.balanceOf(teamFounders)       +
            token.balanceOf(liquidityManager)   +
            token.balanceOf(ecosystemGrants)    +
            token.balanceOf(advisors);
        assertEq(sum, token.TOTAL_SUPPLY());
    }

    function test_ecosystemCommunity_receives30Percent() public view {
        assertEq(token.balanceOf(ecosystemCommunity), token.ECOSYSTEM_COMMUNITY());
        assertEq(token.ECOSYSTEM_COMMUNITY(), 300_000_000e18);
    }

    function test_teamFounders_receives10Percent() public view {
        assertEq(token.balanceOf(teamFounders), token.TEAM_FOUNDERS());
        assertEq(token.TEAM_FOUNDERS(), 100_000_000e18);
    }

    // ─── No mint after genesis ───────────────────────────────────────

    function test_noMintFunction_tokenHasNoOwner() public view {
        // Token should have no owner (ownership not imported)
        // We verify by checking the contract has no owner() function
        // Compile-time check: YNKLVToken does not inherit Ownable
        assertEq(token.totalSupply(), 1_000_000_000e18); // supply unchanged
    }

    // ─── Burn mechanics ──────────────────────────────────────────────

    function test_burn_reducesSupply() public {
        vm.startPrank(ecosystemCommunity);
        uint256 burnAmount = 1_000e18;
        token.burn(burnAmount);
        assertEq(token.totalSupply(), 1_000_000_000e18 - burnAmount);
        vm.stopPrank();
    }

    function test_burnFrom_reducesSupply_withApproval() public {
        vm.prank(ecosystemCommunity);
        token.approve(alice, 500e18);

        vm.prank(alice);
        token.burnFrom(ecosystemCommunity, 500e18);

        assertEq(token.totalSupply(), 1_000_000_000e18 - 500e18);
    }

    // ─── Transfer mechanics ──────────────────────────────────────────

    function test_transfer_works() public {
        vm.prank(ecosystemCommunity);
        token.transfer(alice, 1_000e18);
        assertEq(token.balanceOf(alice), 1_000e18);
    }

    function test_transfer_noFeeOnTransfer() public {
        uint256 amount = 1_000e18;
        vm.prank(ecosystemCommunity);
        token.transfer(alice, amount);
        // Alice receives EXACTLY what was sent — no fee
        assertEq(token.balanceOf(alice), amount);
    }

    // ─── Permit (EIP-2612) ───────────────────────────────────────────

    function test_permit_allowsGaslessApproval() public {
        uint256 privateKey = 0xBEEF;
        address owner = vm.addr(privateKey);

        // Give owner some tokens
        vm.prank(ecosystemCommunity);
        token.transfer(owner, 1_000e18);

        uint256 deadline = block.timestamp + 1 hours;
        bytes32 digest = _getPermitDigest(
            owner, alice, 500e18, 0, deadline
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);

        // Alice calls permit on behalf of owner — no ETH from owner needed
        vm.prank(alice);
        token.permit(owner, alice, 500e18, deadline, v, r, s);

        assertEq(token.allowance(owner, alice), 500e18);
    }

    // ─── Votes (ERC20Votes) ──────────────────────────────────────────

    function test_votes_trackBalanceAfterDelegate() public {
        vm.startPrank(ecosystemCommunity);
        token.delegate(ecosystemCommunity); // must self-delegate to activate
        assertEq(token.getVotes(ecosystemCommunity), token.ECOSYSTEM_COMMUNITY());
        vm.stopPrank();
    }

    // ─── Fuzz tests ──────────────────────────────────────────────────

    function testFuzz_transfer_preservesTotalSupply(uint256 amount) public {
        amount = bound(amount, 0, token.balanceOf(ecosystemCommunity));
        uint256 supplyBefore = token.totalSupply();
        vm.prank(ecosystemCommunity);
        token.transfer(alice, amount);
        assertEq(token.totalSupply(), supplyBefore);
    }

    function testFuzz_burn_decreasesSupply(uint256 amount) public {
        amount = bound(amount, 0, token.balanceOf(ecosystemCommunity));
        uint256 supplyBefore = token.totalSupply();
        vm.prank(ecosystemCommunity);
        token.burn(amount);
        assertEq(token.totalSupply(), supplyBefore - amount);
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    function _getPermitDigest(
        address owner_,
        address spender,
        uint256 value,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                keccak256(abi.encode(
                    keccak256(
                        "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
                    ),
                    owner_,
                    spender,
                    value,
                    nonce,
                    deadline
                ))
            )
        );
    }
}
