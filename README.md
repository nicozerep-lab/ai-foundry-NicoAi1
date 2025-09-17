# AI Foundry Monorepo

A production-ready, secure monorepo scaffold for AI Foundry applications with comprehensive backend services, frontend dashboard, and Azure integration.

## 🏗️ Architecture

This monorepo provides a complete full-stack development environment with:

- **Backend Services**: Node.js/Express and Python/FastAPI with REST APIs, WebSocket support, and GitHub integration
- **Frontend Dashboard**: React with TypeScript, real-time communication, and responsive design
- **Security**: Comprehensive security guardrails, secret scanning, and dependency management
- **CI/CD**: Automated testing, building, and deployment to Azure Container Apps
- **Observability**: Health monitoring, metrics, and backup/restore capabilities

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Git

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nicozerep-lab/ai-foundry-NicoAi1.git
   cd ai-foundry-NicoAi1
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services with Docker Compose**:
   ```bash
   # Production-like setup
   docker-compose up -d
   
   # Or development setup with hot reload
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Access the applications**:
   - **Frontend Dashboard**: http://localhost:3000 (production) or http://localhost:5173 (development)
   - **Node.js Backend**: http://localhost:3001
   - **Python Backend**: http://localhost:8000
   - **PostgreSQL**: localhost:5432
   - **Redis**: localhost:6379

## 📁 Project Structure

```
ai-foundry-NicoAi1/
├── backend-node/           # Node.js Express backend
├── backend-python/         # Python FastAPI backend
├── frontend-react/         # React TypeScript dashboard
├── frontend-angular/       # Angular frontend (placeholder)
├── backend-java/           # Java Spring Boot backend (placeholder)
├── docker/                 # Docker configurations
├── scripts/                # Utility scripts
├── .github/                # GitHub workflows and templates
├── docker-compose.yml      # Production compose configuration
├── docker-compose.dev.yml  # Development compose configuration
└── README.md               # This file
```

## 🔧 Services

### Backend Services

#### Node.js Backend (`backend-node/`)
- **Express.js** REST API server
- **Socket.io** WebSocket communication
- **Octokit** GitHub API integration
- **GitHub Webhooks** receiver
- Security middleware (CORS, rate limiting, helmet)

#### Python Backend (`backend-python/`)
- **FastAPI** async REST API server
- **Native WebSocket** support
- **Azure AI** integration endpoints
- **Pydantic** data validation
- Comprehensive system monitoring

### Frontend Applications

#### React Dashboard (`frontend-react/`)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **Socket.io Client** for real-time communication
- **Tailwind CSS** for styling
- **React Router** for navigation

### Infrastructure

- **PostgreSQL** for data storage
- **Redis** for caching and sessions
- **Nginx** reverse proxy
- **Docker** containerization
- **Azure Container Apps** for cloud deployment

## 🔐 Security Features

### Repository Security
- ✅ **Secret Scanning** with TruffleHog
- ✅ **Dependency Scanning** with Dependabot
- ✅ **Code Analysis** with CodeQL
- ✅ **Security Headers** in all services
- ✅ **CORS Protection** with configurable origins
- ✅ **Rate Limiting** to prevent abuse
- ✅ **Environment Variable Protection**

### Development Security
- 🔒 **Pull Request Templates** with security checklists
- 🔒 **CODEOWNERS** for required reviews
- 🔒 **Branch Protection** rules
- 🔒 **Secret Management** with Azure Key Vault integration
- 🔒 **Container Security** with non-root users

## 🚀 CI/CD Pipeline

### Automated Testing
- **Hygiene Checks**: No secrets, proper environment setup
- **Unit Testing**: Jest (Node.js), Pytest (Python)
- **Linting**: ESLint (JavaScript/TypeScript), Flake8 (Python)
- **Build Testing**: Webpack/Vite build validation
- **Integration Testing**: Docker Compose validation

### Deployment
- **Container Building**: Multi-platform Docker images
- **Registry Push**: GitHub Container Registry (GHCR)
- **Azure Deployment**: Container Apps with auto-scaling
- **Health Checks**: Post-deployment validation
- **Rollback Support**: Previous version restoration

## 🌐 Azure Integration

### Services Used
- **Azure Container Apps**: Serverless container hosting
- **Azure Container Registry**: Private container images
- **Azure AI Foundry**: AI model endpoints (placeholder)
- **Azure AI Studio**: AI development environment (placeholder)
- **Azure Key Vault**: Secret management
- **Azure Monitor**: Application insights and logging

### Deployment Environments
- **Staging**: `az containerapp` with staging configuration
- **Production**: `az containerapp` with production configuration
- **Manual Deployment**: GitHub workflow dispatch
- **Automated Deployment**: Git tag triggers (`v*`)

## 📊 Monitoring & Observability

### Health Endpoints
- `/health` - Basic health check
- `/api/system/info` - Detailed system information
- `/metrics` - Application metrics (planned)

### Backup & Recovery
```bash
# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh ./backups/ai_foundry_backup_20231201_143000.tar.gz
```

## 🛠️ Development

### Running Individual Services

#### Node.js Backend
```bash
cd backend-node
npm install
npm run dev
```

#### Python Backend
```bash
cd backend-python
pip install -r requirements.txt
pip install -r requirements-dev.txt
uvicorn main:app --reload
```

#### React Frontend
```bash
cd frontend-react
npm install
npm run dev
```

### Testing
```bash
# Run all tests
docker-compose -f docker-compose.dev.yml exec backend-node npm test
docker-compose -f docker-compose.dev.yml exec backend-python pytest
docker-compose -f docker-compose.dev.yml exec frontend-react npm test

# Run specific service tests
cd backend-node && npm test
cd backend-python && pytest
cd frontend-react && npm test
```

### Linting
```bash
# Lint all services
cd backend-node && npm run lint
cd backend-python && flake8 .
cd frontend-react && npm run lint
```

## 🔧 Configuration

### Environment Variables

See individual service README files for detailed configuration:
- [Node.js Backend Configuration](backend-node/README.md)
- [Python Backend Configuration](backend-python/README.md)
- [React Frontend Configuration](frontend-react/README.md)

### Required Secrets
- `GITHUB_TOKEN` - GitHub API access
- `AZURE_OPENAI_API_KEY` - Azure OpenAI access
- `AZURE_AI_FOUNDRY_ENDPOINT` - AI Foundry endpoint
- `GITHUB_WEBHOOK_SECRET` - Webhook validation

## 📚 API Documentation

### Node.js Backend
- **REST API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001
- **Health**: http://localhost:3001/health

### Python Backend
- **REST API**: http://localhost:8000/api
- **Interactive Docs**: http://localhost:8000/docs
- **WebSocket Test**: http://localhost:8000/ws/test
- **Health**: http://localhost:8000/health

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Run tests**: Ensure all tests pass
5. **Run security checks**: No secrets or vulnerabilities
6. **Create a Pull Request** using the provided template

### Coding Standards
- **TypeScript/JavaScript**: Follow ESLint configuration
- **Python**: Follow PEP 8 with Flake8
- **Git Commits**: Use conventional commit format
- **Documentation**: Update README files for any new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Node.js Backend Documentation](backend-node/README.md)
- [Python Backend Documentation](backend-python/README.md)
- [React Frontend Documentation](frontend-react/README.md)
- [Security Guidelines](.github/pull_request_template.md)
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio)

## 📞 Support

For support and questions:
- **Create an Issue**: Use GitHub issues for bug reports and feature requests
- **Security Issues**: Email security@example.com (or use GitHub security tab)
- **Documentation**: Check individual service README files

---

**Built with ❤️ for the AI community**