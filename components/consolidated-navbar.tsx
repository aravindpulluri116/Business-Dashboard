"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff, Play, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsolidatedNavbarProps {
  lastUpdated: Date | null
  onRefresh: () => void
  isLoading: boolean
  isConnected: boolean
}

export function ConsolidatedNavbar({ lastUpdated, onRefresh, isLoading, isConnected }: ConsolidatedNavbarProps) {
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number>(0)
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (refreshInterval && isAutoRefresh && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (refreshInterval && isAutoRefresh && countdown === 0) {
      onRefresh()
      setCountdown(refreshInterval)
    }
  }, [countdown, refreshInterval, isAutoRefresh, onRefresh])

  const handleIntervalChange = (interval: number) => {
    setRefreshInterval(interval)
    setCountdown(interval)
    setIsAutoRefresh(true)
  }

  const handleManualRefresh = () => {
    onRefresh()
    if (refreshInterval && isAutoRefresh) {
      setCountdown(refreshInterval)
    }
  }

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh)
    if (!isAutoRefresh && refreshInterval) {
      setCountdown(refreshInterval)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return "Never"
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Connection Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <span className={cn("text-sm font-medium", isConnected ? "text-green-600" : "text-red-600")}>
              {isConnected ? "CONNECTED" : "DISCONNECTED"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">LIVE</span>
            <span className="text-sm text-muted-foreground">Updated {getTimeSinceUpdate()}</span>
          </div>
        </div>

        {/* Center: Last Updated Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
          </span>
        </div>

        {/* Right: Auto Refresh Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={refreshInterval === 120 && isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange(120)}
            className="h-8 px-3"
          >
            2m
          </Button>
          <Button
            variant={refreshInterval === 300 && isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange(300)}
            className="h-8 px-3"
          >
            5m
          </Button>

          {refreshInterval && (
            <Button
              variant={isAutoRefresh ? "default" : "outline"}
              size="sm"
              onClick={toggleAutoRefresh}
              className="h-8 px-3"
            >
              {isAutoRefresh ? `Auto (${formatTime(countdown)})` : "Auto (Off)"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="h-8 px-3 bg-transparent"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
