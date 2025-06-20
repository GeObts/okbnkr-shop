"use client"

import { SmartWalletCheckout } from "./smart-wallet-checkout-new"

export function CheckoutDemo() {
  const sampleProduct = {
    name: "Test Product",
    price: 0.05,
    priceUSDC: 0.05,
  }

  const handleSuccess = (txHash: string) => {
    console.log("Payment successful!", txHash)
    alert("Payment successful! Check console for transaction hash.")
  }

  const handleError = (error: string) => {
    console.error("Payment failed:", error)
    alert(`Payment failed: ${error}`)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Smart Wallet Checkout Demo</h2>

      <SmartWalletCheckout product={sampleProduct} onSuccess={handleSuccess} onError={handleError} />
    </div>
  )
}
