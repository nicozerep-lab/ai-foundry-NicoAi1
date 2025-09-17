import { useState } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'

export function WebSocketTest() {
  const [message, setMessage] = useState('')
  const { 
    isConnected, 
    messages, 
    sendMessage, 
    sendAIChat, 
    clearMessages,
    connect,
    disconnect 
  } = useWebSocket()

  const handleSendMessage = () => {
    if (!message.trim()) return
    sendMessage(message)
    setMessage('')
  }

  const handleSendAIMessage = () => {
    if (!message.trim()) return
    sendAIChat(message)
    setMessage('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WebSocket Test</h1>
        <p className="mt-1 text-sm text-gray-500">
          Test WebSocket connections with the Node.js backend
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm font-medium text-gray-900">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="space-x-2">
            <button
              onClick={connect}
              disabled={isConnected}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Connect
            </button>
            <button
              onClick={disconnect}
              disabled={!isConnected}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              Disconnect
            </button>
            <button
              onClick={clearMessages}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Clear Messages
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Messages ({messages.length})</h3>
        </div>
        <div className="h-64 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-indigo-600">{msg.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="mt-1 text-gray-700 whitespace-pre-wrap text-xs">
                    {JSON.stringify(msg, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Message */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || !message.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
            <button
              onClick={handleSendAIMessage}
              disabled={!isConnected || !message.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send AI Chat
            </button>
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Test Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => sendMessage('Hello from React!')}
            disabled={!isConnected}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Send Hello
          </button>
          <button
            onClick={() => sendAIChat('What is AI?')}
            disabled={!isConnected}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Ask AI Question
          </button>
          <button
            onClick={() => sendMessage('Test message ' + Date.now())}
            disabled={!isConnected}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Send Test Message
          </button>
        </div>
      </div>
    </div>
  )
}