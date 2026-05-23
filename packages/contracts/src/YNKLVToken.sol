// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { ERC20Votes } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { Nonces } from "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title  YNKLVToken
 * @notice The canonical YNKLV utility token — on-chain name: KLVCOIN, symbol: YNKLV.
 *
 * Design properties
 * ─────────────────
 *   • Fixed supply of 1,000,000,000 YNKLV minted once at genesis to the deployer.
 *     No mint function exists after construction. Supply is permanently fixed.
 *   • ERC20Burnable — ecosystem contracts call burn() as utility value flows.
 *   • ERC20Permit (EIP-2612) — gasless approvals; critical for low-fee African UX.
 *   • ERC20Votes — on-chain governance via OpenZeppelin Governor; no separate wrapper needed.
 *   • Pausable — emergency pause guarded by PAUSER_ROLE (multisig / timelock).
 *   • AccessControl — DEFAULT_ADMIN_ROLE to rotate keys, PAUSER_ROLE to pause/unpause.
 *
 * Compliance note
 * ───────────────
 *   YNKLV is a UTILITY token. This contract confers no right to financial
 *   returns, distributions, dividends, yield, or profit of any kind.
 *   Token utility is limited to access and participation in the Zamani ecosystem.
 *
 * Total supply: 1,000,000,000 YNKLV (minted entirely to deployer at construction)
 */
contract YNKLVToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Pausable, AccessControl {

    // ─── Roles ────────────────────────────────────────────────────────────────

    /// @notice May pause and unpause all token transfers (emergency only).
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ─── Supply ───────────────────────────────────────────────────────────────

    /// @notice Total fixed supply: 1,000,000,000 YNKLV expressed in wei (18 decimals).
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000e18;

    // ─── Construction ─────────────────────────────────────────────────────────

    /**
     * @param admin  Address granted DEFAULT_ADMIN_ROLE and PAUSER_ROLE.
     *               Should be a multisig or timelock in production.
     */
    constructor(address admin) ERC20("KLVCOIN", "YNKLV") ERC20Permit("KLVCOIN") {
        require(admin != address(0), "YNKLVToken: zero admin");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        // Mint entire fixed supply to deployer. No further minting is possible.
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    // ─── Pause controls ───────────────────────────────────────────────────────

    /// @notice Pause all token transfers. Restricted to PAUSER_ROLE.
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Unpause token transfers. Restricted to PAUSER_ROLE.
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ─── Required overrides (OZ v5 multi-inheritance) ─────────────────────────

    /// @dev Enforce pause and update ERC20Votes checkpoints on every transfer.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        if (paused()) {
            // Burns are still permitted while paused (from != address(0) check
            // handled by ERC20Burnable which calls this). We allow burns even
            // when paused so ecosystem contracts can process obligations.
            // Standard transfers are blocked.
            if (from != address(0) && to != address(0)) {
                _requireNotPaused();
            }
        }
        super._update(from, to, value);
    }

    /// @dev Deduplicate nonce implementations from ERC20Permit and Nonces.
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    // ─── No other functions ───────────────────────────────────────────────────
    //
    // There is no mint function, no fee switch, no blacklist, no upgrade proxy.
    // All authority over supply ended at the constructor. Verify on Basescan.
}
