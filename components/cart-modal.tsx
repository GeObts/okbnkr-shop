"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, Plus, Minus, Trash2, Zap } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-anton text-2xl text-center flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 mr-2" />
              SHOPPING CART
            </DialogTitle>
          </DialogHeader>

          <Card className="bg-gray-900 border-2 border-yellow-400">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-yellow-400 font-bold text-xl mb-2 pixel-text">CART IS EMPTY</h3>
              <p className="text-green-400 font-mono mb-6">No items yet 😎</p>
              <Button
                onClick={onClose}
                className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-bold pixel-button"
              >
                CONTINUE SHOPPING
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-4 border-yellow-400 text-yellow-400 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-anton text-2xl text-center flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 mr-2" />
            SHOPPING CART ({state.totalItems} ITEMS)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {state.items.map((item) => (
            <Card key={item.id} className="bg-gray-900 border-2 border-green-400">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-black border-2 border-yellow-400 rounded-none flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover pixelated"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <ShoppingCart className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm">{item.name}</h4>
                    <p className="text-gray-400 text-xs font-klee">{item.nameJp}</p>
                    <p className="text-green-400 font-bold">${item.priceUSDC} USDC</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-red-600 hover:bg-red-500 border-2 border-white text-white font-bold pixel-button p-0"
                      size="sm"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="text-white font-bold text-lg w-8 text-center">{item.quantity}</span>

                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-green-600 hover:bg-green-500 border-2 border-white text-white font-bold pixel-button p-0"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-gray-600 hover:bg-gray-500 border-2 border-white text-white font-bold pixel-button p-0 ml-2"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <Card className="bg-yellow-400 border-4 border-black">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-black font-bold text-lg">TOTAL:</span>
              <span className="text-black font-bold text-xl">${state.totalPrice.toFixed(2)} USDC</span>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={clearCart}
                className="flex-1 bg-red-600 hover:bg-red-500 border-2 border-black text-white font-bold pixel-button"
              >
                CLEAR CART
              </Button>

              <Button
                onClick={onCheckout}
                className="flex-1 bg-green-600 hover:bg-green-500 border-2 border-black text-white font-bold pixel-button"
              >
                <Zap className="w-4 h-4 mr-2" />
                CHECKOUT
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
