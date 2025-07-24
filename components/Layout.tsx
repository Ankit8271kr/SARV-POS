"use client"

import type React from "react"

import { usePOS } from "../context/POSContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Grid3X3, Package, Star, Clock, FileText, Truck } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { currentPage, setCurrentPage } = usePOS()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Grid3X3 },
    { id: "products", label: "Products", icon: Package },
    { id: "kitchen", label: "Kitchen", icon: Star },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "history", label: "History", icon: Clock },
    { id: "report", label: "Report", icon: FileText },
  ]

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
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentPage === item.id ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
