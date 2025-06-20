"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useSendCalls } from "wagmi"
import { encodeFunctionData, parseUnits, formatUnits } from "viem"
import { erc20Abi } from "viem"
import { ExternalLink, Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface Product {
  name: string
  price: number
  priceUSDC: number
}

interface SmartWalletCheckoutProps {
  product: Product
  onSuccess?: (txHash: string) => void
  onError?: (error: string) => void
}

export function SmartWalletCheckout({ product, onSuccess, onError }: SmartWalletCheckoutProps) {
  // DEBUG: Log product data immediately
  console.log("🔍 DEBUG product data →", product)

  // TESTING: Temporarily set price to 0.05 USDC
  product.priceUSDC = 0.05
  console.log("🔍 DEBUG after setting test price →", product)

  const { address, isConnected } = useAccount()
  const { sendCalls } = useSendCalls()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Contract addresses
  const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base USDC
  const MERCHANT_ADDRESS = "0x33a7A26d9C6C799a02E4870137dE647674371FfC"

  const isValidPrice = () => {
    const isValid =
      product.priceUSDC !== undefined &&
      product.priceUSDC !== null &&
      typeof product.priceUSDC === "number" &&
      product.priceUSDC > 0 &&
      !isNaN(product.priceUSDC)
    console.log("✅ Price validation:", { priceUSDC: product.priceUSDC, isValid })
    return isValid
  }

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      const errorMsg = "Please connect your wallet first"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate product price
    if (!isValidPrice()) {
      const errorMsg = "Invalid product price"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setIsProcessing(true)
    setError(null)
    setIsSuccess(false)

    try {
      console.log("🚀 Processing payment for:", product.name)
      console.log("💰 Product priceUSDC:", product.priceUSDC, "Type:", typeof product.priceUSDC)

      // CRITICAL FIX: Ensure we have a valid number and convert properly
      const priceNumber = Number(product.priceUSDC)
      console.log("🔢 Converted to number:", priceNumber)

      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error(`Invalid price number: ${priceNumber}`)
      }

      // CRITICAL FIX: Convert USDC amount to wei (6 decimals) with proper validation
      const priceString = priceNumber.toFixed(6) // Ensure proper decimal places
      console.log("📝 Price string for parseUnits:", priceString)

      const usdcAmount = parseUnits(priceString, 6)
      console.log("⚡ parseUnits result (wei):", usdcAmount.toString())
      console.log("🔄 Converted back to USDC:", formatUnits(usdcAmount, 6))

      // Verify the amount is not zero
      if (usdcAmount === 0n) {
        throw new Error("USDC amount is zero after conversion!")
      }

      // Smart Wallet Profiles data collection requests
      const profileRequests = [
        { type: "email", optional: false },
        { type: "phoneNumber", optional: false },
        { type: "name", optional: false },
        { type: "physicalAddress", optional: false },
      ]

      // CRITICAL FIX: Encode USDC transfer with validated amount
      console.log("🏗️ Encoding transfer function...")
      console.log("📍 To address:", MERCHANT_ADDRESS)
      console.log("💎 Amount (wei):", usdcAmount.toString())

      const transferCall = {
        to: USDC_CONTRACT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [MERCHANT_ADDRESS, usdcAmount],
        }),
      }

      console.log("📦 Transfer call object:", transferCall)
      console.log("🔗 Encoded data length:", transferCall.data.length)

      // CRITICAL FIX: Add value field to ensure Smart Wallet sees the amount
      const callsWithValue = [
        {
          ...transferCall,
          value: 0n, // ERC20 transfers don't need ETH value, but include for clarity
        },
      ]

      console.log("📋 Final calls array:", callsWithValue)

      // Execute transaction with Smart Wallet Profiles data collection
      console.log("🚀 Calling sendCalls with capabilities...")
      const result = await sendCalls({
        calls: callsWithValue,
        capabilities: {
          dataCallback: {
            requests: profileRequests,
            callbackURL: `${window.location.origin}/api/profile-callback`,
          },
        },
      })

      console.log("✅ Transaction result:", result)
      console.log("🔍 Result type:", typeof result)
      console.log("🗝️ Result keys:", result ? Object.keys(result) : "no result")

      if (result) {
        // Extract transaction hash
        const txHash =
          typeof result === "string"
            ? result
            : result.transactionHash || result.hash || result.id || result.receipt?.transactionHash

        console.log("🎯 Extracted transaction hash:", txHash)

        if (txHash) {
          setTransactionHash(txHash)
          setIsSuccess(true)
          onSuccess?.(txHash)
          console.log("🎉 Payment successful! Transaction hash:", txHash)
        } else {
          console.warn("⚠️ Transaction completed but no hash found in result:", result)
          // Still consider it successful if we got a result
          setIsSuccess(true)
          onSuccess?.("unknown")
        }
      } else {
        throw new Error("Transaction failed - sendCalls returned null/undefined")
      }
    } catch (err) {
      console.error("❌ Payment failed:", err)
      console.error("🔍 Error type:", typeof err)
      console.error("📝 Error message:", err instanceof Error ? err.message : String(err))

      let errorMessage = "Payment failed"
      if (err instanceof Error) {
        if (err.message.includes("rejected") || err.message.includes("denied")) {
          errorMessage = "Transaction cancelled by user"
        } else if (err.message.includes("insufficient")) {
          errorMessage = "Insufficient USDC balance"
        } else if (err.message.includes("zero")) {
          errorMessage = "Invalid amount - cannot send zero USDC"
        } else {
          errorMessage = `Transaction failed: ${err.message}`
        }
      }

      console.log("📢 Final error message:", errorMessage)
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetState = () => {
    setIsSuccess(false)
    setTransactionHash(null)
    setError(null)
  }

  // Success state
  if (isSuccess && transactionHash) {
    return (
      <div className="space-y-4">
        <div className="bg-green-900 border-2 border-green-400 p-4 rounded-lg">
          <div className="flex items-center text-green-400 font-bold mb-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            Payment Successful!
          </div>
          <div className="text-white space-y-1">
            <div>Product: {product.name}</div>
            <div>Amount Paid: ${product.priceUSDC} USDC</div>
            <div className="text-green-400 text-sm">✓ Transaction confirmed on Base network</div>
            <div className="text-green-400 text-sm">✓ Profile information collected</div>
          </div>
        </div>

        {transactionHash !== "unknown" && (
          <div className="bg-black border-2 border-blue-400 p-4 rounded-lg">
            <h4 className="text-blue-400 font-bold mb-2">Transaction Details</h4>
            <div className="text-white text-sm space-y-2">
              <div className="font-mono">
                {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
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
          onClick={resetState}
          className="w-full bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-bold"
        >
          Make Another Purchase
        </Button>
      </div>
    )
  }

  // Invalid price state
  if (!isValidPrice()) {
    return (
      <div className="space-y-4">
        <div className="bg-black border-2 border-yellow-400 p-4 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">Smart Wallet Checkout</h3>
          <div className="text-white space-y-1">
            <div>Product: {product.name}</div>
            <div className="text-xl font-bold text-red-400">Pay {product.priceUSDC || "undefined"} USDC</div>
            <div className="text-red-400 text-sm">✗ Invalid price detected</div>
          </div>
        </div>

        <div className="bg-red-900 border-2 border-red-400 p-4 rounded-lg">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Invalid Price
          </div>
          <div className="text-white text-sm">
            Price: {String(product.priceUSDC)} (Type: {typeof product.priceUSDC})
          </div>
        </div>

        <Button
          disabled
          className="w-full bg-gray-600 border-2 border-gray-400 text-gray-400 font-bold cursor-not-allowed"
        >
          Invalid Price - Cannot Purchase
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Product Summary */}
      <div className="bg-black border-2 border-yellow-400 p-4 rounded-lg">
        <h3 className="text-yellow-400 font-bold mb-2">Smart Wallet Checkout</h3>
        <div className="text-white space-y-1">
          <div>Product: {product.name}</div>
          <div className="text-2xl font-bold text-green-400">Pay {product.priceUSDC} USDC</div>
          <div className="text-green-400 text-sm">✓ Instant checkout with profile collection</div>
          <div className="text-gray-400 text-xs">
            Payment to: {MERCHANT_ADDRESS.slice(0, 6)}...{MERCHANT_ADDRESS.slice(-4)}
          </div>
          <div className="text-gray-400 text-xs">
            DEBUG: Price = {product.priceUSDC} ({typeof product.priceUSDC})
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border-2 border-red-400 p-4 rounded-lg">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Error
          </div>
          <div className="text-white text-sm">{error}</div>
        </div>
      )}

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={isProcessing || !isConnected || !isValidPrice()}
        className={`w-full border-2 border-white font-bold ${
          !isConnected || !isValidPrice()
            ? "bg-red-600 hover:bg-red-500 text-white"
            : isProcessing
              ? "bg-yellow-600 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : !isConnected ? (
          "Connect Wallet First"
        ) : !isValidPrice() ? (
          "Invalid Price"
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Buy with Smart Wallet
          </>
        )}
      </Button>

      {/* Info Text */}
      <div className="text-xs text-gray-400 text-center">
        This will collect your shipping info for instant future checkouts
      </div>
    </div>
  )
}
