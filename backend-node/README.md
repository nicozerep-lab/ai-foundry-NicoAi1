# Node.js Backend

This is the Node.js Express backend service with REST API, WebSocket support, and GitHub integration.

## Features

- **REST API**: Express.js server with comprehensive API endpoints
- **WebSocket Support**: Real-time communication using Socket.io
- **GitHub Integration**: Octokit client and webhook handling
- **Azure AI Integration**: Placeholder endpoints for Azure AI Foundry/Studio
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Error Handling**: Comprehensive error handling and logging

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Azure AI Configuration
AZURE_AI_FOUNDRY_ENDPOINT=https://your-ai-foundry.openai.azure.com/
AZURE_AI_STUDIO_ENDPOINT=https://your-ai-studio.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_REGION=eastus

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Azure AI
- `GET /api/azure/config` - Get Azure AI configuration
- `POST /api/ai/chat` - AI chat endpoint (placeholder)

### GitHub
- `GET /api/github/user` - Get authenticated GitHub user
- `GET /api/github/repos` - Get user repositories

### System
- `GET /api/system/info` - Get system information

### Webhooks
- `POST /webhook/github` - GitHub webhook handler

## WebSocket Events

### Client to Server
- `message` - Send a message
- `ai-chat` - Request AI chat response
- `join-github-events` - Subscribe to GitHub events
- `join-azure-events` - Subscribe to Azure events

### Server to Client
- `welcome` - Welcome message on connection
- `message` - Echo of sent message
- `broadcast` - Broadcast from other clients
- `ai-response` - AI chat response
- `github-event` - GitHub webhook events
- `azure-event` - Azure events

## Development

1. Install dependencies: `npm install`
2. Create `.env` file with required variables
3. Start development server: `npm run dev`
4. Server will be available at `http://localhost:3001`

## Docker

Build and run the Docker container:

```bash
docker build -t ai-foundry-backend-node .
docker run -p 3001:3001 --env-file .env ai-foundry-backend-node
```