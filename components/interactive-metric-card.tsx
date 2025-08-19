"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown, MoreHorizontal, Eye, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InteractiveMetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
  onViewDetails?: () => void
  onViewChart?: () => void
  details?: Array<{ label: string; value: string }>
}

export function InteractiveMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
  onViewDetails,
  onViewChart,
  details,
}: InteractiveMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card
      className={cn(
        "glass-card border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group",
        isHovered && "neon-glow scale-105",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onViewChart && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewChart()
                    }}
                    className="h-6 w-6 p-0 hover:bg-primary/20"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                )}
                {onViewDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails()
                    }}
                    className="h-6 w-6 p-0 hover:bg-primary/20"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>

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

            {/* Expandable Details */}
            {showDetails && details && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                {details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="text-foreground font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className={cn(
              "p-3 rounded-lg bg-primary/20 border border-primary/30 transition-all duration-300",
              isHovered && "bg-primary/30 border-primary/50",
            )}
          >
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
