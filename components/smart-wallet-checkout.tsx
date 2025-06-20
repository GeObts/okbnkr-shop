"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useSendCalls } from "wagmi"
import { encodeFunctionData, parseUnits } from "viem"
import { erc20Abi } from "viem"
import { ExternalLink } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  priceUSDC: number
}

interface SmartWalletCheckoutProps {
  product: Product
  onSuccess: (txHash?: string) => void
  onError: (error: string) => void
}

export function SmartWalletCheckout({ product, onSuccess, onError }: SmartWalletCheckoutProps) {
  const { address, isConnected } = useAccount()
  const { sendCalls } = useSendCalls()
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [transactionSuccess, setTransactionSuccess] = useState(false)

  const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base USDC
  const MERCHANT_ADDRESS = "0x33a7A26d9C6C799a02E4870137dE647674371FfC" // Your actual Base wallet address

  // Reset state when product changes or component remounts
  useEffect(() => {
    setTransactionHash(null)
    setTransactionSuccess(false)
    setIsProcessing(false)
  }, [product.id])

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      onError("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    setTransactionHash(null)
    setTransactionSuccess(false)

    try {
      console.log(`Initiating USDC transfer: ${product.priceUSDC} USDC to ${MERCHANT_ADDRESS}`)

      // Smart Wallet Profiles data collection requests - removed unsupported walletAddress
      const requests = [
        { type: "email", optional: false },
        { type: "phoneNumber", optional: false },
        { type: "name", optional: false },
        { type: "physicalAddress", optional: false },
      ]

      // USDC transfer call - encode the transfer function
      const transferCall = {
        to: USDC_CONTRACT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [MERCHANT_ADDRESS, parseUnits(product.priceUSDC.toString(), 6)],
        }),
      }

      console.log("Transfer call:", transferCall)

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

      console.log("Transaction result:", result)

      if (result) {
        setTransactionSuccess(true)
        // Extract transaction hash if available
        const txHash = result.transactionHash || result.hash || result.id
        if (txHash) {
          setTransactionHash(txHash)
        }
        onSuccess(txHash)
      } else {
        throw new Error("Transaction failed - no result returned")
      }
    } catch (error) {
      console.error("Purchase failed:", error)
      setTransactionSuccess(false)

      let errorMessage = "Purchase failed"
      if (error instanceof Error) {
        if (error.message.includes("rejected")) {
          errorMessage = "Transaction was rejected by user"
        } else if (error.message.includes("insufficient")) {
          errorMessage = "Insufficient USDC balance"
        } else if (error.message.includes("Unsupported data callback type")) {
          errorMessage = "Smart Wallet configuration error"
        } else {
          errorMessage = error.message
        }
      }

      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTransaction = () => {
    setTransactionHash(null)
    setTransactionSuccess(false)
    setIsProcessing(false)
  }

  if (transactionSuccess) {
    return (
      <div className="space-y-4">
        <div className="bg-green-900 border-2 border-green-400 p-4 rounded">
          <h3 className="text-green-400 font-bold mb-2">✅ Payment Successful!</h3>
          <div className="text-white space-y-1">
            <div>Product: {product.name}</div>
            <div>Amount: ${product.priceUSDC} USDC</div>
            <div className="text-green-400 text-sm">✓ Transaction confirmed on Base network</div>
          </div>
        </div>

        {transactionHash && (
          <div className="bg-black border-2 border-blue-400 p-4 rounded">
            <h4 className="text-blue-400 font-bold mb-2">Transaction Details:</h4>
            <div className="text-white text-sm space-y-2">
              <div>
                Hash: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </div>
              <a
                href={`https://basescan.org/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 underline"
              >
                View on BaseScan <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        )}

        <Button
          onClick={resetTransaction}
          className="w-full bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-bold pixel-button"
        >
          BUY ANOTHER
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-black border-2 border-yellow-400 p-4 rounded">
        <h3 className="text-yellow-400 font-bold mb-2">Smart Wallet Checkout</h3>
        <div className="text-white space-y-1">
          <div>Product: {product.name}</div>
          <div>Price: ${product.priceUSDC} USDC</div>
          <div className="text-green-400 text-sm">✓ Lightning-fast checkout with Smart Wallet Profiles</div>
          <div className="text-gray-400 text-xs">
            Payment will be sent to: {MERCHANT_ADDRESS.slice(0, 6)}...{MERCHANT_ADDRESS.slice(-4)}
          </div>
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        disabled={isProcessing || !isConnected}
        className="w-full bg-green-600 hover:bg-green-500 border-2 border-white text-white font-bold pixel-button"
      >
        {isProcessing ? "PROCESSING PAYMENT..." : "BUY WITH SMART WALLET"}
      </Button>

      <div className="text-xs text-gray-400 text-center">
        This purchase will collect your shipping info via Smart Wallet Profiles for instant future checkouts
      </div>
    </div>
  )
}
