"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  searchTerm: string
  category: string
  status: string
  paymentMethod: string
  dateRange: string
}

export function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "all",
    status: "all",
    paymentMethod: "all",
    dateRange: "all",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      category: "all",
      status: "all",
      paymentMethod: "all",
      dateRange: "all",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "" && value !== "all").length

  return (
    <Card className="glass-card border-border/50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80"
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, items..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="pl-10 glass border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.status === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", filters.status === "completed" ? "all" : "completed")}
              className={cn(
                "glass border-border/50",
                filters.status === "completed" && "bg-secondary/20 text-secondary border-secondary/30 neon-glow-teal",
              )}
            >
              Completed
            </Button>
            <Button
              variant={filters.status === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", filters.status === "pending" ? "all" : "pending")}
              className={cn(
                "glass border-border/50",
                filters.status === "pending" && "bg-primary/20 text-primary border-primary/30 neon-glow",
              )}
            >
              Pending
            </Button>
            <Button
              variant={filters.dateRange === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("dateRange", filters.dateRange === "today" ? "all" : "today")}
              className={cn(
                "glass border-border/50",
                filters.dateRange === "today" && "bg-primary/20 text-primary border-primary/30 neon-glow",
              )}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </Button>
          </div>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger className="glass border-border/50 focus:border-primary/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.paymentMethod} onValueChange={(value) => updateFilter("paymentMethod", value)}>
                <SelectTrigger className="glass border-border/50 focus:border-primary/50">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                <SelectTrigger className="glass border-border/50 focus:border-primary/50">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
