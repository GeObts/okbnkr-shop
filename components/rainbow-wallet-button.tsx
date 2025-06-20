"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, Copy, ExternalLink, Power } from "lucide-react"
import { useState } from "react"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { base } from "wagmi/chains"

export function RainbowWalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [showDropdown, setShowDropdown] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      alert("Address copied to clipboard!")
    }
  }

  const handleSwitchToBase = () => {
    switchChain({ chainId: base.id })
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="bg-black text-yellow-400 hover:bg-gray-800 border-4 border-yellow-400 font-bold pixel-button"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    CONNECT WALLET
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className="bg-red-600 hover:bg-red-500 border-4 border-black text-white font-bold pixel-button"
                  >
                    Wrong Network
                  </Button>
                )
              }

              return (
                <div className="relative">
                  <Button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-green-600 hover:bg-green-500 border-4 border-black text-white font-bold pixel-button flex items-center"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ""}
                    </span>
                    <span className="sm:hidden">
                      {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-black border-4 border-yellow-400 z-50">
                      <div className="p-4 space-y-3">
                        {/* Account Info */}
                        <div className="border-b-2 border-yellow-400 pb-3">
                          <div className="text-yellow-400 font-bold text-sm mb-1">CONNECTED ACCOUNT</div>
                          <div className="text-white font-mono text-xs break-all">{account.address}</div>
                          {account.displayBalance && (
                            <div className="text-green-400 font-bold text-sm mt-1">{account.displayBalance}</div>
                          )}
                        </div>

                        {/* Chain Info */}
                        <div className="border-b-2 border-yellow-400 pb-3">
                          <div className="text-yellow-400 font-bold text-sm mb-1">NETWORK</div>
                          <div className="flex items-center justify-between">
                            <div className="text-white text-sm">{chain.name}</div>
                            {chain.id !== base.id && (
                              <Badge className="bg-red-600 text-white text-xs">WRONG NETWORK</Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <Button
                            onClick={copyAddress}
                            className="w-full bg-blue-600 hover:bg-blue-500 border-2 border-white text-white font-bold pixel-button text-xs"
                            size="sm"
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            COPY ADDRESS
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            className="w-full bg-purple-600 hover:bg-purple-500 border-2 border-white text-white font-bold pixel-button text-xs"
                            size="sm"
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            VIEW ACCOUNT
                          </Button>

                          {chain.id !== base.id && (
                            <Button
                              onClick={handleSwitchToBase}
                              className="w-full bg-orange-600 hover:bg-orange-500 border-2 border-white text-white font-bold pixel-button text-xs"
                              size="sm"
                            >
                              SWITCH TO BASE
                            </Button>
                          )}

                          <Button
                            onClick={openChainModal}
                            className="w-full bg-gray-600 hover:bg-gray-500 border-2 border-white text-white font-bold pixel-button text-xs"
                            size="sm"
                          >
                            CHANGE NETWORK
                          </Button>

                          <Button
                            onClick={() => {
                              disconnect()
                              setShowDropdown(false)
                            }}
                            className="w-full bg-red-600 hover:bg-red-500 border-2 border-white text-white font-bold pixel-button text-xs"
                            size="sm"
                          >
                            <Power className="w-3 h-3 mr-2" />
                            DISCONNECT
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Click outside to close dropdown */}
                  {showDropdown && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                      style={{ background: "transparent" }}
                    />
                  )}
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
