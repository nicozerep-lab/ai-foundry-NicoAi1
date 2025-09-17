# React Dashboard Frontend

This is the React dashboard frontend for the AI Foundry monorepo with real-time communication capabilities.

## Features

- **Modern React**: Built with React 18+ and TypeScript
- **Vite**: Fast development and build tooling
- **Real-time Communication**: WebSocket integration with backend services
- **API Integration**: REST API communication with both Node.js and Python backends
- **Responsive Design**: Mobile-friendly dashboard interface
- **Health Monitoring**: System health and metrics visualization
- **AI Chat Interface**: Test AI functionality with both backends
- **GitHub Integration**: Repository and user information display

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
# API endpoints
VITE_NODE_API_URL=http://localhost:3001
VITE_PYTHON_API_URL=http://localhost:8000
VITE_NODE_WS_URL=http://localhost:3001

# App configuration
VITE_APP_NAME=AI Foundry Dashboard
VITE_APP_VERSION=1.0.0
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## Pages

### Dashboard (`/`)
- Service status overview
- Quick actions and system metrics
- Environment information

### System Health (`/health`)
- Detailed system metrics for both backends
- Memory, CPU, and platform information
- Real-time health monitoring

### AI Chat (`/ai-chat`)
- Test AI functionality with both Node.js and Python backends
- REST API and WebSocket communication
- Message history and model selection

### GitHub Integration (`/github`)
- GitHub user information
- Repository listings
- Integration status for both backends

### WebSocket Test (`/websocket`)
- Real-time WebSocket communication testing
- Message history and connection status
- Quick test actions

## Docker

Build and run the Docker container:

```bash
docker build -t ai-foundry-frontend-react .
docker run -p 3000:3000 ai-foundry-frontend-react
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. The `dist/` directory contains the built application
3. Serve with any static file server (nginx, Apache, etc.)
4. Configure reverse proxy for API calls to backend services

## Architecture

- **React Router**: Client-side routing
- **TanStack Query**: Server state management and caching
- **Axios**: HTTP client for API communication
- **Socket.io Client**: WebSocket communication
- **Heroicons**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety and better developer experience

## API Integration

The dashboard communicates with:

- **Node.js Backend** (`localhost:3001`): Express server with Socket.io
- **Python Backend** (`localhost:8000`): FastAPI server with WebSocket support

Both backends provide:
- Health check endpoints
- Azure AI integration
- GitHub API integration
- System information
- Real-time communication
