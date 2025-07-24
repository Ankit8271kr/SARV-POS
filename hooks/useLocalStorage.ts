"use client"

import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const parsed = JSON.parse(item)

      // Convert timestamp strings back to Date objects for sales data
      if (key === "pos-sales" && Array.isArray(parsed)) {
        return parsed.map((sale: any) => ({
          ...sale,
          timestamp: new Date(sale.timestamp),
        })) as T
      }

      // Convert timestamp strings back to Date objects for stock movements
      if (key === "pos-stock-movements" && Array.isArray(parsed)) {
        return parsed.map((movement: any) => ({
          ...movement,
          timestamp: new Date(movement.timestamp),
        })) as T
      }

      // Convert timestamp strings back to Date objects for waste records
      if (key === "pos-waste-records" && Array.isArray(parsed)) {
        return parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        })) as T
      }

      // Convert date strings back to Date objects for raw materials
      if (key === "pos-raw-materials" && Array.isArray(parsed)) {
        return parsed.map((material: any) => ({
          ...material,
          lastPurchased: new Date(material.lastPurchased),
          expiryDate: material.expiryDate ? new Date(material.expiryDate) : undefined,
        })) as T
      }

      // Convert date strings back to Date objects for purchase orders
      if (key === "pos-purchase-orders" && Array.isArray(parsed)) {
        return parsed.map((order: any) => ({
          ...order,
          orderDate: new Date(order.orderDate),
          expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery) : undefined,
          actualDelivery: order.actualDelivery ? new Date(order.actualDelivery) : undefined,
        })) as T
      }

      return parsed
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}
