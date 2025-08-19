import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Sending message to webhook:", body)

    const response = await fetch("https://n8n-rovg.onrender.com/webhook/8c6816cf-6e2d-4aa5-9855-077d133d3917", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Webhook response status:", response.status)

    if (!response.ok) {
      console.log("[v0] Webhook error:", response.statusText)
      return NextResponse.json(
        { error: "Webhook request failed", status: response.status },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[v0] Webhook response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
