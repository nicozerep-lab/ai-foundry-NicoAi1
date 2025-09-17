# AI Model Providers Setup Guide

This guide covers configuring AI model providers for your AI Foundry application.

## Overview

AI Foundry supports three major AI providers:
- **OpenAI** - GPT-3.5, GPT-4, and other OpenAI models
- **Azure OpenAI** - OpenAI models hosted on Microsoft Azure
- **Hugging Face** - Open source and community models

## OpenAI Setup

### Get API Key

1. **Create Account** at [platform.openai.com](https://platform.openai.com)
2. **Navigate to API Keys** in your account settings
3. **Create New Secret Key**
4. **Copy the key** (starts with `sk-`)

### Environment Variables

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional, defaults to OpenAI
```

### Available Models

- `gpt-3.5-turbo` - Fast, cost-effective for most tasks
- `gpt-4` - Most capable model for complex tasks  
- `gpt-4-turbo` - Latest GPT-4 with improved performance
- `gpt-4o` - Optimized for speed and efficiency

### Usage Limits

- **Free tier**: $5 in free credits for new accounts
- **Pay-as-you-go**: Based on tokens processed
- **Rate limits**: Varies by model and tier

### Example Usage

```typescript
const result = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    input: 'Explain quantum computing',
    max_tokens: 150,
    temperature: 0.7
  })
});
```

## Azure OpenAI Setup

### Create Azure OpenAI Resource

1. **Azure Portal** → Create Resource → Search "OpenAI"
2. **Create Azure OpenAI** resource
3. **Choose region** with availability
4. **Select pricing tier**

### Deploy Models

1. **Go to Azure OpenAI Studio**
2. **Navigate to Deployments**
3. **Create New Deployment**:
   - Model: gpt-35-turbo or gpt-4
   - Deployment name: e.g., "gpt-35-turbo-prod"
   - Version: Latest available

### Get Credentials

1. **Resource → Keys and Endpoint**
2. **Copy Key 1** and **Endpoint URL**

### Environment Variables

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-api-key
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
```

### API Versions

Azure OpenAI uses API versions:
- `2024-02-15-preview` - Latest preview
- `2023-12-01-preview` - Stable version

### Example Usage

```typescript
const result = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'azure-openai',
    model: 'gpt-35-turbo-prod', // Your deployment name
    input: 'Explain machine learning',
    max_tokens: 150
  })
});
```

## Hugging Face Setup

### Get API Token

