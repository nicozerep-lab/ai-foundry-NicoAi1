import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { authOptions } from '@/lib/auth'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Example: List issues from this repository
    const owner = 'nicozerep-lab'
    const repo = 'ai-foundry-NicoAi1'
    
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 10,
    })

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      issues: issues.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        state: issue.state,
        created_at: issue.created_at,
        user: issue.user?.login,
        html_url: issue.html_url,
      })),
    })
  } catch (error) {
    console.error('GitHub API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub issues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, body, owner, repo } = await request.json()
    
    if (!title || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields: title, owner, repo' },
        { status: 400 }
      )
    }

    const { data: issue } = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body: body || '',
    })

    return NextResponse.json({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      html_url: issue.html_url,
      created_at: issue.created_at,
    })
  } catch (error) {
    console.error('GitHub Create Issue Error:', error)
    return NextResponse.json(
      { error: 'Failed to create GitHub issue' },
      { status: 500 }
    )
  }
}