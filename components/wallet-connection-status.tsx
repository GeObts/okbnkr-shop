"use client"

import { useAccount, useBalance } from "wagmi"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { base } from "wagmi/chains"

export function WalletConnectionStatus() {
  const { address, isConnected, chain, connector } = useAccount()
  const { data: balance } = useBalance({
    address: address,
    token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base
  })

  if (!isConnected) {
    return (
      <Card className="bg-gray-900 border-2 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center text-gray-400">
            <Wallet className="w-5 h-5 mr-2" />
            <span className="font-mono text-sm">No wallet connected</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isOnBase = chain?.id === base.id
  const walletName = connector?.name || "Unknown Wallet"

  return (
    <Card className={`border-2 ${isOnBase ? "border-green-400 bg-green-900" : "border-red-400 bg-red-900"}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isOnBase ? (
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              )}
              <span className={`font-bold text-sm ${isOnBase ? "text-green-400" : "text-red-400"}`}>
                {isOnBase ? "CONNECTED TO BASE" : "WRONG NETWORK"}
              </span>
            </div>
            <Badge className={`${isOnBase ? "bg-green-600" : "bg-red-600"} text-white font-bold text-xs`}>
              {walletName}
            </Badge>
          </div>

          {/* Wallet Address */}
          <div>
            <div className="text-yellow-400 font-bold text-xs mb-1">WALLET ADDRESS:</div>
            <div className="text-white font-mono text-xs break-all">{address}</div>
          </div>

          {/* Network Info */}
          <div>
            <div className="text-yellow-400 font-bold text-xs mb-1">NETWORK:</div>
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">{chain?.name || "Unknown"}</span>
              {chain && (
                <a
                  href={`${chain.blockExplorers?.default?.url}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* USDC Balance */}
          {isOnBase && balance && (
            <div>
              <div className="text-yellow-400 font-bold text-xs mb-1">USDC BALANCE:</div>
              <div className="text-green-400 font-bold text-sm">
                {Number.parseFloat(balance.formatted).toFixed(2)} USDC
              </div>
            </div>
          )}

          {/* Warning for wrong network */}
          {!isOnBase && (
            <div className="bg-red-800 border border-red-400 p-2 rounded">
              <div className="text-red-400 font-bold text-xs mb-1">⚠️ NETWORK WARNING</div>
              <div className="text-white text-xs">
                Please switch to Base network to make purchases. Current network: {chain?.name}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
