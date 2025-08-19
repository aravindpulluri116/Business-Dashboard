"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  )
}

export function MetricCardSkeleton() {
  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 space-y-4">
          <div className="flex items-end space-x-2 h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="flex-1" style={{ height: `${Math.random() * 60 + 20}%` }} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrderListSkeleton() {
  return (
    <Card className="glass-card border-border/50 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-24" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
