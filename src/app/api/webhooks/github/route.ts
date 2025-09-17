import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    // Verify GitHub webhook signature
    const secret = process.env.GITHUB_WEBHOOK_SECRET
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const hmac = createHmac('sha256', secret)
    hmac.update(payload)
    const expectedSignature = `sha256=${hmac.digest('hex')}`

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse and process the webhook
    const data = JSON.parse(payload)
    
    console.log('GitHub webhook received:', {
      action: data.action,
      repository: data.repository?.name,
      sender: data.sender?.login,
    })

    // Handle different event types
    switch (data.action) {
      case 'opened':
        if (data.issue) {
          console.log('New issue opened:', data.issue.title)
        } else if (data.pull_request) {
          console.log('New PR opened:', data.pull_request.title)
        }
        break
      case 'closed':
        if (data.issue) {
          console.log('Issue closed:', data.issue.title)
        } else if (data.pull_request) {
          console.log('PR closed:', data.pull_request.title)
        }
        break
      default:
        console.log('Unhandled GitHub action:', data.action)
    }

    return NextResponse.json({ message: 'Webhook processed' })
  } catch (error) {
    console.error('GitHub webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}