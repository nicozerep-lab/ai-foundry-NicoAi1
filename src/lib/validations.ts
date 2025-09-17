import { z } from 'zod'

export const generateRequestSchema = z.object({
  provider: z.enum(['openai', 'azure-openai', 'huggingface']),
  model: z.string().min(1),
  input: z.string().min(1),
  max_tokens: z.number().optional().default(100),
  temperature: z.number().min(0).max(2).optional().default(0.7),
})

export const webhookGitHubSchema = z.object({
  action: z.string(),
  repository: z.object({
    name: z.string(),
    full_name: z.string(),
  }),
})

export const webhookStripeSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
})

export type GenerateRequest = z.infer<typeof generateRequestSchema>
export type GitHubWebhook = z.infer<typeof webhookGitHubSchema>
export type StripeWebhook = z.infer<typeof webhookStripeSchema>