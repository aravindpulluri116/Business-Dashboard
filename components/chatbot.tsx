"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotProps {
  onDataRefresh?: () => void
}

export function Chatbot({ onDataRefresh }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you with your dashboard today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message:", inputValue)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
          userId: "dashboard-user",
        }),
      })

      console.log("[v0] API response status:", response.status)

      let botResponse = "I received your message! How else can I help you?"

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] API response data:", data)
        botResponse = data.output || data.response || data.message || botResponse
      } else {
        const errorData = await response.json()
        console.log("[v0] API error data:", errorData)
        botResponse = "Sorry, I'm having trouble connecting to the webhook. Please try again later."
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      if (onDataRefresh) {
        console.log("[v0] Triggering data refresh after webhook response")
        onDataRefresh()
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Set unread messages when chat is closed and new messages arrive
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasUnreadMessages(true)
    } else if (isOpen) {
      setHasUnreadMessages(false)
    }
  }, [messages, isOpen])

  return (
    <>
      {/* Fixed Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "shadow-2xl border-2 border-white",
          "transition-all duration-300 transform hover:scale-110",
          "animate-pulse hover:animate-none",
          isOpen && "rotate-180 scale-110"
        )}
        style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999 }}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
        
        {/* Notification Badge */}
        {hasUnreadMessages && !isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        )}
      </Button>

      {/* Fixed Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-32 right-8 z-[9998] w-[420px] h-[600px]",
            "bg-white dark:bg-gray-900 border-2 border-blue-500 shadow-2xl",
            "rounded-xl overflow-hidden"
          )}
          style={{ position: 'fixed', bottom: '128px', right: '32px', zIndex: 9998 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-800 dark:text-white">AI Assistant</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Online & Ready to Help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.sender === "user" && "flex-row-reverse space-x-reverse",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-white",
                  )}
                >
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm",
                    message.sender === "user" 
                      ? "bg-blue-600 text-white ml-auto" 
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600",
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
                    <div
                      className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/50">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your dashboard..."
                className="flex-1 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:border-blue-500 dark:focus:border-blue-400"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}

