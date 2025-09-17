import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { modelRouter } from '@/lib/providers/router'
import { generateRequestSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = generateRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { provider, model, input, max_tokens, temperature } = validation.data

    // Check if provider is available
    const providerInstance = modelRouter.getProvider(provider)
    if (!providerInstance) {
      return NextResponse.json(
        { error: `Provider ${provider} not available` },
        { status: 400 }
      )
    }

    // Generate AI response
    const result = await modelRouter.generate(provider, model, input, {
      max_tokens,
      temperature,
    })

    // Log usage event
    try {
      await prisma.usageEvent.create({
        data: {
          userId: session.user.id,
          provider,
          model,
          inputTokens: result.usage?.input_tokens,
          outputTokens: result.usage?.output_tokens,
          metadata: JSON.stringify({ max_tokens, temperature }),
        },
      })
    } catch (dbError) {
      console.error('Failed to log usage event:', dbError)
      // Continue even if logging fails
    }

    return NextResponse.json({
      text: result.text,
      usage: result.usage,
      provider,
      model,
    })
  } catch (error) {
    console.error('Generate API Error:', error)
    return NextResponse.json(
      { 
        error: 'Generation failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}