1. **Create Account** at [huggingface.co](https://huggingface.co)
2. **Settings → Access Tokens**
3. **Create New Token** with read permissions
4. **Copy token** (starts with `hf_`)

### Environment Variables

```bash
HUGGINGFACE_API_KEY=hf_your-huggingface-token-here
```

### Available Models

Popular text generation models:
- `microsoft/DialoGPT-medium` - Conversational AI
- `EleutherAI/gpt-neo-2.7B` - Open source GPT-like model
- `gpt2` - Classic OpenAI GPT-2
- `distilgpt2` - Smaller, faster version of GPT-2

### Model Selection

Choose models based on:
- **Task requirements** (conversation, completion, etc.)
- **Model size** vs **response speed**
- **Language support**
- **License compatibility**

### Example Usage

```typescript
const result = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'huggingface',
    model: 'microsoft/DialoGPT-medium',
    input: 'Hello, how are you?',
    max_tokens: 50
  })
});
```

## Provider Configuration

### Model Router

The application uses a router to manage providers:

```typescript
// src/lib/providers/router.ts
export class ModelRouter {
  private providers: Map<string, AIProvider> = new Map()

  constructor() {
    // Providers are initialized based on available environment variables
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider())
    }
    // ... other providers
  }
}
```

### Provider Interface

All providers implement a common interface:

```typescript
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
```

## Cost Management

### OpenAI Pricing

- **GPT-3.5 Turbo**: $0.001 per 1K tokens
- **GPT-4**: $0.03 per 1K tokens (input), $0.06 (output)
- **GPT-4 Turbo**: $0.01 per 1K tokens (input), $0.03 (output)

### Azure OpenAI Pricing

- Similar to OpenAI but may have different regional pricing
- Includes Azure infrastructure costs
- Volume discounts available

### Hugging Face Pricing

- **Free tier**: Rate-limited inference
- **Pro tier**: $9/month for faster inference
- **Enterprise**: Custom pricing

### Cost Optimization

1. **Model Selection**
   - Use GPT-3.5 for simple tasks
   - Reserve GPT-4 for complex reasoning

2. **Token Management**
   - Set appropriate `max_tokens` limits
   - Optimize prompts for efficiency

3. **Caching**
   - Cache common responses
   - Implement response deduplication

4. **Usage Monitoring**
   - Track usage per user/endpoint
   - Set spending alerts
   - Implement usage quotas

## Error Handling

### Common Errors

1. **API Key Invalid**
   ```typescript
   // Check API key format and validity
   if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
     throw new Error('Invalid OpenAI API key format')
   }
   ```

2. **Rate Limiting**
   ```typescript
   // Implement exponential backoff
   const retryWithBackoff = async (fn: Function, retries = 3) => {
     try {
       return await fn()
     } catch (error) {
       if (retries > 0 && error.status === 429) {
         await new Promise(resolve => setTimeout(resolve, 1000))
         return retryWithBackoff(fn, retries - 1)
       }
       throw error
     }
   }
   ```

3. **Model Not Found**
   ```typescript
   // Validate model availability
   const availableModels = await provider.listModels()
   if (!availableModels.includes(model)) {
     throw new Error(`Model ${model} not available`)
   }
   ```

### Fallback Strategy

```typescript
const generateWithFallback = async (input: string) => {
  const providers = ['openai', 'azure-openai', 'huggingface']
  
  for (const providerName of providers) {
    try {
      const provider = modelRouter.getProvider(providerName)
      if (provider) {
        return await provider.generate(input, 'default-model')
      }
    } catch (error) {
      console.warn(`Provider ${providerName} failed:`, error)
      continue
    }
  }
  
  throw new Error('All providers failed')
}
```

## Testing

### Unit Tests

```typescript
// Test provider initialization
describe('OpenAI Provider', () => {
  it('should initialize with valid API key', () => {
    process.env.OPENAI_API_KEY = 'sk-test-key'
    const provider = new OpenAIProvider()
    expect(provider.name).toBe('openai')
  })
})
```

### Integration Tests

```typescript
// Test actual API calls (use test keys)
describe('API Integration', () => {
  it('should generate text with OpenAI', async () => {
    const result = await openaiProvider.generate('Hello', 'gpt-3.5-turbo')
    expect(result.text).toBeDefined()
    expect(result.usage).toBeDefined()
  })
})
```

## Monitoring

### Usage Tracking

```typescript
// Log usage events to database
await prisma.usageEvent.create({
  data: {
    userId: user.id,
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    inputTokens: result.usage.input_tokens,
    outputTokens: result.usage.output_tokens,
    cost: calculateCost(result.usage, 'gpt-3.5-turbo')
  }
})
```

### Health Checks

```typescript
// Check provider availability
export const checkProviderHealth = async () => {
  const results = {}
  
  for (const [name, provider] of modelRouter.providers) {
    try {
      await provider.listModels()
      results[name] = 'healthy'
    } catch (error) {
      results[name] = 'unhealthy'
    }
  }
  
  return results
}
```

## Production Checklist

- [ ] API keys secured in environment variables
- [ ] Rate limiting implemented
- [ ] Error handling and fallbacks configured
- [ ] Usage monitoring set up
- [ ] Cost alerts configured
- [ ] Model selection optimized for use cases
- [ ] Backup providers configured
- [ ] Response caching implemented
- [ ] Security headers configured
- [ ] Logging and monitoring active

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Azure OpenAI Documentation](https://docs.microsoft.com/azure/cognitive-services/openai/)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [AI Provider Comparison](https://artificialanalysis.ai/)