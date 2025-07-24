"use client"

import { useState } from "react"
import { usePOS } from "../context/POSContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Mail, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import type { Supplier } from "../types"

export default function SupplierManagement() {
  const { suppliers, setSuppliers } = usePOS()
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    rating: "5",
    paymentTerms: "",
    categories: [] as string[],
  })

  const categories = ["grains", "pulses", "vegetables", "spices", "dairy", "meat", "oils", "others"]

  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: supplierForm.name,
      contact: supplierForm.contact,
      email: supplierForm.email,
      address: supplierForm.address,
      rating: Number.parseFloat(supplierForm.rating),
      paymentTerms: supplierForm.paymentTerms,
      categories: supplierForm.categories,
    }

    if (editingSupplier) {
      setSuppliers(suppliers.map((s) => (s.id === editingSupplier.id ? { ...s, ...newSupplier } : s)))
    } else {
      setSuppliers([...suppliers, newSupplier])
    }

    setShowAddSupplier(false)
    resetForm()
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setSupplierForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address,
      rating: supplier.rating.toString(),
      paymentTerms: supplier.paymentTerms,
      categories: supplier.categories,
    })
    setShowAddSupplier(true)
  }

  const handleDeleteSupplier = (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter((s) => s.id !== supplierId))
    }
  }

  const resetForm = () => {
    setSupplierForm({
      name: "",
      contact: "",
      email: "",
      address: "",
      rating: "5",
      paymentTerms: "",
      categories: [],
    })
    setEditingSupplier(null)
  }

  const toggleCategory = (category: string) => {
    setSupplierForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <Button onClick={() => setShowAddSupplier(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < supplier.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({supplier.rating})</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleEditSupplier(supplier)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{supplier.contact}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{supplier.email}</span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>{supplier.address}</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Payment Terms: </span>
                <span className="font-medium">{supplier.paymentTerms}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {supplier.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Supplier Modal */}
      <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Supplier Name</label>
              <Input
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <Input
                value={supplierForm.contact}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={supplierForm.rating}
                onChange={(e) => setSupplierForm({ ...supplierForm, rating: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Payment Terms</label>
              <Input
                value={supplierForm.paymentTerms}
                onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                placeholder="e.g., 30 days, Cash on delivery"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={supplierForm.categories.includes(category) ? "default" : "outline"}
                    onClick={() => toggleCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddSupplier(false)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleAddSupplier} className="flex-1">
              {editingSupplier ? "Update" : "Add"} Supplier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
