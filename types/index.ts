export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  kitchenStock: number
  cost: number
  image?: string
  description?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export interface Sale {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerMobile: string
  paymentMethod: "cash" | "upi"
  amountPaid: number
  change: number
  timestamp: Date
  status: "completed" | "pending" | "cancelled"
}

export interface KitchenItem {
  id: string
  productId: string
  name: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  lastRestocked: Date
  cost: number
}

export interface Report {
  date: string
  totalSales: number
  totalOrders: number
  topProducts: { name: string; quantity: number; revenue: number }[]
  hourlyData: { hour: number; sales: number; orders: number }[]
  paymentMethods: { cash: number; upi: number }
}

export interface RawMaterial {
  id: string
  name: string
  category: "grains" | "pulses" | "vegetables" | "spices" | "dairy" | "meat" | "oils" | "others"
  unit: "kg" | "grams" | "liters" | "ml" | "pieces" | "packets"
  currentStock: number
  minStock: number
  maxStock: number
  costPerUnit: number
  supplier: string
  expiryDate?: Date
  batchNumber?: string
  lastPurchased: Date
  location: string
  description?: string
}

export interface Recipe {
  id: string
  productId: string
  productName: string
  ingredients: RecipeIngredient[]
  preparationTime: number
  servingSize: number
  instructions: string[]
  totalCost: number
}

export interface RecipeIngredient {
  materialId: string
  materialName: string
  quantity: number
  unit: string
  cost: number
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  address: string
  rating: number
  paymentTerms: string
  categories: string[]
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: "pending" | "ordered" | "received" | "cancelled"
  orderDate: Date
  expectedDelivery?: Date
  actualDelivery?: Date
  notes?: string
}

export interface PurchaseOrderItem {
  materialId: string
  materialName: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
}

export interface StockMovement {
  id: string
  materialId: string
  materialName: string
  type: "purchase" | "usage" | "waste" | "adjustment"
  quantity: number
  unit: string
  reason: string
  timestamp: Date
  reference?: string
}

export interface WasteRecord {
  id: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  reason: "expired" | "damaged" | "spillage" | "overproduction" | "other"
  cost: number
  timestamp: Date
  notes?: string
}
