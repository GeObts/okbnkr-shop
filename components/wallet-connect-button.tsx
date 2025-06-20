"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle } from "lucide-react"
import { useConnect, useAccount, useDisconnect } from "wagmi"

export function WalletConnectButton() {
  const { connect, connectors, error, isPending } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setConnectionError(null)
      const coinbaseConnector = connectors.find((connector) => connector.id === "coinbaseWalletSDK")

      if (coinbaseConnector) {
        await connect({ connector: coinbaseConnector })
      } else {
        setConnectionError("Coinbase Wallet connector not found")
      }
    } catch (err) {
      console.error("Connection error:", err)
      setConnectionError("Failed to connect wallet. Please try again.")
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionError(null)
  }

  if (connectionError) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={handleConnect}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-500 border-4 border-black text-white font-bold pixel-button"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          RETRY CONNECTION
        </Button>
        <div className="text-xs text-red-400 text-center max-w-48">{connectionError}</div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={handleDisconnect}
          className="bg-green-600 hover:bg-green-500 border-4 border-black text-white font-bold pixel-button"
        >
          <Wallet className="w-4 h-4 mr-2" />
          CONNECTED
        </Button>
        <div className="text-xs text-green-400 text-center">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-black text-yellow-400 hover:bg-gray-800 border-4 border-black font-bold pixel-button"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isPending ? "CONNECTING..." : "CONNECT WALLET"}
    </Button>
  )
}
