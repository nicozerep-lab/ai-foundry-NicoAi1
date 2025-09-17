import OpenAI from 'openai'
import { AIProvider, GenerateOptions } from './types'

export class OpenAIProvider implements AIProvider {
  name = 'openai'
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    })
  }

  async generate(input: string, model: string, options: GenerateOptions = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: input }],
        max_tokens: options.max_tokens || 100,
        temperature: options.temperature || 0.7,
      })

      const choice = response.choices[0]
      if (!choice?.message?.content) {
        throw new Error('No response from OpenAI')
      }

      return {
        text: choice.message.content,
        usage: {
          input_tokens: response.usage?.prompt_tokens || 0,
          output_tokens: response.usage?.completion_tokens || 0,
        },
      }
    } catch (error) {
      console.error('OpenAI Provider Error:', error)
      throw new Error(`OpenAI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list()
      return models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => model.id)
        .sort()
    } catch (error) {
      console.error('OpenAI Models Error:', error)
      return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] // fallback
    }
  }
}