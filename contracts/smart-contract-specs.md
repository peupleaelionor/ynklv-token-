# YNKLV Smart Contract Specifications

## Technical Specification Document — v1.0

---

## CONTRACT 1: YNKLVToken.sol

### Purpose
The canonical YNKLV ERC-20 token. Fixed supply. Immutable. The permanent financial primitive of the ecosystem.

### Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YNKLVToken is ERC20, ERC20Burnable {
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Allocation amounts (immutable after deployment)
    uint256 public constant ECOSYSTEM_COMMUNITY = 300_000_000 * 10**18;
    uint256 public constant CREATOR_BUILDER     = 200_000_000 * 10**18;
    uint256 public constant TREASURY            = 150_000_000 * 10**18;
    uint256 public constant EARLY_BACKERS       = 100_000_000 * 10**18;
    uint256 public constant TEAM_FOUNDERS       = 100_000_000 * 10**18;
    uint256 public constant LIQUIDITY           = 80_000_000  * 10**18;
    uint256 public constant ECOSYSTEM_GRANTS    = 50_000_000  * 10**18;
    uint256 public constant ADVISORS_PARTNERS   = 20_000_000  * 10**18;
    
    constructor(
        address ecosystemCommunityVesting,
        address creatorBuilderVesting,
        address treasury,
        address earlyBackersVesting,
        address teamFoundersVesting,
        address liquidityManager,
        address ecosystemGrants,
        address advisorsVesting
    ) ERC20("YNKLV", "YNKLV") {
        // Mint all tokens at genesis to respective vesting/distribution contracts
        // No mint function after this — supply is permanently fixed
        _mint(ecosystemCommunityVesting, ECOSYSTEM_COMMUNITY);
        _mint(creatorBuilderVesting,     CREATOR_BUILDER);
        _mint(treasury,                  TREASURY);
        _mint(earlyBackersVesting,       EARLY_BACKERS);
        _mint(teamFoundersVesting,       TEAM_FOUNDERS);
        _mint(liquidityManager,          LIQUIDITY);
        _mint(ecosystemGrants,           ECOSYSTEM_GRANTS);
        _mint(advisorsVesting,           ADVISORS_PARTNERS);
        
        // Verify total supply (safety check)
        require(totalSupply() == TOTAL_SUPPLY, "Supply mismatch");
    }
    
    // Burn function inherited from ERC20Burnable
    // No other admin functions
    // No blacklist
    // No pause (except inherited emergency mechanism in periphery contracts)
    // No fee-on-transfer
    // No rebase
    // What you see is what it does. Forever.
}
```

### Security Properties
- No owner after deployment (ownership renounced at genesis or transferred to timelock)
- No upgrade proxy on core token
- No hidden functions
- Standard ERC-20 behavior: predictable, auditable, compatible with all tooling

---

## CONTRACT 2: YNKLVVesting.sol

### Purpose
Manages time-locked token releases for team, backers, and advisors.

### Key Parameters

```solidity
contract YNKLVVesting {
    
    struct VestingSchedule {
        uint256 totalAmount;      // Total tokens allocated
        uint256 cliffDuration;    // Seconds before any release
        uint256 vestingDuration;  // Seconds over which tokens vest linearly (post-cliff)
        uint256 startTime;        // TGE timestamp
        uint256 released;         // Already released amount
        address beneficiary;      // Who receives the tokens
        bool revocable;           // Only true for advisors (performance-based)
    }
    
    // Key vesting schedules:
    // Team:      cliff=18 months, vesting=30 months (48 total), NOT revocable
    // Backers:   cliff=12 months, vesting=24 months (36 total), NOT revocable
    // Advisors:  cliff=6  months, vesting=18 months (24 total), revocable for cause
    
    // Release function: calculates vested amount, sends difference from last claim
    // Only beneficiary can call release
    // No early release without governance proposal + majority vote
}
```

### Security Properties
- Immutable schedule after deployment
- Only beneficiary can release (no third party drain)
- Revocable only for advisor contracts, and only by governance (not team)
- All events emitted (full on-chain audit trail)

---

## CONTRACT 3: YNKLVPass.sol

### Purpose
Dynamic ERC-721 NFT representing ecosystem membership and identity.

### Key Features

```solidity
contract YNKLVPass is ERC721, ERC721Enumerable, AccessControl {
    
    struct PassData {
        uint256 tokenId;
        PassTier tier;            // Newcomer, Member, Builder, Architect, Legend
        uint256 genesisTimestamp; // When this Pass was minted
        uint256 reputationScore;  // Updated by oracle/relayer from EPS system
        bool isSoulbound;         // If true, transfer is disabled
        string ynklvName;         // Optional .ynklv name binding
    }
    
    enum PassTier { NEWCOMER, MEMBER, BUILDER, ARCHITECT, LEGEND }
    
    // Dynamic metadata: tokenURI returns SVG generated on-chain 
    // based on PassData — no external dependency for basic rendering
    // Extended metadata (full artwork) stored on IPFS
    
    // Soulbound: if holder chooses to make Pass soulbound,
    // overrides ERC-721 transfer with revert
    // Holder can REMOVE soulbound (their choice to unlock)
    // But cannot FORCE soulbound on a transferred token
    
    // Tier updates: pushed by authorized oracle after EPS calculation
    // Holder cannot self-upgrade tier (prevents gaming)
    // Holder can see their progress toward next tier
    
    mapping(uint256 => PassData) public passData;
    
    // Minting:
    // Free mint for any address with >= 100 YNKLV balance
    // One Pass per wallet address
    // Burns 0 YNKLV (access, not payment)
}
```

---

## CONTRACT 4: YNKLVTreasury.sol

### Purpose
The 4-of-7 multisig treasury for the YNKLV Foundation. Wraps Gnosis Safe with additional YNKLV-specific governance requirements.

### Key Constraints

```solidity
contract YNKLVTreasury {
    
    // Built on Gnosis Safe (Safe{Core} Protocol)
    // Custom module: YNKLVGovernanceModule
    
    // Spending tiers:
    // < $1,000 USD eq:    Operational wallet (2-of-3) handles
    // $1K - $10K USD eq:  Treasury, no advance notice required  
    // $10K - $100K:       Treasury, 72h governance forum post required
    // > $100K:            Treasury, governance proposal + 5-day vote required
    
    // USD equivalent calculated via Chainlink price feeds
    // Calculated at time of proposal, checked again at execution
    
    // Emergency mechanism:
    // Any signer can propose a 24h emergency freeze (stops all outflows)
    // Requires 3-of-7 to activate
    // Requires 6-of-7 to unfreeze
    // Auto-expires after 7 days
}
```

---

## CONTRACT 5: YNKLVGovernor.sol

### Purpose
On-chain governance for protocol decisions, using OpenZeppelin Governor with YNKLV-specific modifications.

### Key Parameters

```solidity
contract YNKLVGovernor is Governor, GovernorTimelockControl {
    
    // Voting token: YNKLVToken
    // Voting weight: sqrt(balance) — quadratic voting
    // (adjusted for EPS activity multiplier from oracle)
    
    // Proposal threshold: 10,000 YNKLV (prevents spam)
    // Proposal deposit: 500 YNKLV burned if quorum not met
    // Proposal deposit: returned if quorum met (pass or fail)
    
    uint256 public constant VOTING_DELAY   = 7200;  // ~1 day (blocks on Base)
    uint256 public constant VOTING_PERIOD  = 36000; // ~5 days
    uint256 public constant QUORUM_PERCENT = 10;    // 10% of circulating supply
    
    // Timelock: 48 hours between vote passage and execution
    // Gives community time to exit if they disagree with outcome
    
    // Phase 1 (Year 0-1): Governor deployed but gated
    // Only predefined categories of proposals are accepted
    // Prevents governance attacks while community is small
    
    // Phase 2 (Year 1-2): Council governance
    // Council members can propose without threshold
    // Regular holders can propose with 50,000 YNKLV threshold
    
    // Phase 3 (Year 3+): Full DAO
    // Any holder with 10,000 YNKLV can propose
    // No category restrictions
}
```

---

## CONTRACT 6: YNKLVStudio.sol

### Purpose
The creator monetization contract. Handles product listings, purchases, and automatic revenue distribution.

### Core Logic

```solidity
contract YNKLVStudio {
    
    struct Product {
        uint256 productId;
        address creator;
        uint256 priceYNKLV;        // Price in YNKLV (18 decimals)
        bytes32 contentHash;       // IPFS hash of the content
        bool isActive;
        address[] collaborators;   // Up to 5 co-creators
        uint256[] shares;          // Revenue share percentages (must sum to 100)
    }
    
    // Revenue distribution on purchase:
    // collaborators receive their configured % of 90% creator share
    // 8.5% to Treasury (5% treasury, 3.5% community pool)
    // 1.5% burned (call YNKLV.burn())
    
    // Geographic pricing: creator can set price tiers
    // Tier A: Base price (EUR/USD equivalent)
    // Tier B: 50% of base (African markets)
    // Tier C: 30% of base (specific DRC, low-income market)
    // Geographic check: based on wallet region data (oracle-provided, optional)
    
    // Subscription products:
    // ERC-1155 token issued as "access pass" for subscription period
    // Valid for 30 days, auto-expired (non-transferable subscription token)
    // Revenue distributed identically to one-time purchases
    
    function purchase(uint256 productId) external {
        Product memory p = products[productId];
        require(p.isActive, "Product not active");
        
        uint256 price = p.priceYNKLV;
        
        // Transfer full price from buyer to contract
        YNKLV.transferFrom(msg.sender, address(this), price);
        
        // Calculate amounts
        uint256 burnAmount      = price * 15 / 1000;  // 1.5%
        uint256 ecosystemAmount = price * 85 / 1000;  // 8.5%
        uint256 creatorAmount   = price - burnAmount - ecosystemAmount; // 90%
        
        // Execute distributions
        YNKLV.burn(burnAmount);
        YNKLV.transfer(treasury, ecosystemAmount);
        distributeToCreators(p, creatorAmount);
        
        // Issue access NFT (ERC-1155) to buyer
        issueAccess(msg.sender, productId);
        
        emit ProductPurchased(productId, msg.sender, price);
    }
}
```

---

## CONTRACT 7: EcosystemRewards.sol

### Purpose
Manages the Community Pool emissions and EPS-based reward distribution.

### Anti-Gaming Design

```solidity
contract EcosystemRewards {
    
    // EPS Score is calculated off-chain (combination of on-chain + off-chain data)
    // Published on-chain by authorized oracle network (Chainlink Functions or custom)
    // Published monthly, not continuously (prevents real-time gaming)
    
    // Reward distribution:
    // - Monthly snapshot of all wallet EPS scores
    // - Total monthly emission from Community Pool: fixed schedule
    // - Each wallet receives proportional share of monthly emission
    // - Proportional to: EPS score / total EPS scores of all wallets
    
    // Anti-gaming:
    // - EPS oracle uses 90-day rolling window
    // - Sudden balance changes (last 30 days) weighted at 50% vs. stable holdings
    // - New wallet grace period: 60 days before EPS score is fully counted
    
    // Claims:
    // - Rewards accumulate on-chain
    // - User can claim at any time (no expiry)
    // - Unclaimed rewards: recycled after 1 year (back to Community Pool)
    
    // This prevents reward inflation from wallets that abandon the ecosystem
    
    uint256 public constant MAX_MONTHLY_EMISSION = 2_000_000 * 10**18; // 2M YNKLV max/month
    // Actual emission decreases over time on a pre-set schedule
}
```

---

## DEPLOYMENT CHECKLIST

```
Pre-Deployment Verification:
□  All contracts compiled without warnings on latest Solidity
□  All contracts tested: unit tests, integration tests, fuzzing (Foundry)
□  Slither static analysis: no high/critical findings
□  Mythril analysis: no critical findings
□  Audit 1: complete, all critical/high findings resolved
□  Audit 2: complete, all critical/high findings resolved
□  Deployment scripts reviewed by 2 independent engineers
□  Deployment addresses pre-computed and verified
□  Multisig signers all tested on testnet
□  Emergency procedures documented and rehearsed

Deployment Sequence:
1.  Deploy YNKLVToken (with all allocation addresses as constructor args)
2.  Deploy all Vesting contracts (receive token allocations from step 1)
3.  Deploy YNKLVPass
4.  Deploy YNKLVStudio
5.  Deploy YNKLVGovernor + YNKLVTimelock
6.  Configure multisig treasury (Gnosis Safe)
7.  Verify all contracts on Basescan
8.  Publish all deployment tx hashes publicly
9.  Lock liquidity via Unicrypt/TeamFinance
10. Publish final supply verification (on-chain readable)

Post-Deployment:
□  All constructor arguments publicly verified
□  All admin roles documented (who holds what key)
□  Operational wallet funded for first 3 months
□  Bug bounty on ImmuneFi: live within 24 hours of deployment
□  Security monitoring: Forta alerts configured
□  Public announcement with all contract addresses
```

---

*"Smart contracts are laws that execute themselves. Write them as carefully as you would write the constitution of a civilization."*
