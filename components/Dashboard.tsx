"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, Minus, Plus } from "lucide-react"
import PaymentModal from "./PaymentModal"

export default function Dashboard() {
  const { products, cartItems, addToCart, updateCartQuantity, clearCart } = usePOS()
  const [searchTerm, setSearchTerm] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const todaysSales = 54256 // This would come from actual sales data

  const handleProceedToPay = () => {
    if (cartItems.length === 0) return
    setShowPayment(true)
  }

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Products Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-100 border-blue-200 rounded-xl"
              />
            </div>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-2">
              <span className="text-gray-500 text-sm">Today's Sales</span>
              <div className="text-xl font-bold">₹ {todaysSales.toLocaleString()}</div>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              Category <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-blue-100 rounded-lg p-4 cursor-pointer hover:bg-blue-200 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-1">₹ {product.price}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
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
            <div className="space-y-3 max-h-60 overflow-y-auto">
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
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
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

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleProceedToPay}
              disabled={cartItems.length === 0}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg"
            >
              Proceed to Pay
            </Button>
            <Button onClick={clearCart} variant="outline" className="w-full bg-transparent">
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          cartItems={cartItems}
          totalAmount={totalCost}
          customerName={customerName}
          customerMobile={customerMobile}
          onPaymentComplete={() => {
            clearCart()
            setCustomerName("")
            setCustomerMobile("")
            setShowPayment(false)
          }}
        />
      )}
    </div>
  )
}
