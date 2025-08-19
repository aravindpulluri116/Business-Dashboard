"use client"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useWidgetSettings } from "@/hooks/use-widget-settings"
import { ConsolidatedNavbar } from "@/components/consolidated-navbar"
import { MetricsGrid } from "@/components/metrics-grid"
import { DataTable } from "@/components/data-table"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"
import { MetricCardSkeleton, ChartSkeleton, OrderListSkeleton } from "@/components/skeleton-loader"
import { Chatbot } from "@/components/chatbot"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { orders, metrics, loading, error, lastUpdated, refreshData } = useDashboardData()
  const { settings, updateSettings } = useWidgetSettings()

  // No need for filteredOrders since DashboardFilters are removed

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
        <FloatingElements />
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
        <ErrorDisplay error={error} onRetry={refreshData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background Effects */}
      <AnimatedBackground />
      <FloatingElements />

      {/* Main Content */}
      <div className="relative z-10">
        {/* improved padding and spacing for better layout */}
        <div className="p-8 pb-0">
          <ConsolidatedNavbar
            lastUpdated={lastUpdated}
            onRefresh={refreshData}
            isLoading={loading}
            isConnected={!error}
          />
        </div>

        {/* Dashboard Content */}
        <main className={cn("p-8 space-y-8 animate-fade-in", settings.compactMode && "p-6 space-y-6")}>
          {/* Metrics Grid */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="stagger-item">
                    <MetricCardSkeleton />
                  </div>
                ))}
              </div>
              <div className="lg:col-span-8 stagger-item">
                <ChartSkeleton />
              </div>
              <div className="lg:col-span-4 stagger-item">
                <ChartSkeleton />
              </div>
              <div className="lg:col-span-6 stagger-item">
                <ChartSkeleton />
              </div>
              <div className="lg:col-span-6 stagger-item">
                <OrderListSkeleton />
              </div>
            </div>
          ) : (
            metrics && (
              <div className="animate-scale-in space-y-6">
                <MetricsGrid metrics={metrics} orders={orders} settings={settings} />
                <DataTable orders={orders} />
              </div>
            )
          )}
        </main>
      </div>

      <Chatbot onDataRefresh={refreshData} />
    </div>
  )
}
