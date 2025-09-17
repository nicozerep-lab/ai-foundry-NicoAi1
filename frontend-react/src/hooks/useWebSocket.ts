import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface WebSocketMessage {
  type: string
  message?: string
  timestamp: string
  [key: string]: any
}

interface UseWebSocketOptions {
  url?: string
  autoConnect?: boolean
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { 
    url = import.meta.env.VITE_NODE_WS_URL || 'http://localhost:3001',
    autoConnect = true 
  } = options

  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!autoConnect) return

    const newSocket = io(url, {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      console.log('WebSocket connected')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    })

    newSocket.on('connect_error', (err) => {
      setError(err.message)
      console.error('WebSocket connection error:', err)
    })

    // Listen for all message types
    newSocket.onAny((eventName, data) => {
      setMessages(prev => [...prev, {
        type: eventName,
        timestamp: new Date().toISOString(),
        ...data
      }])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [url, autoConnect])

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit('message', { message, timestamp: new Date().toISOString() })
    }
  }

  const sendAIChat = (message: string, model = 'gpt-3.5-turbo') => {
    if (socket && isConnected) {
      socket.emit('ai-chat', { message, model, timestamp: new Date().toISOString() })
    }
  }

  const joinRoom = (room: string) => {
    if (socket && isConnected) {
      socket.emit('join-github-events')
      console.log(`Joining room: ${room}`)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  const connect = () => {
    if (!socket) {
      const newSocket = io(url, {
        transports: ['websocket', 'polling']
      })
      setSocket(newSocket)
    } else {
      socket.connect()
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
    }
  }

  return {
    socket,
    isConnected,
    messages,
    error,
    sendMessage,
    sendAIChat,
    joinRoom,
    clearMessages,
    connect,
    disconnect
  }
}