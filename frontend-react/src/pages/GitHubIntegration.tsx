import { useQuery } from '@tanstack/react-query'
import { githubApi } from '../services/api'

export function GitHubIntegration() {
  const { data: nodeUser, isLoading: nodeUserLoading } = useQuery({
    queryKey: ['node-github-user'],
    queryFn: () => githubApi.getNodeUser(),
    retry: 1
  })

  const { data: pythonUser, isLoading: pythonUserLoading } = useQuery({
    queryKey: ['python-github-user'],
    queryFn: () => githubApi.getPythonUser(),
    retry: 1
  })

  const { data: nodeRepos, isLoading: nodeReposLoading } = useQuery({
    queryKey: ['node-github-repos'],
    queryFn: () => githubApi.getNodeRepos(),
    retry: 1
  })

  const { data: pythonRepos, isLoading: pythonReposLoading } = useQuery({
    queryKey: ['python-github-repos'],
    queryFn: () => githubApi.getPythonRepos(),
    retry: 1
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GitHub Integration</h1>
        <p className="mt-1 text-sm text-gray-500">
          GitHub API integration status and repository information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Node.js GitHub Integration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Node.js Backend</h3>
            
            {nodeUserLoading ? (
              <div className="mt-5 text-center">Loading user data...</div>
            ) : nodeUser ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={nodeUser.data.avatar_url} 
                    alt="Avatar" 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{nodeUser.data.name}</div>
                    <div className="text-sm text-gray-500">@{nodeUser.data.login}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-medium text-gray-900">{nodeUser.data.public_repos}</div>
                    <div className="text-sm text-gray-500">Repos</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">{nodeUser.data.followers}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">{nodeUser.data.following}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-red-600">GitHub integration not configured</div>
            )}

            {/* Repositories */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900">Recent Repositories</h4>
              {nodeReposLoading ? (
                <div className="mt-3 text-center">Loading repositories...</div>
              ) : nodeRepos ? (
                <div className="mt-3 space-y-2">
                  {nodeRepos.data.slice(0, 5).map((repo: any) => (
                    <div key={repo.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                        <div className="text-xs text-gray-500">{repo.description}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        ⭐ {repo.stargazers_count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-gray-500">No repositories found</div>
              )}
            </div>
          </div>
        </div>

        {/* Python GitHub Integration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Python Backend</h3>
            
            {pythonUserLoading ? (
              <div className="mt-5 text-center">Loading user data...</div>
            ) : pythonUser ? (
              <div className="mt-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={pythonUser.data.avatar_url} 
                    alt="Avatar" 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{pythonUser.data.name}</div>
                    <div className="text-sm text-gray-500">@{pythonUser.data.login}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-medium text-gray-900">{pythonUser.data.public_repos}</div>
                    <div className="text-sm text-gray-500">Repos</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">{pythonUser.data.followers}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">{pythonUser.data.following}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 text-red-600">GitHub integration not configured</div>
            )}

            {/* Repositories */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900">Recent Repositories</h4>
              {pythonReposLoading ? (
                <div className="mt-3 text-center">Loading repositories...</div>
              ) : pythonRepos ? (
                <div className="mt-3 space-y-2">
                  {pythonRepos.data.slice(0, 5).map((repo: any) => (
                    <div key={repo.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{repo.name}</div>
                        <div className="text-xs text-gray-500">{repo.description}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        ⭐ {repo.stargazers_count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-gray-500">No repositories found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}