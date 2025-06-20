"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useSendCalls, useWriteContract } from "wagmi"
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
  console.log("DEBUG product data →", product)

  // TESTING: Temporarily set price to 0.05 USDC
  product.priceUSDC = 0.05
  console.log("DEBUG after setting test price →", product)

  const { address, isConnected } = useAccount()
  const { sendCalls } = useSendCalls()
  const { writeContract } = useWriteContract()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isRegularProcessing, setIsRegularProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Base USDC contract address and merchant address
  const USDC_CONTRACT = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  const MERCHANT_ADDRESS = "0x33a7A26d9C6C799a02E4870137dE647674371FfC"

  const isValidPrice = () => {
    return (
      product.priceUSDC !== undefined &&
      product.priceUSDC !== null &&
      typeof product.priceUSDC === "number" &&
      product.priceUSDC > 0 &&
      !isNaN(product.priceUSDC)
    )
  }

  // Calculate USDC amount with extensive debugging
  const calculateUSDCAmount = () => {
    console.log("🔍 CALCULATING USDC AMOUNT:")
    console.log("Price input:", product.priceUSDC)
    console.log("Price type:", typeof product.priceUSDC)
    console.log("Price toString():", product.priceUSDC.toString())

    // Convert to USDC units (6 decimals)
    const amount = parseUnits(product.priceUSDC.toString(), 6)
    console.log("parseUnits result:", amount.toString())
    console.log("Amount in wei:", amount)
    console.log("Back to USDC:", formatUnits(amount, 6))

    // Manual verification
    const manualCalc = BigInt(Math.round(product.priceUSDC * 1000000))
    console.log("Manual calculation:", manualCalc.toString())
    console.log("parseUnits vs manual:", amount.toString(), "vs", manualCalc.toString())
    console.log("Calculations match:", amount === manualCalc)

    return amount
  }

  // Smart Wallet checkout
  const handleSmartWalletPurchase = async () => {
    if (!isConnected || !address) {
      const errorMsg = "Please connect your wallet first"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

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
      console.log("🚀 SMART WALLET CHECKOUT STARTING")
      console.log("Product:", product.name)

      const amount = calculateUSDCAmount()

      // Verify amount is not zero
      if (amount === 0n) {
        throw new Error("CRITICAL: Amount calculated as zero!")
      }

      // Smart Wallet Profiles data collection requests
      const profileRequests = [
        { type: "email", optional: false },
        { type: "phoneNumber", optional: false },
        { type: "name", optional: false },
        { type: "physicalAddress", optional: false },
      ]

      // Create the transfer call
      const transferCall = {
        to: USDC_CONTRACT,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [MERCHANT_ADDRESS, amount],
        }),
      }

      console.log("📦 SMART WALLET TRANSFER CALL:")
      console.log("  - Contract:", USDC_CONTRACT)
      console.log("  - Recipient:", MERCHANT_ADDRESS)
      console.log("  - Amount (wei):", amount.toString())
      console.log("  - Amount (USDC):", formatUnits(amount, 6))
      console.log("  - Encoded data:", transferCall.data)

      // Execute transaction with Smart Wallet Profiles
      console.log("🔄 Calling sendCalls with Smart Wallet...")
      const result = await sendCalls({
        calls: [transferCall],
        capabilities: {
          dataCallback: {
            requests: profileRequests,
            callbackURL: `${window.location.origin}/api/profile-callback`,
          },
        },
      })

      console.log("✅ Smart Wallet result:", result)

      if (result) {
        const txHash = typeof result === "string" ? result : result.transactionHash || result.hash || result.id

        if (txHash) {
          setTransactionHash(txHash)
          setIsSuccess(true)
          onSuccess?.(txHash)
          console.log("🎉 Smart Wallet payment successful! Hash:", txHash)
        } else {
          console.warn("⚠️ Smart Wallet completed but no hash found")
          setIsSuccess(true)
          onSuccess?.("smart-wallet-success")
        }
      } else {
        throw new Error("Smart Wallet sendCalls returned null/undefined")
      }
    } catch (err) {
      console.error("❌ SMART WALLET FAILED:", err)
      console.log("Full Smart Wallet error:", JSON.stringify(err, Object.getOwnPropertyNames(err)))

      let errorMessage = "Smart Wallet payment failed"
      let detailedError = ""

      if (err instanceof Error) {
        detailedError = err.message
        if (err.message.includes("rejected") || err.message.includes("denied")) {
          errorMessage = "Smart Wallet transaction cancelled by user"
        } else if (err.message.includes("insufficient")) {
          errorMessage = "Insufficient USDC balance for Smart Wallet"
        } else {
          errorMessage = `Smart Wallet error: ${err.message}`
        }
      }

      setError(`${errorMessage}\n\nDetails: ${detailedError}`)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  // Regular wallet checkout (for debugging)
  const handleRegularWalletPurchase = async () => {
    if (!isConnected || !address) {
      const errorMsg = "Please connect your wallet first"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    if (!isValidPrice()) {
      const errorMsg = "Invalid product price"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setIsRegularProcessing(true)
    setError(null)
    setIsSuccess(false)

    try {
      console.log("🔧 REGULAR WALLET CHECKOUT STARTING")
      console.log("Product:", product.name)

      const amount = calculateUSDCAmount()

      // Verify amount is not zero
      if (amount === 0n) {
        throw new Error("CRITICAL: Amount calculated as zero!")
      }

      console.log("📦 REGULAR WALLET TRANSFER:")
      console.log("  - Contract:", USDC_CONTRACT)
      console.log("  - Recipient:", MERCHANT_ADDRESS)
      console.log("  - Amount (wei):", amount.toString())
      console.log("  - Amount (USDC):", formatUnits(amount, 6))

      // Execute regular ERC20 transfer
      console.log("🔄 Calling writeContract with regular wallet...")
      const result = await writeContract({
        address: USDC_CONTRACT,
        abi: erc20Abi,
        functionName: "transfer",
        args: [MERCHANT_ADDRESS, amount],
      })

      console.log("✅ Regular wallet result:", result)

      if (result) {
        setTransactionHash(result)
        setIsSuccess(true)
        onSuccess?.(result)
        console.log("🎉 Regular wallet payment successful! Hash:", result)
      } else {
        throw new Error("Regular wallet writeContract returned null/undefined")
      }
    } catch (err) {
      console.error("❌ REGULAR WALLET FAILED:", err)
      console.log("Full regular wallet error:", JSON.stringify(err, Object.getOwnPropertyNames(err)))

      let errorMessage = "Regular wallet payment failed"
      let detailedError = ""

      if (err instanceof Error) {
        detailedError = err.message
        if (err.message.includes("rejected") || err.message.includes("denied")) {
          errorMessage = "Regular wallet transaction cancelled by user"
        } else if (err.message.includes("insufficient")) {
          errorMessage = "Insufficient USDC balance for regular wallet"
        } else {
          errorMessage = `Regular wallet error: ${err.message}`
        }
      }

      setError(`${errorMessage}\n\nDetails: ${detailedError}`)
      onError?.(errorMessage)
    } finally {
      setIsRegularProcessing(false)
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
            <div>Amount Paid: {product.priceUSDC} USDC</div>
            <div className="text-green-400 text-sm">✓ Transaction confirmed on Base network</div>
            {transactionHash.includes("smart-wallet") ? (
              <div className="text-green-400 text-sm">✓ Profile information collected via Smart Wallet</div>
            ) : (
              <div className="text-blue-400 text-sm">✓ Regular wallet transaction</div>
            )}
          </div>
        </div>

        {!transactionHash.includes("smart-wallet") && (
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
        <div className="bg-red-900 border-2 border-red-400 p-4 rounded-lg">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Invalid Price
          </div>
          <div className="text-white text-sm">
            Price: {String(product.priceUSDC)} (Type: {typeof product.priceUSDC})
          </div>
        </div>
        <Button disabled className="w-full bg-gray-600 text-gray-400 font-bold cursor-not-allowed">
          Invalid Price - Cannot Purchase
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Product Summary */}
      <div className="bg-black border-2 border-yellow-400 p-4 rounded-lg">
        <h3 className="text-yellow-400 font-bold mb-2">Checkout Options</h3>
        <div className="text-white space-y-1">
          <div>Product: {product.name}</div>
          <div className="text-2xl font-bold text-green-400">Pay {product.priceUSDC} USDC</div>
          <div className="text-gray-400 text-xs">
            Contract: {USDC_CONTRACT.slice(0, 8)}...{USDC_CONTRACT.slice(-6)}
          </div>
          <div className="text-gray-400 text-xs">
            Recipient: {MERCHANT_ADDRESS.slice(0, 8)}...{MERCHANT_ADDRESS.slice(-6)}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border-2 border-red-400 p-4 rounded-lg">
          <div className="flex items-center text-red-400 font-bold mb-2">
            <AlertCircle className="w-5 h-5 mr-2" />
            Transaction Error
          </div>
          <div className="text-white text-sm whitespace-pre-wrap">{error}</div>
        </div>
      )}

      {/* Smart Wallet Checkout Button */}
      <Button
        onClick={handleSmartWalletPurchase}
        disabled={isProcessing || isRegularProcessing || !isConnected || !isValidPrice()}
        className={`w-full border-2 border-white font-bold ${
          !isConnected || !isValidPrice()
            ? "bg-red-600 hover:bg-red-500 text-white"
            : isProcessing
              ? "bg-yellow-600 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500 text-white"
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Smart Wallet...
          </>
        ) : !isConnected ? (
          "Connect Wallet First"
        ) : !isValidPrice() ? (
          "Invalid Price"
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            SMART WALLET (with profiles)
          </>
        )}
      </Button>

      {/* Regular Wallet Checkout Button */}
      <Button
        onClick={handleRegularWalletPurchase}
        disabled={isProcessing || isRegularProcessing || !isConnected || !isValidPrice()}
        className={`w-full border-2 border-white font-bold ${
          !isConnected || !isValidPrice()
            ? "bg-red-600 hover:bg-red-500 text-white"
            : isRegularProcessing
              ? "bg-yellow-600 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {isRegularProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Regular Wallet...
          </>
        ) : !isConnected ? (
          "Connect Wallet First"
        ) : !isValidPrice() ? (
          "Invalid Price"
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            CONNECT WALLET (debug mode)
          </>
        )}
      </Button>

      {/* Info Text */}
      <div className="text-xs text-gray-400 text-center">
        Smart Wallet collects shipping info • Regular wallet for debugging
      </div>
    </div>
  )
}
