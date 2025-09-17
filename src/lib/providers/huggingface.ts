import { HfInference } from '@huggingface/inference'
import { AIProvider, GenerateOptions } from './types'

export class HuggingFaceProvider implements AIProvider {
  name = 'huggingface'
  private client: HfInference

  constructor() {
    this.client = new HfInference(process.env.HUGGINGFACE_API_KEY)
  }

  async generate(input: string, model: string, options: GenerateOptions = {}) {
    try {
      const response = await this.client.textGeneration({
        model,
        inputs: input,
        parameters: {
          max_new_tokens: options.max_tokens || 100,
          temperature: options.temperature || 0.7,
          return_full_text: false,
        },
      })

      if (!response.generated_text) {
        throw new Error('No response from Hugging Face')
      }

      return {
        text: response.generated_text,
        usage: {
          input_tokens: input.split(' ').length, // rough estimation
          output_tokens: response.generated_text.split(' ').length,
        },
      }
    } catch (error) {
      console.error('Hugging Face Provider Error:', error)
      throw new Error(`Hugging Face generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async listModels(): Promise<string[]> {
    // Common text generation models available on Hugging Face
    return [
      'microsoft/DialoGPT-medium',
      'EleutherAI/gpt-neo-2.7B',
      'microsoft/DialoGPT-large',
      'gpt2',
      'distilgpt2',
    ]
  }
}