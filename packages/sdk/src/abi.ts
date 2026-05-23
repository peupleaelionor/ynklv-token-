/**
 * Minimal ABIs for the on-chain reads the SDK performs. Kept intentionally
 * small — full ABIs live in @ynklv/contracts artifacts.
 */

export const ynklvTokenAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

export const membershipRegistryAbi = [
  {
    type: 'function',
    name: 'tierOf',
    stateMutability: 'view',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [{ name: 'tier', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasTier',
    stateMutability: 'view',
    inputs: [
      { name: 'member', type: 'address' },
      { name: 'minTier', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'contributionScore',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'genesisTimestamp',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint64' }],
  },
] as const

export const rewardsVaultAbi = [
  {
    type: 'function',
    name: 'claimable',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ name: 'amount', type: 'uint256' }],
  },
] as const
