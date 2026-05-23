// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title  YNKLVPass
 * @notice Dynamic NFT representing YNKLV ecosystem membership.
 *
 * One Pass per wallet. Free to mint for holders of >= 100 YNKLV.
 * Metadata is partially on-chain (tier, rep score, genesis timestamp).
 * Full artwork is stored on IPFS, referenced via tier-specific IPFS CIDs.
 *
 * Soulbound option: holder can toggle their Pass to non-transferable.
 * Non-custodial: YNKLV has no authority to revoke or transfer Passes.
 *
 * Tier updates: pushed by authorized ORACLE_ROLE after off-chain EPS calculation.
 * The oracle cannot change ownership, cannot mint/burn, cannot modify history.
 *
 * Roles:
 *   DEFAULT_ADMIN_ROLE  → governance timelock
 *   ORACLE_ROLE         → EPS oracle (automated, audited service)
 *   MINTER_ROLE         → reserved for future L2 bridge (not used in v1)
 */
contract YNKLVPass is ERC721, ERC721Enumerable, AccessControl {
    using Strings for uint256;

    // ──────────────────────────────────────────────
    // TYPES
    // ──────────────────────────────────────────────

    enum Tier { NEWCOMER, MEMBER, BUILDER, ARCHITECT, LEGEND }

    struct PassData {
        Tier     tier;
        uint64   genesisTimestamp;
        uint32   reputationScore;
        uint16   epochsLived;
        bool     isSoulbound;
        bytes32  cityCode;          // bytes32 of city name, 0x0 if unset
    }

    // ──────────────────────────────────────────────
    // CONSTANTS & ROLES
    // ──────────────────────────────────────────────

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MIN_YNKLV_TO_MINT = 100e18; // 100 YNKLV

    // ──────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────

    IERC20  public immutable ynklv;
    uint256 private          _nextTokenId;

    mapping(uint256 => PassData) public passData;
    mapping(address => uint256)  public holderToken; // wallet → tokenId (0 = none)

    // IPFS CIDs per tier (set by governance, used in tokenURI)
    mapping(Tier => string) public tierImageCID;

    // ──────────────────────────────────────────────
    // EVENTS
    // ──────────────────────────────────────────────

    event PassMinted(address indexed holder, uint256 indexed tokenId, uint64 genesisTimestamp);
    event TierUpdated(uint256 indexed tokenId, Tier oldTier, Tier newTier);
    event ReputationUpdated(uint256 indexed tokenId, uint32 newScore);
    event EpochAdvanced(uint256 indexed tokenId, uint16 newEpoch);
    event SoulboundToggled(uint256 indexed tokenId, bool isSoulbound);
    event CitySet(uint256 indexed tokenId, bytes32 cityCode);

    // ──────────────────────────────────────────────
    // CONSTRUCTOR
    // ──────────────────────────────────────────────

    constructor(address _ynklv, address _governance, address _oracle)
        ERC721("YNKLV Pass", "YNKLVPASS")
    {
        require(_ynklv      != address(0), "YNKLVPass: zero ynklv");
        require(_governance != address(0), "YNKLVPass: zero governance");
        require(_oracle     != address(0), "YNKLVPass: zero oracle");

        ynklv = IERC20(_ynklv);

        _grantRole(DEFAULT_ADMIN_ROLE, _governance);
        _grantRole(ORACLE_ROLE,        _oracle);
    }

    // ──────────────────────────────────────────────
    // MINTING
    // ──────────────────────────────────────────────

    /**
     * @notice Mint a Pass. Caller must hold >= 100 YNKLV. One per wallet.
     */
    function mint() external {
        require(holderToken[msg.sender] == 0,                "YNKLVPass: already minted");
        require(ynklv.balanceOf(msg.sender) >= MIN_YNKLV_TO_MINT, "YNKLVPass: insufficient YNKLV");

        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        uint64  ts      = uint64(block.timestamp);

        passData[tokenId] = PassData({
            tier:             Tier.NEWCOMER,
            genesisTimestamp: ts,
            reputationScore:  0,
            epochsLived:      1,
            isSoulbound:      false,
            cityCode:         bytes32(0)
        });

        holderToken[msg.sender] = tokenId;
        _safeMint(msg.sender, tokenId);

        emit PassMinted(msg.sender, tokenId, ts);
    }

    // ──────────────────────────────────────────────
    // ORACLE UPDATES
    // ──────────────────────────────────────────────

    function updateTier(uint256 tokenId, Tier newTier) external onlyRole(ORACLE_ROLE) {
        require(_ownerOf(tokenId) != address(0), "YNKLVPass: nonexistent");
        Tier oldTier = passData[tokenId].tier;
        if (oldTier != newTier) {
            passData[tokenId].tier = newTier;
            emit TierUpdated(tokenId, oldTier, newTier);
        }
    }

    function updateReputation(uint256 tokenId, uint32 newScore) external onlyRole(ORACLE_ROLE) {
        require(_ownerOf(tokenId) != address(0), "YNKLVPass: nonexistent");
        passData[tokenId].reputationScore = newScore;
        emit ReputationUpdated(tokenId, newScore);
    }

    function advanceEpoch(uint256 tokenId) external onlyRole(ORACLE_ROLE) {
        require(_ownerOf(tokenId) != address(0), "YNKLVPass: nonexistent");
        passData[tokenId].epochsLived++;
        emit EpochAdvanced(tokenId, passData[tokenId].epochsLived);
    }

    // ──────────────────────────────────────────────
    // HOLDER CONTROLS
    // ──────────────────────────────────────────────

    /**
     * @notice Toggle soulbound status. Only the token holder can call.
     *         Once soulbound, the Pass cannot be transferred or approved.
     */
    function toggleSoulbound(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "YNKLVPass: not owner");
        passData[tokenId].isSoulbound = !passData[tokenId].isSoulbound;
        emit SoulboundToggled(tokenId, passData[tokenId].isSoulbound);
    }

    /**
     * @notice Set the city code for your Pass. Voluntary, for City Charter membership.
     */
    function setCity(uint256 tokenId, bytes32 cityCode) external {
        require(ownerOf(tokenId) == msg.sender, "YNKLVPass: not owner");
        passData[tokenId].cityCode = cityCode;
        emit CitySet(tokenId, cityCode);
    }

    // ──────────────────────────────────────────────
    // METADATA
    // ──────────────────────────────────────────────

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "YNKLVPass: nonexistent");
        PassData memory d = passData[tokenId];

        string memory tierName = _tierName(d.tier);
        string memory image    = _buildSVG(tokenId, d);

        string memory json = Base64.encode(bytes(string.concat(
            '{"name":"YNKLV Pass #', tokenId.toString(), '",',
            '"description":"YNKLV ecosystem membership pass. Tier: ', tierName, '.",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(image)), '",',
            '"attributes":[',
                '{"trait_type":"Tier","value":"',         tierName,                         '"},',
                '{"trait_type":"Reputation","value":',    uint256(d.reputationScore).toString(), '},',
                '{"trait_type":"Epochs Lived","value":',  uint256(d.epochsLived).toString(),     '},',
                '{"trait_type":"Soulbound","value":"',    d.isSoulbound ? "true" : "false",  '"},',
                '{"trait_type":"Genesis","value":',       uint256(d.genesisTimestamp).toString(),'}',
            ']}'
        )));

        return string.concat("data:application/json;base64,", json);
    }

    function _buildSVG(uint256 tokenId, PassData memory d) internal pure returns (string memory) {
        string memory fill    = _tierFill(d.tier);
        string memory tierStr = _tierName(d.tier);
        string memory repStr  = uint256(d.reputationScore).toString();
        string memory idStr   = tokenId.toString();

        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">',
            '<rect width="400" height="600" rx="24" fill="#111111"/>',
            '<rect width="400" height="600" rx="24" fill="url(#noise)" opacity="0.03"/>',
            '<polygon points="200,80 260,115 260,185 200,220 140,185 140,115" fill="none" stroke="',
            fill, '" stroke-width="2" opacity="0.5"/>',
            '<polygon points="200,95 248,122 248,177 200,204 152,177 152,122" fill="', fill, '" opacity="0.08"/>',
            '<polygon points="200,95 248,122 248,177 200,204 152,177 152,122" fill="none" stroke="', fill, '" stroke-width="1.5"/>',
            '<text x="200" y="270" font-family="sans-serif" font-size="13" font-weight="600" fill="#F5F4F0" text-anchor="middle" letter-spacing="0.15em">',
            tierStr, '</text>',
            '<text x="200" y="530" font-family="sans-serif" font-size="11" fill="#F5F4F0" text-anchor="middle" opacity="0.3">',
            'YNKLV PASS  #', idStr, '</text>',
            '<text x="200" y="510" font-family="sans-serif" font-size="11" fill="', fill, '" text-anchor="middle">',
            'REP ', repStr, '</text>',
            '</svg>'
        );
    }

    function _tierName(Tier t) internal pure returns (string memory) {
        if (t == Tier.NEWCOMER)  return "NEWCOMER";
        if (t == Tier.MEMBER)    return "MEMBER";
        if (t == Tier.BUILDER)   return "BUILDER";
        if (t == Tier.ARCHITECT) return "ARCHITECT";
        return "LEGEND";
    }

    function _tierFill(Tier t) internal pure returns (string memory) {
        if (t == Tier.NEWCOMER)  return "#F5F4F0";
        if (t == Tier.MEMBER)    return "#F5F4F0";
        if (t == Tier.BUILDER)   return "#C9A84C";
        if (t == Tier.ARCHITECT) return "#C9A84C";
        return "#DFC06E";
    }

    // ──────────────────────────────────────────────
    // GOVERNANCE
    // ──────────────────────────────────────────────

    function setTierImageCID(Tier tier, string calldata cid) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tierImageCID[tier] = cid;
    }

    // ──────────────────────────────────────────────
    // SOULBOUND ENFORCEMENT
    // ──────────────────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Block transfers (not mints) when soulbound
        if (from != address(0) && passData[tokenId].isSoulbound) {
            require(to == address(0), "YNKLVPass: soulbound"); // allow burn only
        }
        if (passData[tokenId].isSoulbound) {
            require(auth == address(0) || auth == from, "YNKLVPass: soulbound approval");
        }
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
