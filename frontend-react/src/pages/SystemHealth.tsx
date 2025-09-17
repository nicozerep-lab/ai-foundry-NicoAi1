import { useQuery } from '@tanstack/react-query'
import { healthApi } from '../services/api'

export function SystemHealth() {
  const { data: nodeHealth, isLoading: nodeLoading } = useQuery({
    queryKey: ['node-system-info'],
    queryFn: () => healthApi.getNodeSystemInfo(),
    refetchInterval: 10000
  })

  const { data: pythonHealth, isLoading: pythonLoading } = useQuery({
    queryKey: ['python-system-info'],
    queryFn: () => healthApi.getPythonSystemInfo(),
    refetchInterval: 10000
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed system metrics and health information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node.js Backend */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Node.js Backend</h3>
            {nodeLoading ? (
              <div className="mt-5 text-center">Loading...</div>
            ) : nodeHealth ? (
              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Node Version:</span>
                  <span className="text-gray-900">{nodeHealth.data.nodeVersion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform:</span>
                  <span className="text-gray-900">{nodeHealth.data.platform}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Architecture:</span>
                  <span className="text-gray-900">{nodeHealth.data.arch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uptime:</span>
                  <span className="text-gray-900">{Math.round(nodeHealth.data.uptime)}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Memory Usage:</span>
                  <span className="text-gray-900">
                    {Math.round(nodeHealth.data.memory.used / 1024 / 1024)}MB
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-red-600">Failed to load Node.js health data</div>
            )}
          </div>
        </div>

        {/* Python Backend */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Python Backend</h3>
            {pythonLoading ? (
              <div className="mt-5 text-center">Loading...</div>
            ) : pythonHealth ? (
              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Python Version:</span>
                  <span className="text-gray-900">{pythonHealth.data.python_version?.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform:</span>
                  <span className="text-gray-900">{pythonHealth.data.platform?.system}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Memory Usage:</span>
                  <span className="text-gray-900">{pythonHealth.data.memory?.percent?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disk Usage:</span>
                  <span className="text-gray-900">{pythonHealth.data.disk?.percent?.toFixed(1)}%</span>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-red-600">Failed to load Python health data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}