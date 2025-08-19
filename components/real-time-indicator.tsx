"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface RealTimeIndicatorProps {
  isConnected: boolean
  lastUpdated: Date | null
  onToggleRealTime: () => void
  isRealTimeEnabled: boolean
}

export function RealTimeIndicator({
  isConnected,
  lastUpdated,
  onToggleRealTime,
  isRealTimeEnabled,
}: RealTimeIndicatorProps) {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("")

  useEffect(() => {
    if (!lastUpdated) return

    const updateTimer = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdated.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      if (hours > 0) {
        setTimeSinceUpdate(`${hours}h ago`)
      } else if (minutes > 0) {
        setTimeSinceUpdate(`${minutes}m ago`)
      } else {
        setTimeSinceUpdate(`${seconds}s ago`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center space-x-3">
      {/* Connection Status */}
      <Badge
        variant="outline"
        className={cn(
          "flex items-center space-x-1 transition-all duration-300",
          isConnected
            ? "bg-secondary/20 text-secondary border-secondary/30 animate-pulse-slow"
            : "bg-destructive/20 text-destructive border-destructive/30",
        )}
      >
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs font-medium">{isConnected ? "CONNECTED" : "OFFLINE"}</span>
      </Badge>

      {/* Real-time Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleRealTime}
        className={cn(
          "flex items-center space-x-1 transition-all duration-300",
          isRealTimeEnabled
            ? "text-primary hover:text-primary/80 hover:bg-primary/10"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {isRealTimeEnabled ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        <span className="text-xs">{isRealTimeEnabled ? "LIVE" : "PAUSED"}</span>
      </Button>

      {/* Last Update Time */}
      {lastUpdated && <div className="text-xs text-muted-foreground">Updated {timeSinceUpdate}</div>}
    </div>
  )
}
