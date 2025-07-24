"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import type {
  Product,
  CartItem,
  Sale,
  KitchenItem,
  RawMaterial,
  Recipe,
  Supplier,
  PurchaseOrder,
  StockMovement,
  WasteRecord,
} from "../types"

// Add these to the POSContextType interface
interface POSContextType {
  products: Product[]
  setProducts: (products: Product[]) => void
  cartItems: CartItem[]
  setCartItems: (items: CartItem[]) => void
  sales: Sale[]
  setSales: (sales: Sale[]) => void
  kitchenItems: KitchenItem[]
  setKitchenItems: (items: KitchenItem[]) => void
  currentPage: string
  setCurrentPage: (page: string) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  addSale: (sale: Sale) => void
  updateProductStock: (productId: string, quantity: number) => void
  // ... existing properties
  rawMaterials: RawMaterial[]
  setRawMaterials: (materials: RawMaterial[]) => void
  recipes: Recipe[]
  setRecipes: (recipes: Recipe[]) => void
  suppliers: Supplier[]
  setSuppliers: (suppliers: Supplier[]) => void
  purchaseOrders: PurchaseOrder[]
  setPurchaseOrders: (orders: PurchaseOrder[]) => void
  stockMovements: StockMovement[]
  setStockMovements: (movements: StockMovement[]) => void
  wasteRecords: WasteRecord[]
  setWasteRecords: (records: WasteRecord[]) => void
  addStockMovement: (movement: StockMovement) => void
  updateRawMaterialStock: (materialId: string, quantity: number, type: string, reason: string) => void
}

const POSContext = createContext<POSContextType | undefined>(undefined)

const initialProducts: Product[] = [
  { id: "1", name: "Paneer Tikka", price: 100, category: "Main Course", stock: 50, kitchenStock: 20, cost: 60 },
  { id: "2", name: "Samosa", price: 10, category: "Snacks", stock: 100, kitchenStock: 50, cost: 5 },
  { id: "3", name: "Manchurian", price: 60, category: "Main Course", stock: 30, kitchenStock: 15, cost: 35 },
  { id: "4", name: "Pastries", price: 25, category: "Desserts", stock: 40, kitchenStock: 20, cost: 15 },
  { id: "5", name: "Sandwiches", price: 40, category: "Snacks", stock: 25, kitchenStock: 12, cost: 25 },
  { id: "6", name: "Salads", price: 30, category: "Healthy", stock: 20, kitchenStock: 10, cost: 18 },
  { id: "7", name: "Soups", price: 50, category: "Beverages", stock: 35, kitchenStock: 18, cost: 30 },
  { id: "8", name: "Pizza", price: 80, category: "Main Course", stock: 15, kitchenStock: 8, cost: 50 },
  { id: "9", name: "Iced Coffee", price: 50, category: "Beverages", stock: 60, kitchenStock: 30, cost: 25 },
  { id: "10", name: "Beans", price: 100, category: "Main Course", stock: 25, kitchenStock: 12, cost: 65 },
  { id: "11", name: "Donuts", price: 80, category: "Desserts", stock: 30, kitchenStock: 15, cost: 45 },
]

const initialKitchenItems: KitchenItem[] = initialProducts.map((product) => ({
  id: product.id,
  productId: product.id,
  name: product.name,
  currentStock: product.kitchenStock,
  minStock: 5,
  maxStock: 50,
  unit: "pieces",
  lastRestocked: new Date(),
  cost: product.cost,
}))

// Add initial data
const initialRawMaterials: RawMaterial[] = [
  {
    id: "rm1",
    name: "Basmati Rice",
    category: "grains",
    unit: "kg",
    currentStock: 50,
    minStock: 10,
    maxStock: 100,
    costPerUnit: 120,
    supplier: "Rice Traders Ltd",
    lastPurchased: new Date(),
    location: "Storage Room A",
    description: "Premium quality basmati rice",
  },
  {
    id: "rm2",
    name: "Toor Dal",
    category: "pulses",
    unit: "kg",
    currentStock: 25,
    minStock: 5,
    maxStock: 50,
    costPerUnit: 150,
    supplier: "Pulse Suppliers",
    lastPurchased: new Date(),
    location: "Storage Room A",
  },
  {
    id: "rm3",
    name: "Onions",
    category: "vegetables",
    unit: "kg",
    currentStock: 30,
    minStock: 10,
    maxStock: 60,
    costPerUnit: 40,
    supplier: "Fresh Vegetables Co",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastPurchased: new Date(),
    location: "Cold Storage",
  },
  {
    id: "rm4",
    name: "Tomatoes",
    category: "vegetables",
    unit: "kg",
    currentStock: 20,
    minStock: 8,
    maxStock: 40,
    costPerUnit: 60,
    supplier: "Fresh Vegetables Co",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    lastPurchased: new Date(),
    location: "Cold Storage",
  },
  {
    id: "rm5",
    name: "Turmeric Powder",
    category: "spices",
    unit: "kg",
    currentStock: 5,
    minStock: 1,
    maxStock: 10,
    costPerUnit: 300,
    supplier: "Spice Masters",
    lastPurchased: new Date(),
    location: "Spice Rack",
  },
  {
    id: "rm6",
    name: "Milk",
    category: "dairy",
    unit: "liters",
    currentStock: 15,
    minStock: 5,
    maxStock: 30,
    costPerUnit: 55,
    supplier: "Dairy Fresh",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    lastPurchased: new Date(),
    location: "Refrigerator",
  },
  {
    id: "rm7",
    name: "Chicken",
    category: "meat",
    unit: "kg",
    currentStock: 12,
    minStock: 3,
    maxStock: 25,
    costPerUnit: 280,
    supplier: "Fresh Meat Co",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    lastPurchased: new Date(),
    location: "Freezer",
  },
  {
    id: "rm8",
    name: "Cooking Oil",
    category: "oils",
    unit: "liters",
    currentStock: 8,
    minStock: 2,
    maxStock: 20,
    costPerUnit: 180,
    supplier: "Oil Distributors",
    lastPurchased: new Date(),
    location: "Storage Room B",
  },
]

const initialSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "Rice Traders Ltd",
    contact: "9876543210",
    email: "orders@ricetraders.com",
    address: "123 Market Street, City",
    rating: 4.5,
    paymentTerms: "30 days",
    categories: ["grains"],
  },
  {
    id: "s2",
    name: "Fresh Vegetables Co",
    contact: "9876543211",
    email: "supply@freshveg.com",
    address: "456 Farm Road, City",
    rating: 4.2,
    paymentTerms: "15 days",
    categories: ["vegetables"],
  },
  {
    id: "s3",
    name: "Dairy Fresh",
    contact: "9876543212",
    email: "orders@dairyfresh.com",
    address: "789 Dairy Lane, City",
    rating: 4.8,
    paymentTerms: "7 days",
    categories: ["dairy"],
  },
]

const initialSales: Sale[] = [
  {
    id: "1704067200000",
    items: [
      { id: "1", name: "Paneer Tikka", price: 100, quantity: 2, category: "Main Course" },
      { id: "9", name: "Iced Coffee", price: 50, quantity: 1, category: "Beverages" },
    ],
    total: 250,
    customerName: "John Doe",
    customerMobile: "9876543210",
    paymentMethod: "cash",
    amountPaid: 300,
    change: 50,
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "completed",
  },
  {
    id: "1704070800000",
    items: [
      { id: "8", name: "Pizza", price: 80, quantity: 1, category: "Main Course" },
      { id: "6", name: "Salads", price: 30, quantity: 2, category: "Healthy" },
    ],
    total: 140,
    customerName: "Jane Smith",
    customerMobile: "9876543211",
    paymentMethod: "upi",
    amountPaid: 140,
    change: 0,
    timestamp: new Date("2024-01-15T11:30:00"),
    status: "completed",
  },
  {
    id: "1704074400000",
    items: [
      { id: "2", name: "Samosa", price: 10, quantity: 5, category: "Snacks" },
      { id: "7", name: "Soups", price: 50, quantity: 1, category: "Beverages" },
    ],
    total: 100,
    customerName: "Mike Johnson",
    customerMobile: "9876543212",
    paymentMethod: "cash",
    amountPaid: 100,
    change: 0,
    timestamp: new Date("2024-01-15T12:45:00"),
    status: "completed",
  },
]

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>("pos-products", initialProducts)
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("pos-cart", [])
  const [sales, setSales] = useLocalStorage<Sale[]>("pos-sales", initialSales)
  const [kitchenItems, setKitchenItems] = useLocalStorage<KitchenItem[]>("pos-kitchen", initialKitchenItems)
  const [currentPage, setCurrentPage] = useLocalStorage<string>("pos-current-page", "dashboard")

  // Add these to the POSProvider component
  const [rawMaterials, setRawMaterials] = useLocalStorage<RawMaterial[]>("pos-raw-materials", initialRawMaterials)
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("pos-recipes", [])
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>("pos-suppliers", initialSuppliers)
  const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>("pos-purchase-orders", [])
  const [stockMovements, setStockMovements] = useLocalStorage<StockMovement[]>("pos-stock-movements", [])
  const [wasteRecords, setWasteRecords] = useLocalStorage<WasteRecord[]>("pos-waste-records", [])

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
        },
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const addSale = (sale: Sale) => {
    setSales((prev) => [sale, ...prev])
    // Update product stock
    sale.items.forEach((item) => {
      updateProductStock(item.id, -item.quantity)
    })
  }

  const updateProductStock = (productId: string, quantityChange: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock + quantityChange) } : product,
      ),
    )
  }

  const addStockMovement = (movement: StockMovement) => {
    setStockMovements((prev) => [movement, ...prev])
  }

  const updateRawMaterialStock = (materialId: string, quantity: number, type: string, reason: string) => {
    setRawMaterials((prev) =>
      prev.map((material) =>
        material.id === materialId
          ? { ...material, currentStock: Math.max(0, material.currentStock + quantity) }
          : material,
      ),
    )

    const movement: StockMovement = {
      id: Date.now().toString(),
      materialId,
      materialName: rawMaterials.find((m) => m.id === materialId)?.name || "",
      type: type as any,
      quantity: Math.abs(quantity),
      unit: rawMaterials.find((m) => m.id === materialId)?.unit || "",
      reason,
      timestamp: new Date(),
    }

    addStockMovement(movement)
  }

  return (
    <POSContext.Provider
      value={{
        products,
        setProducts,
        cartItems,
        setCartItems,
        sales,
        setSales,
        kitchenItems,
        setKitchenItems,
        currentPage,
        setCurrentPage,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addSale,
        updateProductStock,
        // Add these to the context value
        rawMaterials,
        setRawMaterials,
        recipes,
        setRecipes,
        suppliers,
        setSuppliers,
        purchaseOrders,
        setPurchaseOrders,
        stockMovements,
        setStockMovements,
        wasteRecords,
        setWasteRecords,
        addStockMovement,
        updateRawMaterialStock,
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

export function usePOS() {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}
