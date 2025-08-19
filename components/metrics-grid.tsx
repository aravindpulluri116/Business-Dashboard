"use client"

import type { DashboardMetrics, OrderData } from "@/lib/types"
import { InteractiveMetricCard } from "@/components/interactive-metric-card"
import { RevenueChart } from "@/components/revenue-chart"
import { CategoryChart } from "@/components/category-chart"
import { StatusChart } from "@/components/status-chart"
import { RecentOrders } from "@/components/recent-orders"
import { DollarSign, ShoppingCart, TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricsGridProps {
  metrics: DashboardMetrics
  orders: OrderData[]
  settings?: {
    showRevenueTrend: boolean
    showCategoryChart: boolean
    showStatusChart: boolean
    showRecentOrders: boolean
    compactMode: boolean
    chartAnimations: boolean
  }
}

export function MetricsGrid({ metrics, orders, settings }: MetricsGridProps) {
  const recentOrders = orders.slice(-10).reverse()

  const defaultSettings = {
    showRevenueTrend: true,
    showCategoryChart: true,
    showStatusChart: true,
    showRecentOrders: true,
    compactMode: false,
    chartAnimations: true,
  }

  const widgetSettings = { ...defaultSettings, ...settings }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8", widgetSettings.compactMode && "gap-6")}>
      {/* Key Metrics Row */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stagger-item hover-lift">
          <InteractiveMetricCard
            title="Total Revenue"
            value={`₹${metrics.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+12.5%"
            trendUp={true}
            className="neon-glow hover-glow"
            details={[
              { label: "This Month", value: `₹${(metrics.totalRevenue * 0.3).toLocaleString()}` },
              { label: "Last Month", value: `₹${(metrics.totalRevenue * 0.25).toLocaleString()}` },
              { label: "Growth", value: "+12.5%" },
            ]}
          />
        </div>
        <div className="stagger-item hover-lift">
          <InteractiveMetricCard
            title="Total Orders"
            value={metrics.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            trend="+8.2%"
            trendUp={true}
            className="neon-glow-teal hover-glow"
            details={[
              { label: "Completed", value: `${Math.floor(metrics.totalOrders * 0.8)}` },
              { label: "Pending", value: `${Math.floor(metrics.totalOrders * 0.15)}` },
              { label: "Cancelled", value: `${Math.floor(metrics.totalOrders * 0.05)}` },
            ]}
          />
        </div>
        <div className="stagger-item hover-lift">
          <InteractiveMetricCard
            title="Avg Order Value"
            value={`₹${metrics.averageOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            trend="+3.1%"
            trendUp={true}
            className="hover-glow"
            details={[
              { label: "Highest", value: `₹${(metrics.averageOrderValue * 2.5).toFixed(2)}` },
              { label: "Lowest", value: `₹${(metrics.averageOrderValue * 0.3).toFixed(2)}` },
              { label: "Median", value: `₹${(metrics.averageOrderValue * 0.9).toFixed(2)}` },
            ]}
          />
        </div>
        <div className="stagger-item hover-lift">
          <InteractiveMetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            icon={Target}
            trend="-1.2%"
            trendUp={false}
            className="hover-glow"
            details={[
              { label: "Target", value: "85.0%" },
              { label: "Industry Avg", value: "78.5%" },
              { label: "Best Month", value: "89.2%" },
            ]}
          />
        </div>
      </div>

      {/* Revenue Chart */}
      {widgetSettings.showRevenueTrend && (
        <div className="lg:col-span-8 stagger-item hover-lift">
          <RevenueChart data={metrics.revenueByDate} />
        </div>
      )}

      {/* Category Distribution */}
      {widgetSettings.showCategoryChart && (
        <div
          className={cn("stagger-item hover-lift", widgetSettings.showRevenueTrend ? "lg:col-span-4" : "lg:col-span-6")}
        >
          <CategoryChart data={metrics.topCategories} />
        </div>
      )}

      {/* Order Status Chart */}
      {widgetSettings.showStatusChart && (
        <div
          className={cn(
            "stagger-item hover-lift",
            widgetSettings.showRecentOrders ? "lg:col-span-6" : "lg:col-span-12",
          )}
        >
          <StatusChart data={metrics.orderStatusDistribution} />
        </div>
      )}

      {/* Recent Orders */}
      {widgetSettings.showRecentOrders && (
        <div className="lg:col-span-6 stagger-item hover-lift">
          <RecentOrders orders={recentOrders} />
        </div>
      )}
    </div>
  )
}
