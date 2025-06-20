"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Monitor, Shirt, Crown, ImageIcon, Zap, DollarSign } from "lucide-react"
import { useAccount } from "wagmi"
import Image from "next/image"
import { SmartWalletProfileModal } from "@/components/smart-wallet-profile-modal"
import { CheckoutModal } from "@/components/checkout-modal"
import { CryptoTicker } from "@/components/crypto-ticker"
import { WalletConnectButton } from "@/components/wallet-connect-button"

interface Product {
  id: string
  name: string
  nameJp: string
  price: number
  priceUSDC: number
  category: string
  image?: string
}

export default function OKBANKRShop() {
  const { address, isConnected } = useAccount()
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Sample products
  const sampleProducts: Product[] = [
    // TEES
    {
      id: "1",
      name: "BANKR Embroidered Tee",
      nameJp: "バンカー刺繍Tシャツ",
      price: 29.99,
      priceUSDC: 29.99,
      category: "tees",
      image: "/images/tee-smiley.png",
    },
    {
      id: "2",
      name: "Embroidered Puter Tee",
      nameJp: "刺繍プーターTシャツ",
      price: 29.99,
      priceUSDC: 29.99,
      category: "tees",
      image: "/images/tee-computer.png",
    },
    {
      id: "3",
      name: "Customized",
      nameJp: "カスタマイズ",
      price: 34.99,
      priceUSDC: 34.99,
      category: "tees",
    },

    // HATS (reduced to 3)
    {
      id: "4",
      name: "5-Panel",
      nameJp: "5パネル",
      price: 25.0,
      priceUSDC: 25.0,
      category: "hats",
    },
    {
      id: "5",
      name: "Fisherman Beanie",
      nameJp: "フィッシャーマンビーニー",
      price: 25.0,
      priceUSDC: 25.0,
      category: "hats",
    },
    {
      id: "6",
      name: "Trucker",
      nameJp: "トラッカー",
      price: 25.0,
      priceUSDC: 25.0,
      category: "hats",
    },

    // POSTERS (no pricing, generic titles)
    {
      id: "7",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
    {
      id: "8",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
    {
      id: "9",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
    {
      id: "10",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
    {
      id: "11",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
    {
      id: "12",
      name: "POSTER",
      nameJp: "ポスター",
      price: 0,
      priceUSDC: 0,
      category: "posters",
    },
  ]

  const handleBuyNow = (product: Product) => {
    if (!isConnected) {
      alert("Please connect your wallet first!")
      return
    }

    setSelectedProduct(product)

    // Check if user has profile
    if (!userProfile) {
      setShowProfileModal(true)
    } else {
      setShowCheckoutModal(true)
    }
  }

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product])
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="bg-yellow-400 border-4 border-black hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <CardContent className="p-4">
        <div className="aspect-square bg-black border-2 border-black rounded-none mb-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 opacity-20"></div>

          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover pixelated"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <>
              <div className="text-yellow-400 text-lg font-bold text-center pixel-text mb-2">{product.name}</div>
              <div className="text-yellow-400 text-sm font-klee text-center mb-4">{product.nameJp}</div>
              <Monitor className="w-8 h-8 text-yellow-400" />
            </>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className="text-black font-bold text-sm">{product.name}</div>
            <div className="text-black text-xs font-klee">{product.nameJp}</div>
          </div>

          <div className="text-center">
            {product.category !== "posters" && (
              <div className="text-black font-bold text-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
                {product.priceUSDC} USDC
              </div>
            )}
          </div>

          <div className="space-y-2">
            {product.category !== "posters" ? (
              <>
                <Button
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-black hover:bg-gray-800 border-2 border-black text-yellow-400 font-bold pixel-button"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  BUY NOW
                </Button>

                <Button
                  onClick={() => addToCart(product)}
                  variant="outline"
                  className="w-full bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-bold pixel-button"
                  size="sm"
                >
                  ADD TO CART
                </Button>
              </>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-600 border-2 border-black text-gray-400 font-bold pixel-button cursor-not-allowed"
                size="sm"
              >
                COMING SOON
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CategorySection = ({
    japaneseTitle,
    englishTitle,
    icon: Icon,
    products,
  }: {
    japaneseTitle: string
    englishTitle: string
    icon: any
    products: Product[]
  }) => (
    <section className="mb-16">
      <div className="bg-yellow-400 border-4 border-black p-6 mb-8 relative grid-bg">
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-2">
            <Icon className="w-8 h-8 text-black mr-4" />
            <div className="font-klee text-4xl font-bold text-white pixel-shadow-heavy">{japaneseTitle}</div>
            <Icon className="w-8 h-8 text-black ml-4" />
          </div>
          <div className="font-anton text-6xl font-bold text-black tracking-wider">{englishTitle}</div>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          englishTitle === "TEES"
            ? "grid-cols-1 md:grid-cols-3"
            : englishTitle === "HATS"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Header */}
      <header className="relative bg-yellow-400 p-4 border-4 border-black grid-bg">
        {/* Main title section - centered */}
        <div className="text-center">
          <h1 className="font-klee text-white text-4xl md:text-6xl font-bold pixel-shadow-heavy">
            オーケー バンカー ショップ
          </h1>
          <h2 className="font-anton text-black text-3xl md:text-5xl font-bold tracking-wider">OK$BANKR SHOP</h2>
        </div>

        {/* Wallet and Cart buttons - top right */}
        <div className="absolute top-4 right-4 flex gap-3">
          <WalletConnectButton />

          <Button className="bg-black text-yellow-400 px-4 py-2 border-2 border-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 pixel-button relative">
            <ShoppingCart className="w-4 h-4" />
            CART
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-black">
                {cartItems.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Side text */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-black font-bold text-sm pixel-text">
          ON BASE
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90 text-black font-bold text-sm pixel-text">
          OK COMPUTERS
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center space-x-8">
            <a
              href="#tees"
              className="text-yellow-400 hover:text-white font-bold pixel-text border-2 border-transparent hover:border-yellow-400 px-4 py-2 transition-all"
            >
              Tシャツ / TEES
            </a>
            <a
              href="#hats"
              className="text-yellow-400 hover:text-white font-bold pixel-text border-2 border-transparent hover:border-yellow-400 px-4 py-2 transition-all"
            >
              ハット / HATS
            </a>
            <a
              href="#posters"
              className="text-yellow-400 hover:text-white font-bold pixel-text border-2 border-transparent hover:border-yellow-400 px-4 py-2 transition-all"
            >
              ポスター / POSTERS
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 bg-yellow-400">
        {/* Product Categories */}
        <div id="tees">
          <CategorySection
            japaneseTitle="Tシャツ"
            englishTitle="TEES"
            icon={Shirt}
            products={sampleProducts.filter((p) => p.category === "tees")}
          />
        </div>

        <div id="hats">
          <CategorySection
            japaneseTitle="ハット"
            englishTitle="HATS"
            icon={Crown}
            products={sampleProducts.filter((p) => p.category === "hats")}
          />
        </div>

        <div id="posters">
          <CategorySection
            japaneseTitle="ポスター"
            englishTitle="POSTERS"
            icon={ImageIcon}
            products={sampleProducts.filter((p) => p.category === "posters")}
          />
        </div>
      </main>

      {/* Footer with Crypto Ticker */}
      <footer className="bg-black border-t-4 border-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-yellow-400 font-bold text-lg pixel-text">BASE</div>
            </div>
            <div className="text-center">
              <div className="font-klee text-2xl text-yellow-400 mb-2">オーケー バンカー ショップ</div>
              <div className="font-anton text-3xl text-yellow-400">OK$BANKR SHOP</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-yellow-400 font-bold text-lg pixel-text">POWERED BY</div>
              <div className="bg-yellow-400 text-black px-3 py-1 font-bold pixel-text border-2 border-black">BANKR</div>
            </div>
          </div>

          {/* Privacy Policy and Copyright */}
          <div className="text-center mb-4">
            <div className="flex justify-center items-center space-x-4 mb-2">
              <a
                href="/privacy"
                className="text-yellow-400 hover:text-white font-bold pixel-text border-2 border-transparent hover:border-yellow-400 px-4 py-2 transition-all"
              >
                PRIVACY POLICY
              </a>
              <span className="text-yellow-400">|</span>
              <span className="text-yellow-400 font-mono text-sm">© 2024 OK$BANKR SHOP</span>
            </div>
          </div>

          {/* Live Crypto Ticker */}
          <CryptoTicker />
        </div>
      </footer>

      {/* Modals */}
      <SmartWalletProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileComplete={(profile) => {
          setUserProfile(profile)
          setShowProfileModal(false)
          if (selectedProduct) {
            setShowCheckoutModal(true)
          }
        }}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        product={selectedProduct}
        userProfile={userProfile}
      />
    </div>
  )
}
