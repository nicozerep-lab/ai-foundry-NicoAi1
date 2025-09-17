import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { azureApi } from '../services/api'
import { useWebSocket } from '../hooks/useWebSocket'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface ChatMessage {
  id: string
  message: string
  sender: 'user' | 'ai-node' | 'ai-python'
  timestamp: string
  model?: string
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedBackend, setSelectedBackend] = useState<'node' | 'python'>('node')
  
  const { sendAIChat, messages: wsMessages } = useWebSocket()

  // REST API mutations
  const nodeChatMutation = useMutation({
    mutationFn: (message: string) => azureApi.chatWithNode(message),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: data.data.id || Date.now().toString(),
        message: data.data.message,
        sender: 'ai-node',
        timestamp: data.data.timestamp,
        model: data.data.model
      }])
    }
  })

  const pythonChatMutation = useMutation({
    mutationFn: (message: string) => azureApi.chatWithPython(message),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: data.data.id || Date.now().toString(),
        message: data.data.message,
        sender: 'ai-python',
        timestamp: data.data.timestamp,
        model: data.data.model
      }])
    }
  })

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    // Send to selected backend
    if (selectedBackend === 'node') {
      nodeChatMutation.mutate(inputMessage)
    } else {
      pythonChatMutation.mutate(inputMessage)
    }

    setInputMessage('')
  }

  const handleWebSocketMessage = () => {
    if (!inputMessage.trim()) return

    sendAIChat(inputMessage)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }])
    setInputMessage('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>
        <p className="mt-1 text-sm text-gray-500">
          Test AI functionality with both Node.js and Python backends
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Backend selector */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="node"
                checked={selectedBackend === 'node'}
                onChange={(e) => setSelectedBackend(e.target.value as 'node')}
                className="mr-2"
              />
              Node.js Backend (REST)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="python"
                checked={selectedBackend === 'python'}
                onChange={(e) => setSelectedBackend(e.target.value as 'python')}
                className="mr-2"
              />
              Python Backend (REST)
            </label>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : message.sender === 'ai-node'
                    ? 'bg-green-100 text-green-900'
                    : 'bg-blue-100 text-blue-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {message.model && ` • ${message.model}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || nodeChatMutation.isPending || pythonChatMutation.isPending}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-1" />
              Send
            </button>
            <button
              onClick={handleWebSocketMessage}
              disabled={!inputMessage.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              WebSocket
            </button>
          </div>
        </div>
      </div>

      {/* WebSocket Messages */}
      {wsMessages.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">WebSocket Messages</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {wsMessages.slice(-10).map((msg, idx) => (
              <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                <strong>{msg.type}:</strong> {JSON.stringify(msg, null, 2)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}