"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SmartWalletContextType {
  isConnected: boolean
  userProfile: UserProfile | null
  connectWallet: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => void
}

interface UserProfile {
  email: string
  phone: string
  name: string
  address: string
  walletAddress: string
  verified: boolean
}

const SmartWalletContext = createContext<SmartWalletContextType | undefined>(undefined)

export function SmartWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const connectWallet = async () => {
    // Simulate wallet connection with Base Onchain Kit
    try {
      // In a real implementation, this would integrate with Base Onchain Kit
      setIsConnected(true)
      console.log("Wallet connected via Base Onchain Kit")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => (prev ? { ...prev, ...profile } : null))
  }

  return (
    <SmartWalletContext.Provider
      value={{
        isConnected,
        userProfile,
        connectWallet,
        updateProfile,
      }}
    >
      {children}
    </SmartWalletContext.Provider>
  )
}

export function useSmartWallet() {
  const context = useContext(SmartWalletContext)
  if (context === undefined) {
    throw new Error("useSmartWallet must be used within a SmartWalletProvider")
  }
  return context
}
