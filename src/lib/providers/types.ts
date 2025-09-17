export interface AIProvider {
  name: string
  generate(input: string, model: string, options?: any): Promise<{
    text: string
    usage?: {
      input_tokens: number
      output_tokens: number
    }
  }>
  listModels(): Promise<string[]>
}

export interface GenerateOptions {
  max_tokens?: number
  temperature?: number
  stream?: boolean
}