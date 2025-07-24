"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Grid3X3, Package, Star, Clock, FileText, Search, Menu, Minus, Plus } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Product {
  id: string
  name: string
  price: number
}

export default function Component() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", name: "Iced Coffee", price: 50, quantity: 2 },
    { id: "2", name: "Salads", price: 30, quantity: 1 },
  ])

  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [cashAmount, setCashAmount] = useState("130")

  const products: Product[] = [
    { id: "1", name: "Paneer Tikka", price: 100 },
    { id: "2", name: "Samosa", price: 10 },
    { id: "3", name: "Manchurian", price: 60 },
    { id: "4", name: "Pastries", price: 25 },
    { id: "5", name: "Sandwiches", price: 40 },
    { id: "6", name: "Salads", price: 30 },
    { id: "7", name: "Soups", price: 50 },
    { id: "8", name: "Pizza", price: 80 },
    { id: "9", name: "Iced Coffee", price: 50 },
    { id: "10", name: "beans", price: 100 },
    { id: "11", name: "Donuts", price: 80 },
  ]

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-400 to-purple-400 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">SARV POS</h1>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <span className="text-black font-semibold">Admin</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-32 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center gap-2 p-3 bg-blue-100 rounded-lg">
              <Grid3X3 className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Dashboard</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Package className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Products</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Star className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Kitchen</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Clock className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">History</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
              <FileText className="w-6 h-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Report</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Products Section */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search Item" className="pl-10 bg-blue-100 border-blue-200 rounded-xl" />
                </div>
                <div className="bg-white border border-gray-300 rounded-lg px-4 py-2">
                  <span className="text-gray-500 text-sm">Today's Sales</span>
                  <div className="text-xl font-bold">₹ 54256</div>
                </div>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  Category <Menu className="w-4 h-4" />
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-blue-100 rounded-lg p-4 cursor-pointer hover:bg-blue-200 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-gray-900">₹ {product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div className="w-80 bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Cart</h2>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Customer Name</label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Customer Mobile</label>
                  <Input
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium">
                          {index + 1}. {item.name}
                        </span>
                        <span className="text-gray-600 ml-2">
                          — {item.price}*{item.quantity} = {item.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total Item</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total Cost</span>
                  <span className="font-semibold">₹ {totalCost}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-4">
                <div>
                  <label className="font-semibold block mb-2">Cash</label>
                  <Input
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="text-right border-gray-300"
                  />
                </div>
                <div>
                  <span className="font-semibold">UPI</span>
                </div>
                <Button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg">
                  Proceed to pay
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
