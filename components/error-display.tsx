"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/20 border border-destructive/30">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Connection Error</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>

        <Button onClick={onRetry} className="w-full neon-glow">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    </div>
  )
}
