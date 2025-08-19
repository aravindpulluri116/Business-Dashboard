"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  const formatDate = (dateString: string) => {
    // Parse DD/MM/YYYY format or ISO format
    let date: Date

    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/")
      date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    } else {
      date = new Date(dateString)
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString // Return original string if parsing fails
    }

    switch (timePeriod) {
      case "daily":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "weekly":
        return `Week ${Math.ceil(date.getDate() / 7)}`
      case "monthly":
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      default:
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const processDataByPeriod = (rawData: Array<{ date: string; revenue: number }>) => {
    if (!rawData || rawData.length === 0) return []

    switch (timePeriod) {
      case "weekly":
        // Group by week
        const weeklyData = new Map<string, number>()
        rawData.forEach((item) => {
          let date: Date
          if (item.date.includes("/")) {
            const [day, month, year] = item.date.split("/")
            date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
          } else {
            date = new Date(item.date)
          }

          if (!isNaN(date.getTime())) {
            const weekKey = `Week ${Math.ceil(date.getDate() / 7)} ${date.getFullYear()}`
            weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + item.revenue)
          }
        })
        return Array.from(weeklyData.entries()).map(([date, revenue]) => ({ date, revenue }))

      case "monthly":
        // Group by month
        const monthlyData = new Map<string, number>()
        rawData.forEach((item) => {
          let date: Date
          if (item.date.includes("/")) {
            const [day, month, year] = item.date.split("/")
            date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
          } else {
            date = new Date(item.date)
          }

          if (!isNaN(date.getTime())) {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
            monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + item.revenue)
          }
        })
        return Array.from(monthlyData.entries()).map(([date, revenue]) => ({ date, revenue }))

      default:
        return rawData
    }
  }

  const processedData = processDataByPeriod(data)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-primary/30 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-primary">₹{payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  console.log("[v0] Revenue chart data:", data)

  if (!data || data.length === 0) {
    return (
      <Card className="glass-card border-border/50 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Revenue Trends
              </span>
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>
            <div className="flex gap-1">
              <Button
                variant={timePeriod === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod("daily")}
                className="h-7 px-2 text-xs"
              >
                Daily
              </Button>
              <Button
                variant={timePeriod === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod("weekly")}
                className="h-7 px-2 text-xs"
              >
                Weekly
              </Button>
              <Button
                variant={timePeriod === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod("monthly")}
                className="h-7 px-2 text-xs"
              >
                Monthly
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Revenue Trends
            </span>
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>
          <div className="flex gap-1">
            <Button
              variant={timePeriod === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("daily")}
              className="h-7 px-2 text-xs"
            >
              Daily
            </Button>
            <Button
              variant={timePeriod === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("weekly")}
              className="h-7 px-2 text-xs"
            >
              Weekly
            </Button>
            <Button
              variant={timePeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("monthly")}
              className="h-7 px-2 text-xs"
            >
              Monthly
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
