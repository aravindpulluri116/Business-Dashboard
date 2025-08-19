"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Eye, Palette, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

interface WidgetSettings {
  showRevenueTrend: boolean
  showCategoryChart: boolean
  showStatusChart: boolean
  showRecentOrders: boolean
  refreshInterval: number
  chartAnimations: boolean
  compactMode: boolean
}

interface WidgetCustomizerProps {
  settings: WidgetSettings
  onSettingsChange: (settings: WidgetSettings) => void
}

export function WidgetCustomizer({ settings, onSettingsChange }: WidgetCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateSetting = <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const widgets = [
    { key: "showRevenueTrend" as const, label: "Revenue Trends", description: "Line chart showing revenue over time" },
    { key: "showCategoryChart" as const, label: "Category Distribution", description: "Pie chart of top categories" },
    { key: "showStatusChart" as const, label: "Order Status", description: "Bar chart of order statuses" },
    { key: "showRecentOrders" as const, label: "Recent Orders", description: "List of latest orders" },
  ]

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={cn(
          "glass border-primary/30 hover:border-primary/50 transition-all duration-300",
          isOpen && "neon-glow",
        )}
      >
        <Settings className={cn("h-4 w-4", isOpen && "animate-spin")} />
      </Button>

      {isOpen && (
        <Card className="glass-card border-border/50 mt-2 w-80 max-h-96 overflow-y-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Layout className="h-4 w-4 text-primary" />
              <span>Dashboard Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Widget Visibility */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Eye className="h-3 w-3" />
                <span>Visible Widgets</span>
              </h4>
              {widgets.map((widget) => (
                <div key={widget.key} className="flex items-center justify-between space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{widget.label}</p>
                    <p className="text-xs text-muted-foreground">{widget.description}</p>
                  </div>
                  <Switch
                    checked={settings[widget.key]}
                    onCheckedChange={(checked) => updateSetting(widget.key, checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>

            {/* Refresh Interval */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Auto Refresh</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Interval: {settings.refreshInterval} min</span>
                </div>
                <Slider
                  value={[settings.refreshInterval]}
                  onValueChange={([value]) => updateSetting("refreshInterval", value)}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Palette className="h-3 w-3" />
                <span>Display Options</span>
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Chart Animations</p>
                  <p className="text-xs text-muted-foreground">Enable smooth chart transitions</p>
                </div>
                <Switch
                  checked={settings.chartAnimations}
                  onCheckedChange={(checked) => updateSetting("chartAnimations", checked)}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Compact Mode</p>
                  <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                </div>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
