import { Hono } from 'hono'

export const complianceRoutes = new Hono()

complianceRoutes.get('/disclosures', (c) => {
  return c.json({
    data: {
      tokenPositioning:
        'YANKELV is a utility token. It provides access to the Zamani ecosystem, governance participation rights, and creator reward settlement. It is not an investment product.',
      noInvestmentRepresentation:
        'YANKELV Foundation makes no representations about the future price, value, or exchangeability of YANKELV tokens. Acquiring tokens does not constitute an investment.',
      fiatOnRamp:
        'Any conversion between fiat currency and YANKELV is handled exclusively by licensed, regulated third-party providers with applicable KYC/AML compliance. YANKELV Foundation does not operate a currency exchange.',
      regulatoryStatus:
        'YANKELV is designed to comply with applicable utility token frameworks including MiCA (EU). Legal status may vary by jurisdiction. Consult qualified legal counsel for jurisdiction-specific advice.',
      prohibitedLanguage: [
        'guaranteed returns',
        'guaranteed profit',
        'passive income',
        'get rich',
        'to the moon',
        'risk-free',
        'guaranteed yield',
      ],
      approvedFramings: [
        'ecosystem access',
        'participation',
        'membership',
        'creator rewards',
        'coordination',
        'contribution recognition',
      ],
      lastUpdated: '2024-06-01T00:00:00Z',
      jurisdiction: 'EU/Global (utility token framework)',
    },
  })
})
