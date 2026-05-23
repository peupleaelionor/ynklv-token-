// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @notice Test-only fixed-supply burnable token mirroring YNKLV's surface.
contract MockYNKLV is ERC20, ERC20Burnable {
    constructor(uint256 supply) ERC20("YNKLV", "YNKLV") {
        _mint(msg.sender, supply);
    }
}
