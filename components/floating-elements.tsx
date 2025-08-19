"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    const colors = ["primary", "secondary", "accent"]
    const newElements: FloatingElement[] = []

    for (let i = 0; i < 6; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className={cn(
            "absolute rounded-full opacity-10 blur-sm",
            element.color === "primary" && "bg-primary",
            element.color === "secondary" && "bg-secondary",
            element.color === "accent" && "bg-accent",
          )}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animation: `float ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
