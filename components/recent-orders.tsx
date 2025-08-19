"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OrderData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currency"

interface RecentOrdersProps {
  orders: OrderData[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    if (normalizedStatus.includes("completed") || normalizedStatus.includes("delivered")) {
      return "bg-secondary/20 text-secondary border-secondary/30"
    }
    if (normalizedStatus.includes("pending") || normalizedStatus.includes("processing")) {
      return "bg-primary/20 text-primary border-primary/30"
    }
    if (normalizedStatus.includes("cancelled") || normalizedStatus.includes("failed")) {
      return "bg-destructive/20 text-destructive border-destructive/30"
    }
    return "bg-muted/20 text-muted-foreground border-muted/30"
  }

  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Recent Orders
          </span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent orders found</p>
            </div>
          ) : (
            orders.map((order, index) => (
              <div
                key={order.orderId || index}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {order.customerName || "Unknown Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{order.itemName || "No item name"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.finalAmount || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.date || "No date"}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(order.orderStatus || "unknown"))}>
                      {order.orderStatus || "Unknown"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{order.orderId || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
