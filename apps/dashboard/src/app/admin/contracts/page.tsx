const CONTRACTS = [
  {
    name: 'YANKELV Token',
    symbol: 'ERC20Burnable',
    address: '0x0000000000000000000000000000000000000001',
    roles: ['MINTER_ROLE', 'PAUSER_ROLE'],
    paused: false,
    network: 'Base Mainnet',
  },
  {
    name: 'MembershipRegistry',
    symbol: 'AccessControl',
    address: '0x0000000000000000000000000000000000000002',
    roles: ['SCORER_ROLE', 'GOVERNOR_ROLE', 'PAUSER_ROLE'],
    paused: false,
    network: 'Base Mainnet',
  },
  {
    name: 'EcosystemRewardsVault',
    symbol: 'ReentrancyGuard',
    address: '0x0000000000000000000000000000000000000003',
    roles: ['ALLOCATOR_ROLE', 'PAUSER_ROLE'],
    paused: false,
    network: 'Base Mainnet',
  },
  {
    name: 'CreatorRewardsDistributor',
    symbol: '90/8.5/1.5 split',
    address: '0x0000000000000000000000000000000000000004',
    roles: ['PAUSER_ROLE'],
    paused: false,
    network: 'Base Mainnet',
  },
]

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-light text-ynklv-cream">Contract status</h2>
        <p className="text-xs text-ynklv-muted mt-1">Deployed on Base. Slither-audited. OpenZeppelin v5 base.</p>
      </div>

      <div className="space-y-3">
        {CONTRACTS.map((c) => (
          <div key={c.name} className="bg-ynklv-surface border border-ynklv rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-ynklv-cream">{c.name}</p>
                <p className="text-xs text-ynklv-muted font-mono mt-0.5">{c.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ynklv-muted">{c.symbol}</span>
                {c.paused ? (
                  <span className="text-xs border border-red-700 text-red-400 rounded-full px-2 py-0.5">Paused</span>
                ) : (
                  <span className="text-xs border border-green-700 text-green-400 rounded-full px-2 py-0.5">Active</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {c.roles.map((role) => (
                <span key={role} className="text-[10px] font-mono bg-black/30 text-ynklv-muted border border-ynklv/50 rounded px-2 py-0.5">
                  {role}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ynklv/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-ynklv-muted">{c.network}</span>
              <button className="ml-auto text-xs text-ynklv-muted hover:text-ynklv-copper transition-colors">
                View on Basescan →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
