"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, Smartphone, Globe, Shield, Zap, ExternalLink } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface WalletSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletSelectorModal({ isOpen, onClose }: WalletSelectorModalProps) {
  const walletFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "MetaMask",
      description: "Most popular Ethereum wallet",
      features: ["Browser extension", "Mobile app", "Hardware wallet support"],
      color: "orange",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Coinbase Wallet",
      description: "Easy-to-use wallet from Coinbase",
      features: ["Smart Wallet support", "Built-in DeFi", "Mobile & desktop"],
      color: "blue",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "WalletConnect",
      description: "Connect any mobile wallet",
      features: ["200+ wallets", "QR code connection", "Cross-platform"],
      color: "purple",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Rainbow",
      description: "Beautiful Ethereum wallet",
      features: ["iOS & Android", "NFT gallery", "DeFi integration"],
      color: "pink",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-anton text-3xl text-center">CHOOSE YOUR WALLET</DialogTitle>
          <div className="text-center text-green-400 font-mono">
            Connect your preferred wallet to start shopping with crypto
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* RainbowKit Connect Button */}
          <Card className="bg-yellow-400 border-4 border-black">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Wallet className="w-12 h-12 text-black mx-auto mb-2" />
                <h3 className="text-black font-bold text-xl pixel-text">QUICK CONNECT</h3>
                <p className="text-black text-sm">Choose from all available wallets</p>
              </div>

              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={() => {
                      openConnectModal()
                      onClose()
                    }}
                    className="bg-black hover:bg-gray-800 border-4 border-black text-yellow-400 font-bold pixel-button text-lg px-8 py-4"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    CONNECT WALLET
                  </Button>
                )}
              </ConnectButton.Custom>
            </CardContent>
          </Card>

          {/* Wallet Information Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {walletFeatures.map((wallet, index) => (
              <Card key={index} className="bg-gray-900 border-2 border-green-400">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <div className={`text-${wallet.color}-400 mr-3`}>{wallet.icon}</div>
                    <div>
                      <div className="font-bold">{wallet.title}</div>
                      <div className="text-sm font-normal text-gray-400">{wallet.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {wallet.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-white text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Notice */}
          <Card className="bg-blue-900 border-2 border-blue-400">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-bold mb-2">SECURITY NOTICE</h4>
                  <div className="text-white text-sm space-y-1">
                    <div>• Only connect wallets you trust and control</div>
                    <div>• Never share your seed phrase or private keys</div>
                    <div>• Always verify you're on the correct website</div>
                    <div>• We only support Base network for payments</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Links */}
          <div className="text-center space-y-2">
            <div className="text-yellow-400 font-bold text-sm">NEED HELP?</div>
            <div className="flex justify-center space-x-4 text-xs">
              <a
                href="https://ethereum.org/en/wallets/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                Learn about wallets <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a
                href="https://base.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                About Base network <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
