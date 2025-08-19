"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Activity, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  lastUpdated: Date | null
  onRefresh: () => void
  isLoading: boolean
}

export function DashboardHeader({ lastUpdated, onRefresh, isLoading }: DashboardHeaderProps) {
  return (
    <header className="glass-card border-b border-border/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/20 neon-glow">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Control Center
              </h1>
              <p className="text-sm text-muted-foreground">Real-time business intelligence dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          )}

          <Button
            onClick={onRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className={cn(
              "glass border-primary/30 hover:border-primary/50 hover:neon-glow transition-all duration-300",
              isLoading && "animate-pulse",
            )}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>

          <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30">
            <Zap className="h-3 w-3 text-secondary animate-pulse" />
            <span className="text-xs text-secondary font-medium">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  )
}
