import { NextRequest } from 'next/server'

// Prevent static generation for SSE endpoints
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const encoder = new TextEncoder()
      const data = `data: ${JSON.stringify({
        type: 'connection',
        message: 'Connected to AI Foundry events',
        timestamp: new Date().toISOString(),
      })}\n\n`
      
      controller.enqueue(encoder.encode(data))

      // Send periodic heartbeat
      const interval = setInterval(() => {
        const heartbeat = `data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
        })}\n\n`
        
        try {
          controller.enqueue(encoder.encode(heartbeat))
        } catch (error) {
          clearInterval(interval)
        }
      }, 30000) // Every 30 seconds

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, { headers })
}