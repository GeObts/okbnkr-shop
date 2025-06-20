"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useSendCalls } from "wagmi"
import { encodeFunctionData, parseUnits } from "viem"
import { erc20Abi } from "viem"
import { ExternalLink, AlertCircle } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)

  const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" // Base USDC
  const MERCHANT_ADDRESS = "0x33a7A26d9C6C799a02E4870137dE647674371FfC" // Updated merchant address

  // Reset state when product changes or component remounts
  useEffect(() => {
    resetState()
  }, [product.id])

  const resetState = () => {
    setTransactionHash(null)
    setTransactionSuccess(false)
    setIsProcessing(false)
    setError(null)
  }

  // Validate product price
  const isValidPrice = () => {
    console.log("Validating price:", product.priceUSDC, typeof product.priceUSDC)
    return (
      product &&
      product.priceUSDC !== undefined &&
      product.priceUSDC !== null &&
      typeof product.priceUSDC === "number" &&
      product.priceUSDC > 0 &&
      !isNaN(product.priceUSDC)
    )
  }

  const handlePurchase = async () => {
    // Reset previous states
    setError(null)
    setTransactionSuccess(false)

    console.log("Starting purchase process...")
    console.log("Product:", product)
    console.log("Sending payment:", product.priceUSDC)

    // Check wallet connection
    if (!isConnected || !address) {
      const errorMsg = "Please connect your wallet first"
      setError(errorMsg)
      onError(errorMsg)
      return
    }

    // Validate product price
    if (!isValidPrice()) {
      const errorMsg = `Invalid product price: ${product.priceUSDC}. Cannot process payment.`
      console.error(errorMsg)
      setError(errorMsg)
      onError(errorMsg)
      return
    }

    setIsProcessing(true)

    try {
      // Parse USDC amount with 6 decimals
      const usdcAmount = parseUnits(product.priceUSDC.toString(), 6)
      console.log("Final transfer args:", [MERCHANT_ADDRESS, usdcAmount])
      console.log("USDC amount parsed:", usdcAmount.toString())

      // Smart Wallet Profiles data collection requests
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
          args: [MERCHANT_ADDRESS, usdcAmount],
        }),
      }

      console.log("Transfer call prepared:", transferCall)
      console.log("Transfer call data:", transferCall.data)

      // Send transaction with Smart Wallet Profiles data collection
      console.log("Calling sendCalls...")
      const result = await sendCalls({
        calls: [transferCall],
        capabilities: {
          dataCallback: {
            requests: requests,
            callbackURL: `${window.location.origin}/api/data-validation`,
          },
        },
      })

      console.log("sendCalls result:", result)
      console.log("Result type:", typeof result)
      console.log("Result keys:", result ? Object.keys(result) : "no result")

      // Check if we have a valid result
      if (result) {
        console.log("Transaction appears successful")
        setTransactionSuccess(true)
        setIsProcessing(false)

        // Try to extract transaction hash from various possible locations
        let txHash = null
        if (typeof result === "string") {
          txHash = result
        } else if (result && typeof result === "object") {
          txHash =
            result.transactionHash ||
            result.hash ||
            result.id ||
            result.txHash ||
            result.receipt?.transactionHash ||
            result.receipt?.hash
        }

        console.log("Extracted transaction hash:", txHash)

        if (txHash) {
          setTransactionHash(txHash)
        }

        onSuccess(txHash || undefined)

        // Auto-reset after 10 seconds
        setTimeout(() => {
          resetState()
        }, 10000)
      } else {
        console.error("No result returned from sendCalls")
        throw new Error("Transaction failed - sendCalls returned no result")
      }
    } catch (error) {
      console.error("Purchase failed with error:", error)
      console.error("Error type:", typeof error)
      console.error("Error message:", error instanceof Error ? error.message : String(error))
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack")

      setIsProcessing(false)
      setTransactionSuccess(false)

      // Extract the actual error message
      let errorMessage = "Payment failed"
      if (error instanceof Error) {
        if (error.message.includes("rejected") || error.message.includes("denied")) {
          errorMessage = "Transaction cancelled by user"
        } else if (error.message.includes("insufficient")) {
          errorMessage = "Insufficient USDC balance"
        } else if (error.message.includes("Unsupported data callback type")) {
          errorMessage = "Smart Wallet configuration error"
        } else if (error.message.includes("no result")) {
          errorMessage = "Transaction failed - no confirmation received"
        } else {
          // Show the actual error message from the blockchain/wallet
          errorMessage = `Transaction failed: ${error.message}`
        }
      } else {
        errorMessage = `Transaction failed: ${String(error)}`
      }

      console.log("Final error message:", errorMessage)
      setError(errorMessage)
      onError(errorMessage)

      // Auto-clear error after 15 seconds
      setTimeout(() => {
        setError(null)
      }, 15000)
    }
  }

  const handleRetry = () => {
    resetState()
  }

  // Show error state if price is invalid
  if (!isValidPrice()) {
    return (
      <div className="space-y-4">
        <div className="bg-red-900 border-2 border-red-400 p-4 rounded">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Invalid Product Price
          </div>
          <div className="text-white text-sm">
            This product has an invalid price (${product?.priceUSDC || "undefined"}). Cannot process payment.
            <br />
            <span className="text-gray-400 text-xs">
              Price type: {typeof product?.priceUSDC}, Value: {String(product?.priceUSDC)}
            </span>
          </div>
        </div>
        <Button
          disabled
          className="w-full bg-gray-600 border-2 border-gray-400 text-gray-400 font-bold pixel-button cursor-not-allowed"
        >
          CHECKOUT UNAVAILABLE
        </Button>
      </div>
    )
  }

  // Show success state
  if (transactionSuccess) {
    return (
      <div className="space-y-4">
        <div className="bg-green-900 border-2 border-green-400 p-4 rounded">
          <h3 className="text-green-400 font-bold mb-2">✅ Payment Complete!</h3>
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
          onClick={handleRetry}
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
          <div className="text-gray-400 text-xs">
            Debug: Price type: {typeof product.priceUSDC}, Valid: {isValidPrice() ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Show error if present */}
      {error && (
        <div className="bg-red-900 border-2 border-red-400 p-4 rounded">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Transaction Error
          </div>
          <div className="text-white text-sm">{error}</div>
        </div>
      )}

      {/* Checkout button */}
      <Button
        onClick={handlePurchase}
        disabled={isProcessing || !isConnected || !isValidPrice()}
        className={`w-full border-2 border-white font-bold pixel-button ${
          !isConnected
            ? "bg-red-600 hover:bg-red-500 text-white"
            : isProcessing
              ? "bg-yellow-600 hover:bg-yellow-500 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {!isConnected ? "CONNECT WALLET FIRST" : isProcessing ? "PROCESSING PAYMENT..." : "BUY WITH SMART WALLET"}
      </Button>

      <div className="text-xs text-gray-400 text-center">
        This purchase will collect your shipping info via Smart Wallet Profiles for instant future checkouts
      </div>
    </div>
  )
}
