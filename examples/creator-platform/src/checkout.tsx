/**
 * Creator Platform — purchase flow example.
 *
 * Demonstrates how a creator platform integrates @ynklv/sdk
 * to process creator purchases with the 90/8.5/1.5 split.
 */

'use client'

import { useYnklvCheckout } from '@ynklv/sdk/react'

interface PurchaseButtonProps {
  creatorAddress: string
  productId: string
  priceWei: string
  buyerAddress: string
}

export function PurchaseButton({ creatorAddress, productId, priceWei, buyerAddress }: PurchaseButtonProps) {
  const { createCheckout, pending, error } = useYnklvCheckout()

  const handlePurchase = async () => {
    const result = await createCheckout({
      buyer: buyerAddress,
      creator: creatorAddress,
      productId,
      amountWei: priceWei,
      method: 'onchain',
    })

    if (!result.ok) {
      console.error('Checkout failed:', result.error)
      return
    }

    const intent = result.data
    console.log('Checkout intent created:', intent.id)
    // Proceed to wallet signing using intent.id
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePurchase}
        disabled={pending}
        className="w-full py-3 px-6 bg-amber-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-amber-500 transition-colors"
      >
        {pending ? 'Processing…' : 'Purchase with YNKLV'}
      </button>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        90% goes directly to the creator. 8.5% ecosystem. 1.5% burned.
      </p>
    </div>
  )
}
