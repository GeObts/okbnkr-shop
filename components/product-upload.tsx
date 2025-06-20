"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, DollarSign, Coins } from "lucide-react"

interface ProductUploadProps {
  category: string
  onProductAdd: (product: any) => void
}

export function ProductUpload({ category, onProductAdd }: ProductUploadProps) {
  const [productData, setProductData] = useState({
    nameEn: "",
    nameJp: "",
    description: "",
    priceUSD: "",
    priceETH: "",
    image: null as File | null,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProductAdd({
      ...productData,
      category,
      id: Date.now().toString(),
    })
    // Reset form
    setProductData({
      nameEn: "",
      nameJp: "",
      description: "",
      priceUSD: "",
      priceETH: "",
      image: null,
    })
  }

  return (
    <Card className="bg-gray-900 border-4 border-yellow-400">
      <CardHeader>
        <CardTitle className="font-anton text-2xl text-yellow-400 text-center">
          ADD {category.toUpperCase()} PRODUCT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">English Name</label>
              <Input
                value={productData.nameEn}
                onChange={(e) => setProductData((prev) => ({ ...prev, nameEn: e.target.value }))}
                className="bg-black border-2 border-green-400 text-green-400"
                placeholder="Product name in English"
              />
            </div>
            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block">Japanese Name</label>
              <Input
                value={productData.nameJp}
                onChange={(e) => setProductData((prev) => ({ ...prev, nameJp: e.target.value }))}
                className="bg-black border-2 border-green-400 text-green-400 font-klee"
                placeholder="日本語の商品名"
              />
            </div>
          </div>

          <div>
            <label className="text-green-400 font-mono text-sm mb-2 block">Description</label>
            <Textarea
              value={productData.description}
              onChange={(e) => setProductData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-black border-2 border-green-400 text-green-400"
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                USD Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={productData.priceUSD}
                onChange={(e) => setProductData((prev) => ({ ...prev, priceUSD: e.target.value }))}
                className="bg-black border-2 border-green-400 text-green-400"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
                <Coins className="w-4 h-4 mr-1" />
                ETH Price
              </label>
              <Input
                type="number"
                step="0.001"
                value={productData.priceETH}
                onChange={(e) => setProductData((prev) => ({ ...prev, priceETH: e.target.value }))}
                className="bg-black border-2 border-green-400 text-green-400"
                placeholder="0.000"
              />
            </div>
          </div>

          <div>
            <label className="text-green-400 font-mono text-sm mb-2 block flex items-center">
              <ImageIcon className="w-4 h-4 mr-1" />
              Product Image
            </label>
            <div className="border-2 border-dashed border-green-400 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-green-400 font-mono">
                  {productData.image ? productData.image.name : "Click to upload image"}
                </div>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 border-2 border-white text-white font-bold pixel-button"
          >
            <Upload className="w-4 h-4 mr-2" />
            ADD PRODUCT TO {category.toUpperCase()}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
