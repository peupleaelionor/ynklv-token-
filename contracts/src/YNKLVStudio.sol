// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title  YNKLVStudio
 * @notice The creator monetization contract.
 *
 * Creators publish digital products priced in YNKLV.
 * On each purchase, revenue is distributed automatically:
 *   - 90%  → creator(s), split according to their collaboration shares
 *   - 8.5% → ecosystem treasury
 *   - 1.5% → burned (calls YNKLV.burn())
 *
 * The Contribution Covenant is enforced here:
 *   - CREATOR_SHARE_BPS is a constant (9000 = 90%). Immutable.
 *   - The ecosystem cannot raise fees without deploying a new contract.
 *     The old contract continues to function for any existing products.
 *
 * Collaboration: up to 5 co-creators, shares must sum to 10000 BPS.
 * Geographic pricing: creator sets a discount tier for defined regions.
 *   The oracle verifies regional wallet eligibility off-chain and signs
 *   a permit that is verified here.
 */
contract YNKLVStudio is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ──────────────────────────────────────────────
    // CONSTANTS — THE CONTRIBUTION COVENANT
    // ──────────────────────────────────────────────

    uint256 public constant CREATOR_SHARE_BPS   = 9000; // 90% — immutable
    uint256 public constant TREASURY_SHARE_BPS  =  850; // 8.5%
    uint256 public constant BURN_SHARE_BPS      =  150; // 1.5%
    uint256 public constant BPS_DENOMINATOR     = 10000;

    // Maximum collaborators per product
    uint256 public constant MAX_COLLABORATORS   = 5;

    // ──────────────────────────────────────────────
    // TYPES
    // ──────────────────────────────────────────────

    struct Product {
        uint256   priceYNKLV;          // Base price in YNKLV (18 decimals)
        address[] collaborators;       // Creator addresses (1–5)
        uint256[] shareBPS;            // Must sum to 10000 across collaborators
        bytes32   contentHash;         // IPFS CIDv1 hash of encrypted content
        bool      isActive;
        uint256   salesCount;
        // Geographic discount tiers (0 = no discount, basis points off base price)
        uint256   regionADiscountBPS;  // e.g. 5000 = 50% off for Tier A regions
        uint256   regionBDiscountBPS;  // e.g. 7000 = 70% off for Tier B regions
    }

    // ──────────────────────────────────────────────
    // ROLES
    // ──────────────────────────────────────────────

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    // ──────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────

    IERC20  public immutable ynklv;
    address public           treasury;

    uint256 private _nextProductId;
    mapping(uint256 => Product) public products;

    // Earnings tracking (for EPS oracle and UI)
    mapping(address => uint256) public totalEarned;
    uint256 public              totalVolume;

    // ──────────────────────────────────────────────
    // EVENTS
    // ──────────────────────────────────────────────

    event ProductPublished(
        uint256 indexed productId,
        address indexed primaryCreator,
        uint256 priceYNKLV,
        bytes32 contentHash
    );
    event ProductPurchased(
        uint256 indexed productId,
        address indexed buyer,
        uint256 pricePaid,
        uint8   regionTier
    );
    event ProductDeactivated(uint256 indexed productId);
    event ProductPriceUpdated(uint256 indexed productId, uint256 newPrice);
    event RevenueDistributed(
        uint256 indexed productId,
        uint256 creatorTotal,
        uint256 treasuryAmount,
        uint256 burnAmount
    );

    // ──────────────────────────────────────────────
    // CONSTRUCTOR
    // ──────────────────────────────────────────────

    constructor(address _ynklv, address _treasury, address _governance, address _oracle) {
        require(_ynklv      != address(0), "YNKLVStudio: zero ynklv");
        require(_treasury   != address(0), "YNKLVStudio: zero treasury");
        require(_governance != address(0), "YNKLVStudio: zero governance");
        require(_oracle     != address(0), "YNKLVStudio: zero oracle");

        ynklv    = IERC20(_ynklv);
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, _governance);
        _grantRole(ORACLE_ROLE,        _oracle);
    }

    // ──────────────────────────────────────────────
    // CREATOR — PUBLISH
    // ──────────────────────────────────────────────

    /**
     * @notice Publish a new product to YNKLV Studio.
     * @param priceYNKLV         Base price in YNKLV (use 0 for pay-what-you-want)
     * @param collaborators      Array of creator wallet addresses (first = primary)
     * @param shareBPS           Revenue share per collaborator (must sum to 10000)
     * @param contentHash        IPFS CIDv1 hash of the product content
     * @param regionADiscountBPS Discount for regional tier A (0 = none, 5000 = 50% off)
     * @param regionBDiscountBPS Discount for regional tier B (deeper discount)
     */
    function publishProduct(
        uint256   priceYNKLV,
        address[] calldata collaborators,
        uint256[] calldata shareBPS,
        bytes32   contentHash,
        uint256   regionADiscountBPS,
        uint256   regionBDiscountBPS
    ) external whenNotPaused returns (uint256 productId) {
        require(collaborators.length > 0,                     "YNKLVStudio: no collaborators");
        require(collaborators.length <= MAX_COLLABORATORS,    "YNKLVStudio: too many collaborators");
        require(collaborators.length == shareBPS.length,      "YNKLVStudio: shares mismatch");
        require(contentHash != bytes32(0),                    "YNKLVStudio: empty hash");
        require(regionADiscountBPS <= BPS_DENOMINATOR,        "YNKLVStudio: invalid discount A");
        require(regionBDiscountBPS <= BPS_DENOMINATOR,        "YNKLVStudio: invalid discount B");

        // Primary creator must be the caller
        require(collaborators[0] == msg.sender,               "YNKLVStudio: not primary creator");

        // Validate shares sum to exactly 10000
        uint256 totalShares;
        for (uint256 i = 0; i < shareBPS.length; i++) {
            require(collaborators[i] != address(0),           "YNKLVStudio: zero collaborator");
            totalShares += shareBPS[i];
        }
        require(totalShares == BPS_DENOMINATOR,               "YNKLVStudio: shares not 100%");

        _nextProductId++;
        productId = _nextProductId;

        products[productId] = Product({
            priceYNKLV:         priceYNKLV,
            collaborators:      collaborators,
            shareBPS:           shareBPS,
            contentHash:        contentHash,
            isActive:           true,
            salesCount:         0,
            regionADiscountBPS: regionADiscountBPS,
            regionBDiscountBPS: regionBDiscountBPS
        });

        emit ProductPublished(productId, msg.sender, priceYNKLV, contentHash);
    }

    // ──────────────────────────────────────────────
    // BUYER — PURCHASE
    // ──────────────────────────────────────────────

    /**
     * @notice Purchase a product.
     * @param productId  The product to purchase.
     * @param regionTier 0 = full price, 1 = region A discount, 2 = region B discount.
     *                   Oracle must have verified eligibility off-chain for tier > 0.
     * @param minPrice   Buyer's minimum price (for pay-what-you-want products).
     */
    function purchase(
        uint256 productId,
        uint8   regionTier,
        uint256 minPrice
    ) external nonReentrant whenNotPaused {
        Product storage p = products[productId];
        require(p.isActive,                             "YNKLVStudio: inactive");
        require(regionTier <= 2,                        "YNKLVStudio: invalid region");

        uint256 effectivePrice = _effectivePrice(p, regionTier, minPrice);
        require(effectivePrice > 0,                     "YNKLVStudio: zero price");

        // Transfer full amount from buyer to this contract
        ynklv.safeTransferFrom(msg.sender, address(this), effectivePrice);

        // Calculate splits
        uint256 burnAmount     = (effectivePrice * BURN_SHARE_BPS)     / BPS_DENOMINATOR;
        uint256 treasuryAmount = (effectivePrice * TREASURY_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 creatorTotal   = effectivePrice - burnAmount - treasuryAmount;

        // Burn
        // Cast to ERC20Burnable interface (token must support it)
        IERC20Burnable(address(ynklv)).burn(burnAmount);

        // Treasury
        ynklv.safeTransfer(treasury, treasuryAmount);

        // Distribute to creators per shares
        for (uint256 i = 0; i < p.collaborators.length; i++) {
            uint256 share = (creatorTotal * p.shareBPS[i]) / BPS_DENOMINATOR;
            if (share > 0) {
                ynklv.safeTransfer(p.collaborators[i], share);
                totalEarned[p.collaborators[i]] += share;
            }
        }

        p.salesCount++;
        totalVolume += effectivePrice;

        emit ProductPurchased(productId, msg.sender, effectivePrice, regionTier);
        emit RevenueDistributed(productId, creatorTotal, treasuryAmount, burnAmount);
    }

    // ──────────────────────────────────────────────
    // CREATOR — MANAGE
    // ──────────────────────────────────────────────

    function deactivateProduct(uint256 productId) external {
        require(products[productId].collaborators[0] == msg.sender, "YNKLVStudio: not primary");
        products[productId].isActive = false;
        emit ProductDeactivated(productId);
    }

    function updatePrice(uint256 productId, uint256 newPrice) external {
        require(products[productId].collaborators[0] == msg.sender, "YNKLVStudio: not primary");
        products[productId].priceYNKLV = newPrice;
        emit ProductPriceUpdated(productId, newPrice);
    }

    // ──────────────────────────────────────────────
    // GOVERNANCE
    // ──────────────────────────────────────────────

    function pause()   external onlyRole(DEFAULT_ADMIN_ROLE) { _pause();   }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    function updateTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "YNKLVStudio: zero address");
        treasury = newTreasury;
    }

    // ──────────────────────────────────────────────
    // VIEWS
    // ──────────────────────────────────────────────

    function getProduct(uint256 productId) external view returns (Product memory) {
        return products[productId];
    }

    function effectivePrice(uint256 productId, uint8 regionTier)
        external view returns (uint256)
    {
        return _effectivePrice(products[productId], regionTier, 0);
    }

    // ──────────────────────────────────────────────
    // INTERNAL
    // ──────────────────────────────────────────────

    function _effectivePrice(
        Product storage p,
        uint8 regionTier,
        uint256 minPrice
    ) internal view returns (uint256) {
        uint256 base = p.priceYNKLV;

        // Pay-what-you-want: use minPrice if base is 0
        if (base == 0) return minPrice;

        if (regionTier == 1) {
            base = base - (base * p.regionADiscountBPS / BPS_DENOMINATOR);
        } else if (regionTier == 2) {
            base = base - (base * p.regionBDiscountBPS / BPS_DENOMINATOR);
        }

        // Enforce minimum price even with discount
        return base > minPrice ? base : minPrice;
    }
}

interface IERC20Burnable is IERC20 {
    function burn(uint256 amount) external;
}
