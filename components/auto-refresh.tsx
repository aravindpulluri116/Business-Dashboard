"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutoRefreshProps {
  onRefresh: () => void
  lastUpdated?: Date
}

export function AutoRefresh({ onRefresh, lastUpdated }: AutoRefreshProps) {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)
  const [interval, setInterval] = useState<2 | 5>(2) // 2 or 5 minutes
  const [countdown, setCountdown] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isAutoRefresh && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (isAutoRefresh && countdown === 0) {
      handleRefresh()
      setCountdown(interval * 60) // Reset countdown
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isAutoRefresh, countdown, interval])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
  }

  const toggleAutoRefresh = () => {
    if (!isAutoRefresh) {
      setCountdown(interval * 60)
    }
    setIsAutoRefresh(!isAutoRefresh)
  }

  const handleIntervalChange = (newInterval: 2 | 5) => {
    setInterval(newInterval)
    if (isAutoRefresh) {
      setCountdown(newInterval * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Never updated"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Interval Selection */}
            <div className="flex rounded-md border border-border/50 overflow-hidden">
              <Button
                variant={interval === 2 ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-none px-3 py-1 text-xs", interval === 2 && "bg-primary text-primary-foreground")}
                onClick={() => handleIntervalChange(2)}
              >
                2m
              </Button>
              <Button
                variant={interval === 5 ? "default" : "ghost"}
                size="sm"
                className={cn("rounded-none px-3 py-1 text-xs", interval === 5 && "bg-primary text-primary-foreground")}
                onClick={() => handleIntervalChange(5)}
              >
                5m
              </Button>
            </div>

            {/* Auto Refresh Toggle */}
            <Button
              variant={isAutoRefresh ? "default" : "outline"}
              size="sm"
              onClick={toggleAutoRefresh}
              className={cn("px-3 py-1 text-xs", isAutoRefresh && "bg-green-600 hover:bg-green-700 text-white")}
            >
              {isAutoRefresh ? `Auto (${formatTime(countdown)})` : "Auto Off"}
            </Button>

            {/* Manual Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1 bg-transparent"
            >
              <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
