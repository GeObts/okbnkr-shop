"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, CheckCircle, Truck, ExternalLink } from "lucide-react"
import { SmartWalletCheckout } from "@/components/smart-wallet-checkout"
import { useAccount } from "wagmi"
import { base } from "wagmi/chains"

interface Product {
  id: string
  name: string
  nameJp: string
  price: number
  priceETH: number
  category: string
  priceUSDC: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  userProfile: any
}

export function CheckoutModal({ isOpen, onClose, product, userProfile }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const { isConnected, chain } = useAccount()
  const isOnBase = chain?.id === base.id

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setIsComplete(false)
      setIsProcessing(false)
      setPaymentError(null)
      setTransactionHash(null)
    }
  }, [isOpen, product])

  if (!product) return null

  const handlePaymentSuccess = (txHash?: string) => {
    setIsProcessing(false)
    setIsComplete(true)
    setPaymentError(null)
    if (txHash) {
      setTransactionHash(txHash)
    }
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    setIsProcessing(false)
    setIsComplete(false)
  }

  const handleClose = () => {
    // Reset all state when closing
    setIsComplete(false)
    setIsProcessing(false)
    setPaymentError(null)
    setTransactionHash(null)
    onClose()
  }

  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-black border-4 border-green-400 text-green-400">
          <div className="text-center py-8">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold pixel-text mb-4">ORDER CONFIRMED!</h3>
            <div className="space-y-2 text-yellow-400">
              <div>Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              <div>Product: {product.name}</div>
              <div>Total: ${product.priceUSDC} USDC</div>
            </div>

            {transactionHash && (
              <div className="mt-4 p-4 bg-gray-900 border-2 border-blue-400 rounded">
                <div className="text-blue-400 font-bold mb-2">Transaction Details:</div>
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

            <div className="mt-6 flex items-center justify-center text-green-400">
              <Truck className="w-5 h-5 mr-2" />
              <span>Shipping to: {userProfile?.address}</span>
            </div>
            <Button
              onClick={handleClose}
              className="mt-6 bg-green-600 hover:bg-green-500 border-2 border-white text-white font-bold pixel-button"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isProcessing) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400">
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-2xl font-bold pixel-text mb-2">PROCESSING PAYMENT...</h3>
            <div className="text-green-400 font-mono">Confirming transaction on Base network</div>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-anton text-2xl text-center">LIGHTNING CHECKOUT</DialogTitle>
        </DialogHeader>

        <Card className="bg-gray-900 border-2 border-green-400">
          <CardHeader>
            <CardTitle className="text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <span className="text-yellow-400 font-bold">INSTANT PURCHASE</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Product Summary */}
            <div className="bg-black border-2 border-yellow-400 p-4 rounded">
              <h4 className="text-yellow-400 font-bold mb-2">Product:</h4>
              <div className="text-white">
                <div className="font-bold">{product.name}</div>
                <div className="text-sm font-klee text-gray-300">{product.nameJp}</div>
                <div className="text-lg font-bold text-green-400">${product.priceUSDC} USDC</div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-black border-2 border-blue-400 p-4 rounded">
              <h4 className="text-blue-400 font-bold mb-2">Shipping to:</h4>
              <div className="text-white text-sm">
                <div>{userProfile?.name}</div>
                <div>{userProfile?.address}</div>
                <div>{userProfile?.email}</div>
              </div>
            </div>

            {/* Wallet Connection Warning */}
            {!isConnected && (
              <div className="bg-red-900 border-2 border-red-400 p-4 rounded">
                <div className="text-red-400 font-bold">⚠️ Wallet Not Connected</div>
                <div className="text-white text-sm">Please connect your wallet to proceed with checkout.</div>
              </div>
            )}

            {isConnected && !isOnBase && (
              <div className="bg-orange-900 border-2 border-orange-400 p-4 rounded">
                <div className="text-orange-400 font-bold">⚠️ Wrong Network</div>
                <div className="text-white text-sm">Please switch to Base network to complete your purchase.</div>
              </div>
            )}

            {/* Payment Method */}
            <SmartWalletCheckout product={product} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />

            {paymentError && (
              <div className="bg-red-900 border-2 border-red-400 p-4 rounded">
                <div className="text-red-400 font-bold">Payment Error:</div>
                <div className="text-white text-sm">{paymentError}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
