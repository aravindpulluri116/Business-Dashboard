"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"

interface StatusChartProps {
  data: Array<{ status: string; count: number }>
}

export function StatusChart({ data }: StatusChartProps) {
  const getBarColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10B981" // Green
      case "pending":
        return "#F59E0B" // Amber
      case "cancelled":
        return "#EF4444" // Red
      default:
        return "#3B82F6" // Blue
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-lg font-semibold text-gray-700">{payload[0].value} orders</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <span className="text-gray-900">Order Status</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} className="hover:opacity-80 transition-opacity">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
