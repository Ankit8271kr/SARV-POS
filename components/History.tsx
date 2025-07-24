"use client"

import { useState, useMemo } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Sale } from "../types"

export default function History() {
  const { sales } = usePOS()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [timeRange, setTimeRange] = useState("all")

  const now = new Date()
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const today = new Date().toDateString()

  const todaySales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = sale.timestamp instanceof Date ? sale.timestamp : new Date(sale.timestamp)
      return saleDate.toDateString() === today
    })
  }, [sales, today])

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  const filteredSales = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return sales.filter((sale) => {
      // Ensure timestamp is a Date object
      const saleDate = sale.timestamp instanceof Date ? sale.timestamp : new Date(sale.timestamp)

      const matchesSearch =
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerMobile.includes(searchTerm) ||
        sale.id.includes(searchTerm)
      const matchesStatus = filterStatus === "all" || sale.status === filterStatus
      const matchesPayment = filterPayment === "all" || sale.paymentMethod === filterPayment

      let matchesTimeRange = true

      switch (timeRange) {
        case "today":
          matchesTimeRange = saleDate >= today
          break
        case "yesterday":
          matchesTimeRange = saleDate >= yesterday && saleDate < today
          break
        case "week":
          matchesTimeRange = saleDate >= weekAgo
          break
        case "month":
          matchesTimeRange = saleDate >= monthAgo
          break
        default:
          matchesTimeRange = true
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesTimeRange
    })
  }, [sales, searchTerm, filterStatus, filterPayment, timeRange])

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDetails(true)
  }

  const printReceipt = (sale: Sale) => {
    const billContent = `
      SARV POS - RECEIPT
      ==================
      Date: ${(sale.timestamp instanceof Date ? sale.timestamp : new Date(sale.timestamp)).toLocaleDateString()}
      Time: ${(sale.timestamp instanceof Date ? sale.timestamp : new Date(sale.timestamp)).toLocaleTimeString()}
      Transaction ID: ${sale.id}
      
      Customer: ${sale.customerName || "Walk-in"}
      Mobile: ${sale.customerMobile || "N/A"}
      
      ITEMS:
      ${sale.items
        .map((item, index) => `${index + 1}. ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`)
        .join("\n")}
      
      ==================
      Total Items: ${sale.items.reduce((sum, item) => sum + item.quantity, 0)}
      Total Amount: ₹${sale.total}
      Payment Method: ${sale.paymentMethod.toUpperCase()}
      Amount Paid: ₹${sale.amountPaid}
      ${sale.change > 0 ? `Change: ₹${sale.change}` : ""}
      
      Thank you for your visit!
      ==================
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${sale.id}</title>
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">{todaySales.length}</div>
            <div className="text-sm text-gray-600">Today's Orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">₹{todayRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Today's Revenue</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">{sales.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by customer, mobile, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Items</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Payment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{sale.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {(sale.timestamp instanceof Date
                          ? sale.timestamp
                          : new Date(sale.timestamp)
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(sale.timestamp instanceof Date
                          ? sale.timestamp
                          : new Date(sale.timestamp)
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{sale.customerName || "Walk-in"}</div>
                      <div className="text-sm text-gray-600">{sale.customerMobile || "N/A"}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {sale.items.length} items
                      <div className="text-gray-600">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} qty
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{sale.total}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        sale.paymentMethod === "cash" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {sale.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        sale.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : sale.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => viewSaleDetails(sale)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => printReceipt(sale)}>
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedSale?.id}</DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p>
                  <strong>Name:</strong> {selectedSale.customerName || "Walk-in"}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedSale.customerMobile || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {(selectedSale.timestamp instanceof Date
                    ? selectedSale.timestamp
                    : new Date(selectedSale.timestamp)
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {(selectedSale.timestamp instanceof Date
                    ? selectedSale.timestamp
                    : new Date(selectedSale.timestamp)
                  ).toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedSale.items.map((item, index) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {index + 1}. {item.name} x{item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Payment Details</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">₹{selectedSale.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{selectedSale.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span>₹{selectedSale.amountPaid}</span>
                  </div>
                  {selectedSale.change > 0 && (
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span>₹{selectedSale.change}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={() => printReceipt(selectedSale)} className="w-full flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
