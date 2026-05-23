import { base, baseSepolia } from 'wagmi/chains'

// ─── Contract Addresses ──────────────────────────────────────────────────────
// Set after deployment. Populated from environment variables.

export const CONTRACT_ADDRESSES = {
  [base.id]: {
    ynklvToken:  process.env.NEXT_PUBLIC_YNKLV_TOKEN_BASE       as `0x${string}`,
    ynklvPass:   process.env.NEXT_PUBLIC_YNKLV_PASS_BASE        as `0x${string}`,
    ynklvStudio: process.env.NEXT_PUBLIC_YNKLV_STUDIO_BASE      as `0x${string}`,
    treasury:    process.env.NEXT_PUBLIC_YNKLV_TREASURY_BASE    as `0x${string}`,
  },
  [baseSepolia.id]: {
    ynklvToken:  process.env.NEXT_PUBLIC_YNKLV_TOKEN_SEPOLIA     as `0x${string}`,
    ynklvPass:   process.env.NEXT_PUBLIC_YNKLV_PASS_SEPOLIA      as `0x${string}`,
    ynklvStudio: process.env.NEXT_PUBLIC_YNKLV_STUDIO_SEPOLIA    as `0x${string}`,
    treasury:    process.env.NEXT_PUBLIC_YNKLV_TREASURY_SEPOLIA  as `0x${string}`,
  },
} as const

// ─── ABIs (minimal, add full ABI from artifacts in production) ───────────────

export const YNKLV_TOKEN_ABI = [
  // Read
  { name: 'balanceOf',      type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'totalSupply',    type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'getVotes',       type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'nonces',         type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'DOMAIN_SEPARATOR', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'bytes32' }] },

  // Write
  { name: 'transfer',       type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }],
    outputs: [{ type: 'bool' }] },
  { name: 'approve',        type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }],
    outputs: [{ type: 'bool' }] },
  { name: 'burn',           type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'value', type: 'uint256' }], outputs: [] },
  { name: 'permit',         type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'owner',    type: 'address' },
      { name: 'spender',  type: 'address' },
      { name: 'value',    type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'v',        type: 'uint8'   },
      { name: 'r',        type: 'bytes32' },
      { name: 's',        type: 'bytes32' },
    ],
    outputs: [] },
  { name: 'delegate',       type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'delegatee', type: 'address' }], outputs: [] },

  // Events
  { name: 'Transfer', type: 'event',
    inputs: [
      { name: 'from',  type: 'address', indexed: true },
      { name: 'to',    type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ]},
] as const

export const YNKLV_PASS_ABI = [
  // Read
  { name: 'balanceOf',    type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'ownerOf',      type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }] },
  { name: 'tokenURI',     type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }] },
  { name: 'holderToken',  type: 'function', stateMutability: 'view',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'passData',     type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { name: 'tier',             type: 'uint8'   },
      { name: 'genesisTimestamp', type: 'uint64'  },
      { name: 'reputationScore',  type: 'uint32'  },
      { name: 'epochsLived',      type: 'uint16'  },
      { name: 'isSoulbound',      type: 'bool'    },
      { name: 'cityCode',         type: 'bytes32' },
    ]},

  // Write
  { name: 'mint',          type: 'function', stateMutability: 'nonpayable',
    inputs: [], outputs: [] },
  { name: 'toggleSoulbound', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [] },
  { name: 'setCity',       type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }, { name: 'cityCode', type: 'bytes32' }],
    outputs: [] },

  // Events
  { name: 'PassMinted',    type: 'event',
    inputs: [
      { name: 'holder',           type: 'address', indexed: true },
      { name: 'tokenId',          type: 'uint256', indexed: true },
      { name: 'genesisTimestamp', type: 'uint64',  indexed: false },
    ]},
  { name: 'TierUpdated', type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'oldTier', type: 'uint8',   indexed: false },
      { name: 'newTier', type: 'uint8',   indexed: false },
    ]},
] as const

export const YNKLV_STUDIO_ABI = [
  // Read
  { name: 'getProduct',   type: 'function', stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [/* Product struct */] },
  { name: 'totalEarned',  type: 'function', stateMutability: 'view',
    inputs: [{ name: 'creator', type: 'address' }],
    outputs: [{ type: 'uint256' }] },
  { name: 'totalVolume',  type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'effectivePrice', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }, { name: 'regionTier', type: 'uint8' }],
    outputs: [{ type: 'uint256' }] },

  // Write
  { name: 'publishProduct', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'priceYNKLV',         type: 'uint256'    },
      { name: 'collaborators',      type: 'address[]'  },
      { name: 'shareBPS',           type: 'uint256[]'  },
      { name: 'contentHash',        type: 'bytes32'    },
      { name: 'regionADiscountBPS', type: 'uint256'    },
      { name: 'regionBDiscountBPS', type: 'uint256'    },
    ],
    outputs: [{ name: 'productId', type: 'uint256' }] },
  { name: 'purchase',   type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId',  type: 'uint256' },
      { name: 'regionTier', type: 'uint8'   },
      { name: 'minPrice',   type: 'uint256' },
    ],
    outputs: [] },

  // Events
  { name: 'ProductPublished', type: 'event',
    inputs: [
      { name: 'productId',     type: 'uint256', indexed: true },
      { name: 'primaryCreator',type: 'address', indexed: true },
      { name: 'priceYNKLV',   type: 'uint256', indexed: false },
      { name: 'contentHash',  type: 'bytes32', indexed: false },
    ]},
  { name: 'ProductPurchased', type: 'event',
    inputs: [
      { name: 'productId',  type: 'uint256', indexed: true },
      { name: 'buyer',      type: 'address', indexed: true },
      { name: 'pricePaid',  type: 'uint256', indexed: false },
      { name: 'regionTier', type: 'uint8',   indexed: false },
    ]},
] as const
