"use client"

import { useState, useEffect } from "react"

interface WidgetSettings {
  showRevenueTrend: boolean
  showCategoryChart: boolean
  showStatusChart: boolean
  showRecentOrders: boolean
  refreshInterval: number
  chartAnimations: boolean
  compactMode: boolean
}

const defaultSettings: WidgetSettings = {
  showRevenueTrend: true,
  showCategoryChart: true,
  showStatusChart: true,
  showRecentOrders: true,
  refreshInterval: 5,
  chartAnimations: true,
  compactMode: false,
}

export function useWidgetSettings() {
  const [settings, setSettings] = useState<WidgetSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("dashboard-widget-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dashboard-widget-settings", JSON.stringify(settings))
  }, [settings])

  return {
    settings,
    updateSettings: setSettings,
  }
}
