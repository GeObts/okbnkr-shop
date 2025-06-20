import type React from "react"
import type { Metadata } from "next"
import { Klee_One, Anton } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { ErrorBoundary } from "@/components/error-boundary"

const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-klee-one",
})

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
})

export const metadata: Metadata = {
  title: "OK$BANKR SHOP - オーケー バンカー ショップ",
  description: "Retro-futuristic e-commerce with crypto payments and Smart Wallet integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${kleeOne.variable} ${anton.variable}`}>
      <body className="bg-black text-white font-mono">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
