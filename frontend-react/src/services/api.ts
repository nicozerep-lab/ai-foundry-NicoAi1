import axios from 'axios'

// Get API base URLs from environment variables or use defaults
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3001'
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000'

// Create axios instances for both backends
export const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptors for error handling
nodeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Node API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

pythonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Python API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Health check endpoints
export const healthApi = {
  checkNodeHealth: () => nodeApi.get('/health'),
  checkPythonHealth: () => pythonApi.get('/health'),
  getNodeSystemInfo: () => nodeApi.get('/api/system/info'),
  getPythonSystemInfo: () => pythonApi.get('/api/system/info'),
}

// Azure AI endpoints
export const azureApi = {
  getNodeConfig: () => nodeApi.get('/api/azure/config'),
  getPythonConfig: () => pythonApi.get('/api/azure/config'),
  chatWithNode: (message: string, model?: string) => 
    nodeApi.post('/api/ai/chat', { message, model }),
  chatWithPython: (message: string, model?: string) => 
    pythonApi.post('/api/azure/chat', { message, model }),
  getPythonModels: () => pythonApi.get('/api/azure/models'),
  getPythonDeploymentStatus: () => pythonApi.get('/api/azure/deployment/status'),
}

// GitHub endpoints
export const githubApi = {
  getNodeUser: () => nodeApi.get('/api/github/user'),
  getPythonUser: () => pythonApi.get('/api/github/user'),
  getNodeRepos: () => nodeApi.get('/api/github/repos'),
  getPythonRepos: (limit = 30, page = 1) => 
    pythonApi.get(`/api/github/repos?limit=${limit}&page=${page}`),
  getPythonGitHubStatus: () => pythonApi.get('/api/github/status'),
}