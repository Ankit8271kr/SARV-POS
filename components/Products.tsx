"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import type { Product } from "../types"

export default function Products() {
  const { products, setProducts } = usePOS()
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    kitchenStock: "",
    cost: "",
    description: "",
  })

  const categories = ["Main Course", "Snacks", "Beverages", "Desserts", "Healthy"]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      kitchenStock: "",
      cost: "",
      description: "",
    })
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    resetForm()
    setShowAddProduct(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      kitchenStock: product.kitchenStock.toString(),
      cost: product.cost.toString(),
      description: product.description || "",
    })
    setShowAddProduct(true)
  }

  const handleSaveProduct = () => {
    const productData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      kitchenStock: Number.parseInt(formData.kitchenStock),
      cost: Number.parseFloat(formData.cost),
      description: formData.description,
    }

    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData,
      }
      setProducts([...products, newProduct])
    }

    setShowAddProduct(false)
    resetForm()
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  const updateStock = (productId: string, newStock: number) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p)))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">{products.filter((p) => p.stock < 10).length}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold">
              ₹{products.reduce((sum, p) => sum + p.stock * p.cost, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Inventory Value</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Cost</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Kitchen Stock</th>
                <th className="px-4 py-3 text-left font-medium">Profit</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && <div className="text-sm text-gray-600">{product.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{product.category}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{product.price}</td>
                  <td className="px-4 py-3">₹{product.cost}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(product.id, product.stock - 1)}
                        className="w-6 h-6 p-0"
                      >
                        -
                      </Button>
                      <span className={`w-12 text-center ${product.stock < 10 ? "text-red-600 font-bold" : ""}`}>
                        {product.stock}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(product.id, product.stock + 1)}
                        className="w-6 h-6 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.kitchenStock}</td>
                  <td className="px-4 py-3 font-medium text-green-600">₹{product.price - product.cost}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost (₹)</label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kitchen Stock</label>
                <Input
                  type="number"
                  value={formData.kitchenStock}
                  onChange={(e) => setFormData({ ...formData, kitchenStock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddProduct(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} className="flex-1">
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
