// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title IYNKLV
/// @notice Minimal interface to the YNKLV token used by ecosystem contracts.
/// @dev The YNKLV token is a fixed-supply ERC20Burnable. It exposes no mint
///      function and no admin authority over balances.
interface IYNKLV is IERC20 {
    /// @notice Burns `amount` tokens from the caller's balance.
    function burn(uint256 amount) external;

    /// @notice Burns `amount` tokens from `account` using the caller's allowance.
    function burnFrom(address account, uint256 amount) external;
}
