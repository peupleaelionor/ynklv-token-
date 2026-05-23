// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import { IVotes } from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/// @title IYNKLV
/// @notice Full interface for the YNKLV token used by ecosystem contracts.
/// @dev The YNKLV token is a fixed-supply ERC20Burnable+Permit+Votes token.
///      It exposes no mint function and no admin authority over balances.
///      Pausing (emergency-only) is enforced at the contract level and does
///      not affect the interface surface here.
interface IYNKLV is IERC20, IERC20Permit, IVotes {
    // ─── Burn ─────────────────────────────────────────────────────────────────

    /// @notice Burns `amount` tokens from the caller's balance.
    function burn(uint256 amount) external;

    /// @notice Burns `amount` tokens from `account` using the caller's allowance.
    function burnFrom(address account, uint256 amount) external;

    // ─── Permit (EIP-2612) — inherited from IERC20Permit ─────────────────────
    //
    // permit(owner, spender, value, deadline, v, r, s)
    // nonces(owner)
    // DOMAIN_SEPARATOR()

    // ─── Votes (EIP-5805) — inherited from IVotes ─────────────────────────────
    //
    // getVotes(account)           → current voting weight
    // getPastVotes(account, timepoint)
    // getPastTotalSupply(timepoint)
    // delegates(account)
    // delegate(delegatee)
    // delegateBySig(delegatee, nonce, expiry, v, r, s)

    // ─── Supply constant ─────────────────────────────────────────────────────

    /// @notice The fixed total supply: 1,000,000,000 YNKLV in wei.
    function TOTAL_SUPPLY() external view returns (uint256);
}
