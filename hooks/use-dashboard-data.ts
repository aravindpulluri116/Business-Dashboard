"use client"

import { useState, useEffect, useCallback } from "react"
import type { OrderData, DashboardMetrics } from "@/lib/types"
import { fetchOrderData, calculateMetrics } from "@/lib/data-service"

export function useDashboardData() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refreshData = useCallback(async () => {
    try {
      console.log("[v0] Starting data refresh...")
      setLoading(true)
      setError(null)

      const orderData = await fetchOrderData()
      console.log("[v0] Received order data:", orderData.length, "orders")

      const calculatedMetrics = calculateMetrics(orderData)
      console.log("[v0] Calculated metrics:", calculatedMetrics)

      setOrders(orderData)
      setMetrics(calculatedMetrics)
      setLastUpdated(new Date())
      console.log("[v0] Data refresh completed successfully")
    } catch (err) {
      console.error("[v0] Error in refreshData:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh on component mount and every 5 minutes
  useEffect(() => {
    refreshData()

    const interval = setInterval(refreshData, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [refreshData])

  return {
    orders,
    metrics,
    loading,
    error,
    lastUpdated,
    refreshData,
  }
}
