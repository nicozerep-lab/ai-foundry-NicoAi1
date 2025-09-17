import { NextResponse } from 'next/server'
import { modelRouter } from '@/lib/providers/router'

export async function GET() {
  try {
    const providers = modelRouter.listProviders()
    const models = await modelRouter.listAllModels()

    return NextResponse.json({
      providers,
      models,
      count: providers.length,
    })
  } catch (error) {
    console.error('Models API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}