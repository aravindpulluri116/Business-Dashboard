"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface CategoryChartProps {
  data: Array<{ category: string; count: number; revenue: number }>
}

const COLORS = [
  "#3B82F6", // Bright blue
  "#10B981", // Emerald green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-card p-3 border border-secondary/30 shadow-lg">
        <p className="text-sm font-medium text-secondary">{data.category}</p>
        <p className="text-sm text-muted-foreground">Orders: {data.count}</p>
        <p className="text-lg font-semibold text-foreground">₹{data.revenue.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-col space-y-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground truncate">{entry.payload?.category || entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, category }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${category}`}
    </text>
  )
}

export function CategoryChart({ data }: CategoryChartProps) {
  console.log("[v0] Category chart data:", data)

  if (!data || data.length === 0) {
    return (
      <Card className="glass-card border-border/50 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Top Categories
            </span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No category data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Top Categories
          </span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="revenue"
                label={CustomLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
