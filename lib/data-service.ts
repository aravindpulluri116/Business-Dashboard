import type { OrderData, DashboardMetrics } from "./types"

const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/10NRP6_PRQGO6eHGFmeBUSFfxYhqfJ2DtnN8fteRIOsE/export?format=csv"
const WEBHOOK_URL = "https://n8n-rovg.onrender.com/webhook/8c6816cf-6e2d-4aa5-9855-077d133d3917"

export async function fetchOrderData(): Promise<OrderData[]> {
  try {
    console.log("[v0] Fetching data from Google Sheets...")
    const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
      cache: "no-store", // Ensure fresh data on each request
    })

    if (!response.ok) {
      console.log("[v0] Response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV data received, length:", csvText.length)
    console.log("[v0] First 200 characters:", csvText.substring(0, 200))

    const parsedData = parseCSVToOrderData(csvText)
    console.log("[v0] Parsed orders count:", parsedData.length)

    return parsedData
  } catch (error) {
    console.error("[v0] Error fetching order data:", error)
    return []
  }
}

function parseCSVToOrderData(csvText: string): OrderData[] {
  const lines = csvText.split("\n")
  if (lines.length < 2) {
    console.log("[v0] Not enough lines in CSV")
    return []
  }

  const headers = parseCSVLine(lines[0])
  console.log("[v0] Headers:", headers)

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        const values = parseCSVLine(line)
        console.log(`[v0] Row ${index + 1} values:`, values.slice(0, 5)) // Log first 5 values

        const dateStr = values[0] || ""
        let parsedDate = dateStr
        if (dateStr) {
          const dateParts = dateStr.split("/")
          if (dateParts.length === 3) {
            // Convert DD/MM/YYYY to MM/DD/YYYY for proper parsing
            const [day, month, year] = dateParts
            const jsDate = new Date(`${month}/${day}/${year}`)
            if (!isNaN(jsDate.getTime())) {
              // Store as ISO string for consistent parsing
              parsedDate = jsDate.toISOString()
            } else {
              console.warn(`[v0] Invalid date format: ${dateStr}`)
              parsedDate = "Invalid Date"
            }
          }
        }

        const quantity = Number.parseInt(values[7]) || 0
        const pricePerItem = Number.parseFloat(values[8]) || 0
        const totalAmount = Number.parseFloat(values[9]) || 0
        const discountPercent = Number.parseFloat(values[10]) || 0
        const finalAmount = Number.parseFloat(values[11]) || 0

        // Log validation warnings
        if (isNaN(pricePerItem) && values[8]) {
          console.warn(`[v0] Invalid price per item: ${values[8]}`)
        }
        if (isNaN(finalAmount) && values[11]) {
          console.warn(`[v0] Invalid final amount: ${values[11]}`)
        }

        return {
          date: parsedDate,
          orderId: values[1] || "",
          customerName: values[2] || "",
          customerPhone: values[3] || "",
          customerEmail: values[4] || "",
          itemName: values[5] || "",
          category: values[6] || "",
          quantity,
          pricePerItem,
          totalAmount,
          discountPercent,
          finalAmount,
          paymentMethod: values[12] || "",
          orderStatus: values[13] || "",
          deliveryType: values[14] || "",
          deliveryStatus: values[15] || "",
          notes: values[16] || "",
          price: pricePerItem,
          total: finalAmount,
        }
      } catch (error) {
        console.error(`[v0] Error parsing row ${index + 1}:`, error)
        return null
      }
    })
    .filter((order): order is OrderData => order !== null)
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

export function calculateMetrics(orders: OrderData[]): DashboardMetrics {
  const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Calculate conversion rate (assuming completed orders are conversions)
  const completedOrders = orders.filter(
    (order) =>
      order.orderStatus.toLowerCase().includes("completed") || order.orderStatus.toLowerCase().includes("delivered"),
  ).length
  const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  // Top categories
  const categoryStats = orders.reduce(
    (acc, order) => {
      if (!acc[order.category]) {
        acc[order.category] = { count: 0, revenue: 0 }
      }
      acc[order.category].count++
      acc[order.category].revenue += order.finalAmount
      return acc
    },
    {} as Record<string, { count: number; revenue: number }>,
  )

  const topCategories = Object.entries(categoryStats)
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Revenue by date
  const revenueByDate = orders.reduce(
    (acc, order) => {
      const date = order.date
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += order.finalAmount
      return acc
    },
    {} as Record<string, number>,
  )

  const revenueByDateArray = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Order status distribution
  const statusStats = orders.reduce(
    (acc, order) => {
      if (!acc[order.orderStatus]) {
        acc[order.orderStatus] = 0
      }
      acc[order.orderStatus]++
      return acc
    },
    {} as Record<string, number>,
  )

  const orderStatusDistribution = Object.entries(statusStats).map(([status, count]) => ({ status, count }))

  // Payment method distribution
  const paymentStats = orders.reduce(
    (acc, order) => {
      if (!acc[order.paymentMethod]) {
        acc[order.paymentMethod] = 0
      }
      acc[order.paymentMethod]++
      return acc
    },
    {} as Record<string, number>,
  )

  const paymentMethodDistribution = Object.entries(paymentStats).map(([method, count]) => ({ method, count }))

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    topCategories,
    revenueByDate: revenueByDateArray,
    orderStatusDistribution,
    paymentMethodDistribution,
  }
}

export async function sendWebhookNotification(data: any): Promise<void> {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Error sending webhook notification:", error)
  }
}
