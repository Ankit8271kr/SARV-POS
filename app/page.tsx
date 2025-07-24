"use client"

import { POSProvider, usePOS } from "../context/POSContext"
import Layout from "../components/Layout"
import Dashboard from "../components/Dashboard"
import Products from "../components/Products"
import Kitchen from "../components/Kitchen"
import History from "../components/History"
import Report from "../components/Report"
import SupplierManagement from "../components/SupplierManagement"

function POSApp() {
  const { currentPage } = usePOS()

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "products":
        return <Products />
      case "kitchen":
        return <Kitchen />
      case "history":
        return <History />
      case "report":
        return <Report />
      case "suppliers":
        return <SupplierManagement />
      default:
        return <Dashboard />
    }
  }

  return <Layout>{renderPage()}</Layout>
}

export default function Page() {
  return (
    <POSProvider>
      <POSApp />
    </POSProvider>
  )
}
