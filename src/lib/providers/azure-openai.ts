import OpenAI from 'openai'
import { AIProvider, GenerateOptions } from './types'

export class AzureOpenAIProvider implements AIProvider {
  name = 'azure-openai'
  private client: OpenAI

  constructor() {
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
      throw new Error('Azure OpenAI configuration missing')
    }

    this.client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      },
    })
  }

  async generate(input: string, model: string, options: GenerateOptions = {}) {
    try {
      // Use deployment name for Azure OpenAI
      const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || model

      const response = await this.client.chat.completions.create({
        model: deploymentName,
        messages: [{ role: 'user', content: input }],
        max_tokens: options.max_tokens || 100,
        temperature: options.temperature || 0.7,
      })

      const choice = response.choices[0]
      if (!choice?.message?.content) {
        throw new Error('No response from Azure OpenAI')
      }

      return {
        text: choice.message.content,
        usage: {
          input_tokens: response.usage?.prompt_tokens || 0,
          output_tokens: response.usage?.completion_tokens || 0,
        },
      }
    } catch (error) {
      console.error('Azure OpenAI Provider Error:', error)
      throw new Error(`Azure OpenAI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async listModels(): Promise<string[]> {
    // Azure OpenAI uses deployment names, return common deployment names
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT
    return deploymentName ? [deploymentName] : ['gpt-35-turbo', 'gpt-4']
  }
}