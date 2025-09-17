import { OpenAIProvider } from './openai'
import { AzureOpenAIProvider } from './azure-openai'
import { HuggingFaceProvider } from './huggingface'
import { AIProvider } from './types'

export class ModelRouter {
  private providers: Map<string, AIProvider> = new Map()

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    try {
      if (process.env.OPENAI_API_KEY) {
        this.providers.set('openai', new OpenAIProvider())
      }
    } catch (error) {
      console.warn('Failed to initialize OpenAI provider:', error)
    }

    try {
      if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY) {
        this.providers.set('azure-openai', new AzureOpenAIProvider())
      }
    } catch (error) {
      console.warn('Failed to initialize Azure OpenAI provider:', error)
    }

    try {
      if (process.env.HUGGINGFACE_API_KEY) {
        this.providers.set('huggingface', new HuggingFaceProvider())
      }
    } catch (error) {
      console.warn('Failed to initialize Hugging Face provider:', error)
    }
  }

  getProvider(name: string): AIProvider | null {
    return this.providers.get(name) || null
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  async listAllModels(): Promise<Record<string, string[]>> {
    const models: Record<string, string[]> = {}
    
    for (const [name, provider] of this.providers) {
      try {
        models[name] = await provider.listModels()
      } catch (error) {
        console.error(`Failed to list models for ${name}:`, error)
        models[name] = []
      }
    }
    
    return models
  }

  async generate(
    provider: string,
    model: string,
    input: string,
    options?: any
  ) {
    const providerInstance = this.getProvider(provider)
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not available`)
    }

    return providerInstance.generate(input, model, options)
  }
}

// Singleton instance
export const modelRouter = new ModelRouter()