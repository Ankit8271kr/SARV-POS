"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, Smartphone, Printer, CheckCircle } from "lucide-react"
import type { CartItem, Sale } from "../types"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  totalAmount: number
  customerName: string
  customerMobile: string
  onPaymentComplete: () => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  customerName,
  customerMobile,
  onPaymentComplete,
}: PaymentModalProps) {
  const { addSale } = usePOS()
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash")
  const [cashAmount, setCashAmount] = useState(totalAmount.toString())
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [currentSale, setCurrentSale] = useState<Sale | null>(null)

  const change = paymentMethod === "cash" ? Math.max(0, Number.parseFloat(cashAmount) - totalAmount) : 0
  const isValidPayment = paymentMethod === "cash" ? Number.parseFloat(cashAmount) >= totalAmount : upiId.length > 0

  const handlePayment = async () => {
    if (!isValidPayment) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const sale: Sale = {
      id: Date.now().toString(),
      items: cartItems,
      total: totalAmount,
      customerName,
      customerMobile,
      paymentMethod,
      amountPaid: paymentMethod === "cash" ? Number.parseFloat(cashAmount) : totalAmount,
      change,
      timestamp: new Date(),
      status: "completed",
    }

    addSale(sale)
    setCurrentSale(sale)
    setIsProcessing(false)
    setPaymentComplete(true)
  }

  const handlePrintBill = () => {
    if (!currentSale) return

    const billContent = `
      SARV POS - RECEIPT
      ==================
      Date: ${currentSale.timestamp.toLocaleDateString()}
      Time: ${currentSale.timestamp.toLocaleTimeString()}
      
      Customer: ${currentSale.customerName || "Walk-in"}
      Mobile: ${currentSale.customerMobile || "N/A"}
      
      ITEMS:
      ${currentSale.items
        .map((item, index) => `${index + 1}. ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`)
        .join("\n")}
      
      ==================
      Total Items: ${currentSale.items.reduce((sum, item) => sum + item.quantity, 0)}
      Total Amount: ₹${currentSale.total}
      Payment Method: ${currentSale.paymentMethod.toUpperCase()}
      Amount Paid: ₹${currentSale.amountPaid}
      ${currentSale.change > 0 ? `Change: ₹${currentSale.change}` : ""}
      
      Thank you for your visit!
      ==================
    `

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; white-space: pre-line; padding: 20px; }
            </style>
          </head>
          <body>${billContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleComplete = () => {
    onPaymentComplete()
    onClose()
  }

  if (paymentComplete && currentSale) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Payment Successful!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Transaction Details</h3>
              <p>Amount: ₹{currentSale.total}</p>
              <p>Payment Method: {currentSale.paymentMethod.toUpperCase()}</p>
              {currentSale.change > 0 && <p>Change: ₹{currentSale.change}</p>}
              <p>Transaction ID: {currentSale.id}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePrintBill}
                className="flex-1 flex items-center gap-2 bg-transparent"
                variant="outline"
              >
                <Printer className="w-4 h-4" />
                Print Bill
              </Button>
              <Button onClick={handleComplete} className="flex-1 bg-green-600 hover:bg-green-700">
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment - ₹{totalAmount}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === "cash" ? "default" : "outline"}
              onClick={() => setPaymentMethod("cash")}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Cash
            </Button>
            <Button
              variant={paymentMethod === "upi" ? "default" : "outline"}
              onClick={() => setPaymentMethod("upi")}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              UPI
            </Button>
          </div>

          {/* Payment Details */}
          {paymentMethod === "cash" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Cash Amount</label>
                <Input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="text-right"
                />
              </div>
              {change > 0 && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Change to return: ₹{change}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">UPI ID</label>
                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID" />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">Scan QR code or enter UPI ID to pay ₹{totalAmount}</p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              {cartItems.map((item, index) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-1 font-medium flex justify-between">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!isValidPayment || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
