"use client"

import { OnchainKitProvider } from "@coinbase/onchainkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"
import { WagmiProvider, createConfig, http } from "wagmi"
import { coinbaseWallet } from "wagmi/connectors"
import type { ReactNode } from "react"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "OK$BANKR SHOP",
      appLogoUrl: "https://example.com/logo.png",
      preference: "smartWalletOnly",
      version: "4",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  )
}
