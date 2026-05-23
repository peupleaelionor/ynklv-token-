# YNKLV API Specification

## Backend API — v1.0

---

## Overview

The YNKLV API bridges on-chain data (Base L2 via The Graph) with off-chain context (Supabase). It is implemented as Next.js Route Handlers and Supabase Edge Functions.

**Base URL (production):** `https://api.ynklv.xyz/v1`
**Base URL (staging):**    `https://api-staging.ynklv.xyz/v1`

**Authentication:** Most endpoints are public. Wallet-authenticated actions use
SIWE (Sign-In With Ethereum) — the user signs a nonce, and the server issues a session.

---

## Authentication

### POST `/auth/nonce`

Generate a sign-in nonce for SIWE.

**Request:** none

**Response:**
```json
{
  "nonce":     "abc123xyz789",
  "expiresAt": "2026-05-23T12:00:00Z"
}
```

---

### POST `/auth/verify`

Verify a SIWE message and issue a session token.

**Request:**
```json
{
  "message":   "YNKLV wants you to sign in...",
  "signature": "0xabc..."
}
```

**Response:**
```json
{
  "token":     "eyJ...",
  "address":   "0x...",
  "expiresAt": "2026-06-23T12:00:00Z"
}
```

---

## User & Profile

### GET `/users/{address}`

Fetch a user's complete ecosystem profile.

**Response:**
```json
{
  "address":         "0x...",
  "ynklvName":       "aminata.ynklv",
  "displayName":     "Aminata Diallo",
  "bio":             "Music producer. Lagos & Paris.",
  "region":          "NG",
  "pass": {
    "tokenId":          1042,
    "tier":             "builder",
    "reputationScore":  742,
    "epochsLived":      3,
    "genesisTimestamp": 1748000000,
    "isSoulbound":      false,
    "city":             "lagos"
  },
  "eps": {
    "total":         742,
    "holdScore":     310,
    "activityScore": 254,
    "communityScore":178,
    "lastUpdated":   "2026-05-20T00:00:00Z"
  },
  "studio": {
    "totalEarned":   "45200000000000000000000",
    "productsCount": 12,
    "salesCount":    384
  },
  "governance": {
    "votesCount":        18,
    "proposalsCount":     2,
    "delegateTo":        null
  },
  "createdAt":       "2026-03-01T10:30:00Z"
}
```

---

### PATCH `/users/{address}` 🔒

Update user profile. Requires authentication.

**Request:**
```json
{
  "displayName": "Aminata Diallo",
  "bio":         "Music producer. Lagos & Paris.",
  "avatar":      "ipfs://Qm..."
}
```

---

## EPS (Ecosystem Participation Score)

### GET `/eps/{address}`

Get the current and historical EPS score for a wallet.

**Response:**
```json
{
  "address":       "0x...",
  "current": {
    "total":         742,
    "holdScore":     310,
    "activityScore": 254,
    "communityScore":178,
    "tier":          "builder",
    "nextTier":      "architect",
    "progressToNext":0.486
  },
  "history": [
    { "date": "2026-05-01", "total": 620, "tier": "member" },
    { "date": "2026-04-01", "total": 485, "tier": "member" },
    { "date": "2026-03-01", "total": 210, "tier": "member" }
  ],
  "monthlyReward": {
    "estimatedYNKLV": "125000000000000000000",
    "claimableAt":    "2026-06-01T00:00:00Z"
  }
}
```

---

## Studio

### GET `/studio/products`

List published products with filtering and pagination.

**Query params:**
- `page`       (default: 1)
- `limit`      (default: 24, max: 100)
- `category`   (`audio` | `visual` | `writing` | `video` | `access`)
- `creator`    (filter by creator address)
- `sort`       (`newest` | `popular` | `price_asc` | `price_desc`)
- `regionTier` (`0` | `1` | `2` — affects price displayed)

**Response:**
```json
{
  "products": [
    {
      "productId":    42,
      "title":        "Lagos Afrobeats Kit Vol.3",
      "description":  "100 premium samples from Lagos studios.",
      "category":     "audio",
      "priceYNKLV":   "15000000000000000000",
      "creator": {
        "address":    "0x...",
        "name":       "Seun Beats",
        "passTier":   "builder",
        "ynklvName":  "seunbeats.ynklv"
      },
      "collaborators": [],
      "salesCount":   147,
      "contentHash":  "bafybeig...",
      "publishedAt":  "2026-04-12T09:00:00Z",
      "regionPrices": {
        "0": "15000000000000000000",
        "1":  "7500000000000000000",
        "2":  "4500000000000000000"
      }
    }
  ],
  "total": 847,
  "page":  1,
  "pages": 36
}
```

---

### GET `/studio/products/{productId}`

Get a single product with full details.

---

### POST `/studio/products` 🔒

Publish a new product.

**Request:**
```json
{
  "title":         "Lagos Afrobeats Kit Vol.4",
  "description":   "150 premium samples.",
  "category":      "audio",
  "priceYNKLV":    "15000000000000000000",
  "collaborators": [
    { "address": "0x...", "shareBPS": 10000 }
  ],
  "contentHash":   "bafybeig...",
  "regionADiscountBPS": 5000,
  "regionBDiscountBPS": 7000
}
```

