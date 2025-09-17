# Python FastAPI Backend

This is the Python FastAPI backend service with REST API, WebSocket support, and Azure AI integration.

## Features

- **FastAPI**: Modern, fast web framework with automatic API documentation
- **WebSocket Support**: Real-time communication using native WebSocket support
- **Azure AI Integration**: Placeholder endpoints for Azure AI Foundry/Studio
- **GitHub Integration**: HTTP client for GitHub API integration
- **Security**: Rate limiting, security headers, and input validation
- **Auto Documentation**: Swagger UI and ReDoc documentation
- **Health Monitoring**: System metrics and health endpoints

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
# Server Configuration
PORT=8000
ENVIRONMENT=development

# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token

# Azure AI Configuration
AZURE_AI_FOUNDRY_ENDPOINT=https://your-ai-foundry.openai.azure.com/
AZURE_AI_STUDIO_ENDPOINT=https://your-ai-studio.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_REGION=eastus

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## Installation & Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install development dependencies (optional):
```bash
pip install -r requirements-dev.txt
```

4. Create `.env` file with required variables

5. Start the development server:
```bash
python main.py
```

The server will be available at:
- API: `http://localhost:8000`
- Documentation: `http://localhost:8000/docs`
- WebSocket Test: `http://localhost:8000/ws/test`

## API Endpoints

### Health & System
- `GET /health` - Server health status
- `GET /api/system/info` - Detailed system information
- `GET /api/system/health` - Extended health check with metrics
- `GET /api/system/environment` - Environment configuration status

### Azure AI
- `GET /api/azure/config` - Get Azure AI configuration
- `POST /api/azure/chat` - AI chat endpoint (placeholder)
- `GET /api/azure/models` - Available AI models
- `GET /api/azure/deployment/status` - Azure deployment status

### GitHub
- `GET /api/github/user` - Get authenticated GitHub user
- `GET /api/github/repos` - Get user repositories
- `GET /api/github/status` - GitHub API status and rate limits

### WebSocket
- `GET /ws/test` - WebSocket test page
- `WS /ws/websocket` - Main WebSocket endpoint

## WebSocket API

### Client to Server Messages
```json
{
  "type": "message",
  "message": "Hello World"
}

{
  "type": "ai_chat", 
  "message": "What is AI?",
  "model": "gpt-3.5-turbo"
}

{
  "type": "join_room",
  "room": "github-events"
}
```

### Server to Client Messages
```json
{
  "type": "welcome",
  "message": "Connected to AI Foundry Python Backend",
  "timestamp": "2024-01-01T00:00:00",
  "client_id": 12345
}

{
  "type": "ai_response",
  "message": "AI is...",
  "model": "gpt-3.5-turbo"
}
```

## Development

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8 .
```

### Type Checking
```bash
mypy .
```

### Testing
```bash
pytest
pytest --cov=app  # With coverage
```

## Docker

Build and run the Docker container:

```bash
docker build -t ai-foundry-backend-python .
docker run -p 8000:8000 --env-file .env ai-foundry-backend-python
```

## Production Deployment

1. Set `ENVIRONMENT=production` in environment variables
2. Configure proper `ALLOWED_HOSTS`
3. Use a reverse proxy (nginx) for SSL termination
4. Consider using gunicorn with uvicorn workers for better performance:

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```