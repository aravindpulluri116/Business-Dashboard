"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function MetricCard({ title, value, icon: Icon, trend, trendUp, className }: MetricCardProps) {
  return (
    <Card className={cn("glass-card border-border/50 hover:border-primary/30 transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                {trendUp ? (
                  <TrendingUp className="h-3 w-3 text-secondary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={cn("text-xs font-medium", trendUp ? "text-secondary" : "text-destructive")}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
