import { useQuery } from '@tanstack/react-query'
import { healthApi, azureApi } from '../services/api'
import { 
  CheckCircleIcon, 
  XCircleIcon,
  CloudIcon,
  ServerIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  url?: string
  error?: string
}

export function Dashboard() {
  // Health checks
  const { data: nodeHealth, isError: nodeError } = useQuery({
    queryKey: ['node-health'],
    queryFn: () => healthApi.checkNodeHealth(),
    refetchInterval: 30000,
    retry: 1
  })

  const { data: pythonHealth, isError: pythonError } = useQuery({
    queryKey: ['python-health'],
    queryFn: () => healthApi.checkPythonHealth(),
    refetchInterval: 30000,
    retry: 1
  })

  // Azure config
  const { data: nodeAzureConfig } = useQuery({
    queryKey: ['node-azure-config'],
    queryFn: () => azureApi.getNodeConfig(),
    retry: 1
  })

  const { data: pythonAzureConfig } = useQuery({
    queryKey: ['python-azure-config'],
    queryFn: () => azureApi.getPythonConfig(),
    retry: 1
  })

  const services: ServiceStatus[] = [
    {
      name: 'Node.js Backend',
      status: nodeError ? 'unhealthy' : nodeHealth ? 'healthy' : 'unknown',
      url: 'http://localhost:3001',
      error: nodeError ? 'Connection failed' : undefined
    },
    {
      name: 'Python Backend',
      status: pythonError ? 'unhealthy' : pythonHealth ? 'healthy' : 'unknown',
      url: 'http://localhost:8000',
      error: pythonError ? 'Connection failed' : undefined
    },
    {
      name: 'Azure AI Foundry (Node)',
      status: nodeAzureConfig?.data?.configured ? 'healthy' : 'unhealthy',
      error: !nodeAzureConfig?.data?.configured ? 'Not configured' : undefined
    },
    {
      name: 'Azure AI Foundry (Python)',
      status: pythonAzureConfig?.data?.configured ? 'healthy' : 'unhealthy',
      error: !pythonAzureConfig?.data?.configured ? 'Not configured' : undefined
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Foundry Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor the health and status of your AI Foundry services
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  System Overview
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {services.filter(s => s.status === 'healthy').length} of {services.length} services healthy
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickActionCard
              title="Test AI Chat"
              description="Test AI functionality"
              href="/ai-chat"
              icon={CloudIcon}
            />
            <QuickActionCard
              title="GitHub Integration"
              description="View repositories and webhooks"
              href="/github"
              icon={CodeBracketIcon}
            />
            <QuickActionCard
              title="System Health"
              description="Detailed system metrics"
              href="/health"
              icon={ServerIcon}
            />
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Environment Information</h3>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Node.js Backend:</span>
              <span className="text-gray-900">
                {nodeHealth?.data?.environment || 'Unknown'}
                {nodeHealth?.data?.version && ` (${nodeHealth.data.version})`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Python Backend:</span>
              <span className="text-gray-900">
                {pythonHealth?.data?.environment || 'Unknown'}
                {pythonHealth?.data?.version && ` (${pythonHealth.data.version})`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Updated:</span>
              <span className="text-gray-900">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: ServiceStatus }) {
  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />
      case 'unhealthy':
        return <XCircleIcon className="h-6 w-6 text-red-400" />
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
    }
  }

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-800 bg-green-100'
      case 'unhealthy':
        return 'text-red-800 bg-red-100'
      default:
        return 'text-yellow-800 bg-yellow-100'
    }
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getStatusIcon(service.status)}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {service.name}
              </dt>
              <dd className="flex items-center text-sm text-gray-900">
                <span className={clsx(
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize',
                  getStatusColor(service.status)
                )}>
                  {service.status}
                </span>
                {service.url && (
                  <span className="ml-2 text-gray-500">{service.url}</span>
                )}
              </dd>
              {service.error && (
                <dd className="text-sm text-red-600 mt-1">{service.error}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon: Icon 
}: { 
  title: string
  description: string
  href: string
  icon: typeof CloudIcon
}) {
  return (
    <a
      href={href}
      className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 rounded-lg border border-gray-200"
    >
      <div>
        <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </a>
  )
}

function ChartBarIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}