"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { icon: BarChart3, label: "Overview", id: "overview" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: DollarSign, label: "Revenue", id: "revenue" },
  { icon: Settings, label: "Settings", id: "settings" },
]

interface DashboardSidebarProps {
  activeView?: string
  onViewChange?: (view: string) => void
}

export function DashboardSidebar({ activeView = "overview", onViewChange }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNavClick = (itemId: string) => {
    onViewChange?.(itemId)
  }

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full glass-card border-r border-border/50 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "lg:relative lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary neon-glow" />
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    CyberDash
                  </span>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover:bg-primary/10 hover:neon-glow"
              >
                {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant={activeView === item.id ? "default" : "ghost"}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full justify-start transition-all duration-300",
                  activeView === item.id
                    ? "bg-primary/20 text-primary border border-primary/30 neon-glow"
                    : "hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                  isCollapsed && "px-2",
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && item.label}
              </Button>
            ))}
          </nav>

          {/* Status indicator */}
          <div className="p-4 border-t border-border/50">
            <div
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20",
                isCollapsed && "justify-center",
              )}
            >
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {!isCollapsed && (
                <div>
                  <p className="text-xs font-medium text-secondary">System Online</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
