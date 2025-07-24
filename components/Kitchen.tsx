"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Package,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Trash2,
  Search,
} from "lucide-react"
import type { RawMaterial, WasteRecord } from "../types"

export default function Kitchen() {
  const {
    rawMaterials,
    setRawMaterials,
    suppliers,
    purchaseOrders,
    setPurchaseOrders,
    stockMovements,
    wasteRecords,
    setWasteRecords,
    updateRawMaterialStock,
  } = usePOS()

  const [activeTab, setActiveTab] = useState("inventory")
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [showRestock, setShowRestock] = useState(false)
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false)
  const [showWasteEntry, setShowWasteEntry] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [materialForm, setMaterialForm] = useState({
    name: "",
    category: "grains",
    unit: "kg",
    currentStock: "",
    minStock: "",
    maxStock: "",
    costPerUnit: "",
    supplier: "",
    location: "",
    description: "",
    expiryDate: "",
  })

  const [restockForm, setRestockForm] = useState({
    quantity: "",
    reason: "",
    batchNumber: "",
    expiryDate: "",
  })

  const [wasteForm, setWasteForm] = useState({
    materialId: "",
    quantity: "",
    reason: "expired",
    notes: "",
  })

  const categories = ["grains", "pulses", "vegetables", "spices", "dairy", "meat", "oils", "others"]
  const units = ["kg", "grams", "liters", "ml", "pieces", "packets"]
  const wasteReasons = ["expired", "damaged", "spillage", "overproduction", "other"]

  // Filter materials
  const filteredMaterials = rawMaterials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Analytics
  const lowStockItems = rawMaterials.filter((material) => material.currentStock <= material.minStock)
  const expiringItems = rawMaterials.filter(
    (material) =>
      material.expiryDate && new Date(material.expiryDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  )
  const totalInventoryValue = rawMaterials.reduce(
    (sum, material) => sum + material.currentStock * material.costPerUnit,
    0,
  )
  const totalWasteValue = wasteRecords.reduce((sum, record) => sum + record.cost, 0)

  const handleAddMaterial = () => {
    const newMaterial: RawMaterial = {
      id: Date.now().toString(),
      name: materialForm.name,
      category: materialForm.category as any,
      unit: materialForm.unit as any,
      currentStock: Number.parseFloat(materialForm.currentStock),
      minStock: Number.parseFloat(materialForm.minStock),
      maxStock: Number.parseFloat(materialForm.maxStock),
      costPerUnit: Number.parseFloat(materialForm.costPerUnit),
      supplier: materialForm.supplier,
      location: materialForm.location,
      description: materialForm.description,
      lastPurchased: new Date(),
      expiryDate: materialForm.expiryDate ? new Date(materialForm.expiryDate) : undefined,
    }

    setRawMaterials((prev) => [...prev, newMaterial])
    setShowAddMaterial(false)
    resetMaterialForm()
  }

  const handleRestock = () => {
    const quantity = Number.parseFloat(restockForm.quantity)
    if (quantity > 0) {
      updateRawMaterialStock(selectedMaterial, quantity, "purchase", restockForm.reason)

      // Update expiry date if provided
      if (restockForm.expiryDate) {
        setRawMaterials((prev) =>
          prev.map((material) =>
            material.id === selectedMaterial ? { ...material, expiryDate: new Date(restockForm.expiryDate) } : material,
          ),
        )
      }
    }
    setShowRestock(false)
    resetRestockForm()
  }

  const handleWasteEntry = () => {
    const material = rawMaterials.find((m) => m.id === wasteForm.materialId)
    if (!material) return

    const quantity = Number.parseFloat(wasteForm.quantity)
    const wasteRecord: WasteRecord = {
      id: Date.now().toString(),
      materialId: wasteForm.materialId,
      materialName: material.name,
      quantity,
      unit: material.unit,
      reason: wasteForm.reason as any,
      cost: quantity * material.costPerUnit,
      timestamp: new Date(),
      notes: wasteForm.notes,
    }

    setWasteRecords((prev) => [wasteRecord, ...prev])
    updateRawMaterialStock(wasteForm.materialId, -quantity, "waste", wasteForm.reason)
    setShowWasteEntry(false)
    resetWasteForm()
  }

  const resetMaterialForm = () => {
    setMaterialForm({
      name: "",
      category: "grains",
      unit: "kg",
      currentStock: "",
      minStock: "",
      maxStock: "",
      costPerUnit: "",
      supplier: "",
      location: "",
      description: "",
      expiryDate: "",
    })
  }

  const resetRestockForm = () => {
    setRestockForm({
      quantity: "",
      reason: "",
      batchNumber: "",
      expiryDate: "",
    })
  }

  const resetWasteForm = () => {
    setWasteForm({
      materialId: "",
      quantity: "",
      reason: "expired",
      notes: "",
    })
  }

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate)
    const days = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kitchen Management</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddMaterial(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
          <Button onClick={() => setShowWasteEntry(true)} variant="outline" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Record Waste
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Inventory Value</CardTitle>
            <TrendingUp className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs opacity-90 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Low Stock Items</CardTitle>
            <AlertTriangle className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs opacity-90 mt-1">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Expiring Soon</CardTitle>
            <Calendar className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringItems.length}</div>
            <p className="text-xs opacity-90 mt-1">Within 3 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Waste Value</CardTitle>
            <TrendingDown className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalWasteValue.toLocaleString()}</div>
            <p className="text-xs opacity-90 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="mb-6 space-y-3">
          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Low Stock Alert</span>
              </div>
              <div className="text-red-700 text-sm">
                {lowStockItems.length} items are running low: {lowStockItems.map((item) => item.name).join(", ")}
              </div>
            </div>
          )}

          {expiringItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Expiry Alert</span>
              </div>
              <div className="text-orange-700 text-sm">
                {expiringItems.length} items expiring soon: {expiringItems.map((item) => item.name).join(", ")}
              </div>
            </div>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Raw Materials
          </TabsTrigger>
          <TabsTrigger value="movements" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Stock Movements
          </TabsTrigger>
          <TabsTrigger value="waste" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Waste Tracking
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => {
              const isLowStock = material.currentStock <= material.minStock
              const daysUntilExpiry = getDaysUntilExpiry(material.expiryDate)
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3

              return (
                <Card
                  key={material.id}
                  className={`relative overflow-hidden ${isLowStock ? "border-red-300 bg-red-50" : isExpiringSoon ? "border-orange-300 bg-orange-50" : "border-gray-200"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{material.name}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {material.category}
                          </Badge>
                          {isLowStock && (
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                          {isExpiringSoon && <Badge className="text-xs bg-orange-500">Expiring</Badge>}
                        </div>
                      </div>
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Stock</span>
                        <div className={`font-semibold ${isLowStock ? "text-red-600" : "text-gray-900"}`}>
                          {material.currentStock} {material.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Min Stock</span>
                        <div className="font-semibold text-gray-900">
                          {material.minStock} {material.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Cost/Unit</span>
                        <div className="font-semibold text-gray-900">₹{material.costPerUnit}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Value</span>
                        <div className="font-semibold text-green-600">
                          ₹{(material.currentStock * material.costPerUnit).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {material.expiryDate && (
                      <div className="text-sm">
                        <span className="text-gray-600">Expires: </span>
                        <span className={`font-medium ${isExpiringSoon ? "text-orange-600" : "text-gray-900"}`}>
                          {(material.expiryDate instanceof Date
                            ? material.expiryDate
                            : new Date(material.expiryDate)
                          ).toLocaleDateString()}
                          {daysUntilExpiry !== null && (
                            <span className="ml-1">
                              ({daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{material.location}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMaterial(material.id)
                          setShowRestock(true)
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restock
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRawMaterialStock(material.id, -1, "usage", "Manual adjustment")}
                        className="px-3"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRawMaterialStock(material.id, 1, "adjustment", "Manual adjustment")}
                        className="px-3"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium">Material</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.slice(0, 20).map((movement) => (
                      <tr key={movement.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          <div>
                            {(movement.timestamp instanceof Date
                              ? movement.timestamp
                              : new Date(movement.timestamp)
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            {(movement.timestamp instanceof Date
                              ? movement.timestamp
                              : new Date(movement.timestamp)
                            ).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{movement.materialName}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              movement.type === "purchase"
                                ? "default"
                                : movement.type === "usage"
                                  ? "secondary"
                                  : movement.type === "waste"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {movement.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {movement.quantity} {movement.unit}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{movement.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Waste Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Material</th>
                      <th className="text-left py-3 px-4 font-medium">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium">Reason</th>
                      <th className="text-left py-3 px-4 font-medium">Cost</th>
                      <th className="text-left py-3 px-4 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {(record.timestamp instanceof Date
                            ? record.timestamp
                            : new Date(record.timestamp)
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-medium">{record.materialName}</td>
                        <td className="py-3 px-4">
                          {record.quantity} {record.unit}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="destructive">{record.reason}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium text-red-600">₹{record.cost}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryItems = rawMaterials.filter((m) => m.category === category)
                    const categoryValue = categoryItems.reduce(
                      (sum, item) => sum + item.currentStock * item.costPerUnit,
                      0,
                    )
                    const percentage = totalInventoryValue > 0 ? (categoryValue / totalInventoryValue) * 100 : 0

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{category}</span>
                          <span className="text-sm text-gray-600">₹{categoryValue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total inventory</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.map((supplier) => {
                    const supplierItems = rawMaterials.filter((m) => m.supplier === supplier.name)
                    const supplierValue = supplierItems.reduce(
                      (sum, item) => sum + item.currentStock * item.costPerUnit,
                      0,
                    )

                    return (
                      <div key={supplier.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-600">{supplierItems.length} items</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{supplierValue.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Rating: {supplier.rating}/5</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Material Modal */}
      <Dialog open={showAddMaterial} onOpenChange={setShowAddMaterial}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Raw Material</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Material Name</label>
              <Input
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                placeholder="Enter material name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={materialForm.category}
                onValueChange={(value) => setMaterialForm({ ...materialForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <Select
                value={materialForm.unit}
                onValueChange={(value) => setMaterialForm({ ...materialForm, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Stock</label>
              <Input
                type="number"
                value={materialForm.currentStock}
                onChange={(e) => setMaterialForm({ ...materialForm, currentStock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Stock</label>
              <Input
                type="number"
                value={materialForm.minStock}
                onChange={(e) => setMaterialForm({ ...materialForm, minStock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Stock</label>
              <Input
                type="number"
                value={materialForm.maxStock}
                onChange={(e) => setMaterialForm({ ...materialForm, maxStock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Unit (₹)</label>
              <Input
                type="number"
                value={materialForm.costPerUnit}
                onChange={(e) => setMaterialForm({ ...materialForm, costPerUnit: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Supplier</label>
              <Input
                value={materialForm.supplier}
                onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                placeholder="Supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Storage Location</label>
              <Input
                value={materialForm.location}
                onChange={(e) => setMaterialForm({ ...materialForm, location: e.target.value })}
                placeholder="Storage location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
              <Input
                type="date"
                value={materialForm.expiryDate}
                onChange={(e) => setMaterialForm({ ...materialForm, expiryDate: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <Input
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                placeholder="Material description"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddMaterial(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddMaterial} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restock Modal */}
      <Dialog open={showRestock} onOpenChange={setShowRestock}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Restock Material</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">{rawMaterials.find((m) => m.id === selectedMaterial)?.name}</h4>
                <p className="text-sm text-gray-600">
                  Current Stock: {rawMaterials.find((m) => m.id === selectedMaterial)?.currentStock}{" "}
                  {rawMaterials.find((m) => m.id === selectedMaterial)?.unit}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity to Add</label>
                <Input
                  type="number"
                  value={restockForm.quantity}
                  onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Input
                  value={restockForm.reason}
                  onChange={(e) => setRestockForm({ ...restockForm, reason: e.target.value })}
                  placeholder="Purchase order, transfer, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Expiry Date (Optional)</label>
                <Input
                  type="date"
                  value={restockForm.expiryDate}
                  onChange={(e) => setRestockForm({ ...restockForm, expiryDate: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRestock(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRestock} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Confirm Restock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Waste Entry Modal */}
      <Dialog open={showWasteEntry} onOpenChange={setShowWasteEntry}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Waste</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <Select
                value={wasteForm.materialId}
                onValueChange={(value) => setWasteForm({ ...wasteForm, materialId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {rawMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} ({material.currentStock} {material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity Wasted</label>
              <Input
                type="number"
                value={wasteForm.quantity}
                onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <Select value={wasteForm.reason} onValueChange={(value) => setWasteForm({ ...wasteForm, reason: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {wasteReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason.charAt(0).toUpperCase() + reason.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
              <Input
                value={wasteForm.notes}
                onChange={(e) => setWasteForm({ ...wasteForm, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowWasteEntry(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleWasteEntry} className="flex-1 bg-red-600 hover:bg-red-700">
                Record Waste
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
