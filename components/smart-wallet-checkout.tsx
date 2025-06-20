"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useSendCalls } from "wagmi"
import { encodeFunctionData, parseUnits } from "viem"
import { erc20Abi } from "viem"

interface Product {
  id: string
  name: string
  price: number
  priceUSDC: number
}

interface SmartWalletCheckoutProps {
  product: Product
  onSuccess: () => void
  onError: (error: string) => void
}

export function SmartWalletCheckout({ product, onSuccess, onError }: SmartWalletCheckoutProps) {
  const { address, isConnected } = useAccount()
  const { sendCalls } = useSendCalls()
  const [isProcessing, setIsProcessing] = useState(false)

  const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base USDC
  const MERCHANT_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7" // Replace with actual merchant address

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      onError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)

    try {
      // Smart Wallet Profiles data collection requests
      const requests = [
        { type: "email", optional: false },
        { type: "phoneNumber", optional: false },
        { type: "name", optional: false },
        { type: "physicalAddress", optional: false },
        { type: "walletAddress", optional: false },
      ]

      // USDC transfer call
      const transferCall = {
        to: USDC_CONTRACT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [MERCHANT_ADDRESS, parseUnits(product.priceUSDC.toString(), 6)],
        }),
      }

      // Send transaction with Smart Wallet Profiles data collection
      const result = await sendCalls({
        calls: [transferCall],
        capabilities: {
          dataCallback: {
            requests: requests,
            callbackURL: `${window.location.origin}/api/data-validation`,
          },
        },
      })

      console.log("Transaction sent:", result)
      onSuccess()
    } catch (error) {
      console.error("Purchase failed:", error)
      onError(error instanceof Error ? error.message : "Purchase failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-black border-2 border-yellow-400 p-4 rounded">
        <h3 className="text-yellow-400 font-bold mb-2">Smart Wallet Checkout</h3>
        <div className="text-white space-y-1">
          <div>Product: {product.name}</div>
          <div>Price: ${product.priceUSDC} USDC</div>
          <div className="text-green-400 text-sm">✓ Lightning-fast checkout with Smart Wallet Profiles</div>
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        disabled={isProcessing || !isConnected}
        className="w-full bg-green-600 hover:bg-green-500 border-2 border-white text-white font-bold pixel-button"
      >
        {isProcessing ? "PROCESSING..." : "BUY WITH SMART WALLET"}
      </Button>

      <div className="text-xs text-gray-400 text-center">
        This purchase will collect your shipping info via Smart Wallet Profiles for instant future checkouts
      </div>
    </div>
  )
}
