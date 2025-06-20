"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
}

export function CryptoTicker() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
    { symbol: "BTC", price: 43250.0, change24h: 2.5 },
    { symbol: "ETH", price: 2580.0, change24h: -1.2 },
    { symbol: "BASE", price: 1.85, change24h: 5.8 },
    { symbol: "USDC", price: 1.0, change24h: 0.1 },
    { symbol: "DOGE", price: 0.085, change24h: 12.3 },
  ])

  useEffect(() => {
    // Simulate live price updates
    const interval = setInterval(() => {
      setCryptoPrices((prev) =>
        prev.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: crypto.change24h + (Math.random() - 0.5) * 2,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="overflow-hidden bg-black border-2 border-yellow-400 p-2">
      <div className="flex items-center space-x-2 mb-2">
        <TrendingUp className="w-4 h-4 text-green-400" />
        <span className="text-yellow-400 font-bold text-sm pixel-text">LIVE CRYPTO PRICES</span>
      </div>

      <div className="animate-scroll-crypto flex space-x-8 whitespace-nowrap">
        {cryptoPrices.concat(cryptoPrices).map((crypto, index) => (
          <div
            key={`${crypto.symbol}-${index}`}
            className="flex items-center space-x-2 text-yellow-400 font-mono text-sm"
          >
            <span className="font-bold">{crypto.symbol}</span>
            <span>${crypto.price.toFixed(crypto.symbol === "BTC" ? 0 : crypto.symbol === "ETH" ? 0 : 3)}</span>
            <span className={`flex items-center ${crypto.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
              {crypto.change24h >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(crypto.change24h).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