**Response:** Signed transaction data for the user to submit on-chain.

---

### GET `/studio/creators/{address}/products`

List all products by a creator.

---

### GET `/studio/earnings/{address}`

Get creator earnings summary.

**Response:**
```json
{
  "address":    "0x...",
  "totalEarned":"45200000000000000000000",
  "thisMonth":  "8400000000000000000000",
  "history": [
    { "month": "2026-05", "earned": "8400000000000000000000", "sales": 42 },
    { "month": "2026-04", "earned": "6200000000000000000000", "sales": 31 }
  ]
}
```

---

## Pass

### GET `/pass/{address}`

Get pass data for a wallet address.

**Response:**
```json
{
  "hasPass":  true,
  "tokenId":  1042,
  "data": {
    "tier":             "builder",
    "reputationScore":  742,
    "epochsLived":      3,
    "genesisTimestamp": 1748000000,
    "isSoulbound":      false,
    "city":             "lagos"
  },
  "metadata": {
    "name":   "YNKLV Pass #1042",
    "image":  "data:image/svg+xml;base64,...",
    "genesis":"2026-03-01"
  }
}
```

---

## Governance

### GET `/governance/proposals`

List governance proposals.

**Query params:** `status` (`active` | `pending` | `passed` | `failed` | `executed`)

**Response:**
```json
{
  "proposals": [
    {
      "proposalId": "0xabc...",
      "title":      "Allocate 50,000 YNKLV to DRC Creator Grants",
      "description":"...",
      "proposer":   "0x...",
      "status":     "active",
      "forVotes":   "1250000000000000000000000",
      "againstVotes":"125000000000000000000000",
      "quorumRequired":"500000000000000000000000",
      "startBlock": 15000000,
      "endBlock":   15050000,
      "estimatedEnd":"2026-05-28T00:00:00Z"
    }
  ]
}
```

---

### GET `/governance/proposals/{proposalId}`

Get a single proposal with full history.

---

### GET `/governance/votes/{address}`

Get voting history for a wallet.

---

## Treasury

### GET `/treasury`

Get real-time treasury state. **Public endpoint.**

**Response:**
```json
{
  "totalValueUSD":   4250000,
  "assets": [
    { "symbol": "USDC",  "amount": "1800000000000",          "valueUSD": 1800000 },
    { "symbol": "ETH",   "amount": "875000000000000000000",  "valueUSD": 2100000 },
    { "symbol": "YNKLV", "amount": "75000000000000000000000000", "valueUSD": 350000 }
  ],
  "runwayMonths":    19.3,
  "monthlyBurnUSD":  220000,
  "lastUpdated":     "2026-05-23T12:00:00Z"
}
```

---

### GET `/treasury/transactions`

Get paginated treasury transaction history. **Public endpoint.**

**Response:**
```json
{
  "transactions": [
    {
      "txHash":    "0xabc...",
      "timestamp": "2026-05-20T10:00:00Z",
      "type":      "disbursement",
      "amount":    "15000000000",
      "asset":     "USDC",
      "recipient": "0x...",
      "purpose":   "Grant: Lagos Fashion Week Partnership",
      "govRef":    "PROP-0042"
    }
  ]
}
```

---

## Ecosystem Stats

### GET `/stats`

Real-time ecosystem health metrics. **Public endpoint.**

**Response:**
```json
{
  "token": {
    "totalSupply":      "1000000000000000000000000000",
    "circulatingSupply":"245000000000000000000000000",
    "totalBurned":       "4200000000000000000000000"
  },
  "ecosystem": {
    "totalHolders":     82400,
    "activeCreators":   3200,
    "monthlyVolume":    "850000000000000000000000",
    "activeCities":     18,
    "coursesCompleted": 24700,
    "governanceVotes":  4120
  },
  "epochCurrent": {
    "number":    3,
    "name":      "EXPANSION",
    "startDate": "2027-01-01",
    "endDate":   "2027-06-30",
    "goals": [
      { "name": "50,000 participants", "progress": 0.82 },
      { "name": "15 chartered cities", "progress": 0.73 },
      { "name": "First institutional credential", "progress": 1.0 }
    ]
  },
  "updatedAt": "2026-05-23T12:00:00Z"
}
```

---

## Rate Limiting

```
Public endpoints:        60 requests / minute / IP
Authenticated endpoints: 300 requests / minute / wallet
Writes:                  30 requests / minute / wallet
```

Rate limit headers returned on every response:
```
X-RateLimit-Limit:     60
X-RateLimit-Remaining: 58
X-RateLimit-Reset:     1716465660
```

---

## Error Format

All errors use this structure:

```json
{
  "error": {
    "code":    "INSUFFICIENT_BALANCE",
    "message": "Wallet holds less than 100 YNKLV required to mint a Pass.",
    "hint":    "Acquire YNKLV at app.ynklv.xyz/wallet to proceed."
  }
}
```

Error codes are stable — never change once published. Message text may be updated.

---

*"An API is a contract. Design it for clarity and longevity, not for the current sprint."*
