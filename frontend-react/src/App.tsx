import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { SystemHealth } from './pages/SystemHealth'
import { AIChat } from './pages/AIChat'
import { GitHubIntegration } from './pages/GitHubIntegration'
import { WebSocketTest } from './pages/WebSocketTest'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/health" element={<SystemHealth />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/github" element={<GitHubIntegration />} />
            <Route path="/websocket" element={<WebSocketTest />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
