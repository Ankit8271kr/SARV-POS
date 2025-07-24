// This script can be used to seed the POS system with sample data
const sampleSales = [
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
    timestamp: new Date("2024-01-01T10:30:00"),
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
    timestamp: new Date("2024-01-01T11:30:00"),
    status: "completed",
  },
]

// Function to seed data (would be called from the app)
function seedSampleData() {
  if (typeof window !== "undefined") {
    localStorage.setItem("pos-sales", JSON.stringify(sampleSales))
    console.log("Sample data seeded successfully!")
  }
}

export { seedSampleData, sampleSales }
