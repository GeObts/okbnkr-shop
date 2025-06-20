"use client"

import { OnchainKitProvider } from "@coinbase/onchainkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, getDefaultConfig, connectorsForWallets } from "@rainbow-me/rainbowkit"
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { base, baseSepolia } from "wagmi/chains"
import type { ReactNode } from "react"

const queryClient = new QueryClient()

// Configure wallet connectors
const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet, rainbowWallet],
    },
    {
      groupName: "More Options",
      wallets: [trustWallet, ledgerWallet, phantomWallet, injectedWallet],
    },
  ],
  {
    appName: "OK$BANKR SHOP",
    projectId: "5a7733b3bfb91a62c18adcb839e7299e", // WalletConnect Project ID
  },
)

// Configure wagmi with RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: "OK$BANKR SHOP",
  projectId: "5a7733b3bfb91a62c18adcb839e7299e",
  chains: [base, baseSepolia],
  connectors,
  ssr: true,
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: {
              colors: {
                accentColor: "#FFFF00", // Yellow accent to match theme
                accentColorForeground: "#000000", // Black text on yellow
                actionButtonBorder: "#000000",
                actionButtonBorderMobile: "#000000",
                actionButtonSecondaryBackground: "#000000",
                closeButton: "#000000",
                closeButtonBackground: "#FFFF00",
                connectButtonBackground: "#000000",
                connectButtonBackgroundError: "#FF0000",
                connectButtonInnerBackground: "#FFFF00",
                connectButtonText: "#FFFF00",
                connectButtonTextError: "#FFFFFF",
                connectionIndicator: "#00FF00",
                downloadBottomCardBackground: "#000000",
                downloadTopCardBackground: "#FFFF00",
                error: "#FF0000",
                generalBorder: "#FFFF00",
                generalBorderDim: "#888800",
                menuItemBackground: "#000000",
                modalBackdrop: "rgba(0, 0, 0, 0.8)",
                modalBackground: "#000000",
                modalBorder: "#FFFF00",
                modalText: "#FFFF00",
                modalTextDim: "#CCCC00",
                modalTextSecondary: "#00FF00",
                profileAction: "#FFFF00",
                profileActionHover: "#CCCC00",
                profileForeground: "#000000",
                selectedOptionBorder: "#00FF00",
                standby: "#888888",
              },
              fonts: {
                body: "Courier New, monospace",
              },
              radii: {
                actionButton: "0px",
                connectButton: "0px",
                menuButton: "0px",
                modal: "0px",
                modalMobile: "0px",
              },
              shadows: {
                connectButton: "4px 4px 0px rgba(0, 0, 0, 1)",
                dialog: "8px 8px 0px rgba(0, 0, 0, 1)",
                profileDetailsAction: "2px 2px 0px rgba(0, 0, 0, 1)",
                selectedOption: "2px 2px 0px rgba(0, 255, 0, 1)",
                selectedWallet: "4px 4px 0px rgba(255, 255, 0, 1)",
                walletLogo: "2px 2px 0px rgba(0, 0, 0, 1)",
              },
            },
            darkMode: {
              colors: {
                accentColor: "#FFFF00",
                accentColorForeground: "#000000",
                actionButtonBorder: "#FFFF00",
                actionButtonBorderMobile: "#FFFF00",
                actionButtonSecondaryBackground: "#000000",
                closeButton: "#FFFF00",
                closeButtonBackground: "#000000",
                connectButtonBackground: "#000000",
                connectButtonBackgroundError: "#FF0000",
                connectButtonInnerBackground: "#FFFF00",
                connectButtonText: "#FFFF00",
                connectButtonTextError: "#FFFFFF",
                connectionIndicator: "#00FF00",
                downloadBottomCardBackground: "#000000",
                downloadTopCardBackground: "#FFFF00",
                error: "#FF0000",
                generalBorder: "#FFFF00",
                generalBorderDim: "#888800",
                menuItemBackground: "#000000",
                modalBackdrop: "rgba(0, 0, 0, 0.9)",
                modalBackground: "#000000",
                modalBorder: "#FFFF00",
                modalText: "#FFFF00",
                modalTextDim: "#CCCC00",
                modalTextSecondary: "#00FF00",
                profileAction: "#FFFF00",
                profileActionHover: "#CCCC00",
                profileForeground: "#000000",
                selectedOptionBorder: "#00FF00",
                standby: "#888888",
              },
              fonts: {
                body: "Courier New, monospace",
              },
              radii: {
                actionButton: "0px",
                connectButton: "0px",
                menuButton: "0px",
                modal: "0px",
                modalMobile: "0px",
              },
              shadows: {
                connectButton: "4px 4px 0px rgba(255, 255, 0, 1)",
                dialog: "8px 8px 0px rgba(255, 255, 0, 1)",
                profileDetailsAction: "2px 2px 0px rgba(255, 255, 0, 1)",
                selectedOption: "2px 2px 0px rgba(0, 255, 0, 1)",
                selectedWallet: "4px 4px 0px rgba(255, 255, 0, 1)",
                walletLogo: "2px 2px 0px rgba(255, 255, 0, 1)",
              },
            },
          }}
          modalSize="compact"
          initialChain={base}
          showRecentTransactions={true}
        >
          <OnchainKitProvider
            chain={base}
            config={{
              appearance: {
                mode: "auto",
                theme: "default",
              },
            }}
          >
            {children}
          </OnchainKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
