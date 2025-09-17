# AI Foundry SaaS

A production-ready AI SaaS web application built with Next.js 14, featuring authentication, billing, and pluggable AI model integrations.

## Features

- 🤖 **Multiple AI Providers**: OpenAI, Azure OpenAI, and Hugging Face integration
- 🔐 **Authentication**: Google OAuth, Facebook OAuth, and Email magic links
- 💳 **Billing**: Stripe subscriptions with webhooks
- 🔄 **Real-time Events**: Server-Sent Events for live updates
- 🔗 **Webhooks**: GitHub and Stripe webhook handling
- 🚀 **Deployment**: Vercel-ready with Docker support
- 🔒 **Security**: Rate limiting, input validation, HMAC verification

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL (or use SQLite for local development)
- Stripe account (for billing)
- AI provider API keys (OpenAI, Azure OpenAI, or Hugging Face)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-foundry-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   
   ```bash
   # Required
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL=file:./dev.db
   
   # Add your provider credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   OPENAI_API_KEY=sk-your-openai-api-key
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Authentication Setup

See [docs/AUTH.md](docs/AUTH.md) for detailed authentication provider setup.

### Stripe Billing Setup

See [docs/STRIPE.md](docs/STRIPE.md) for Stripe configuration and webhook setup.

### AI Model Providers

See [docs/MODELS.md](docs/MODELS.md) for AI provider configuration.

### Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md) for deployment guides.

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/webhooks/github` - GitHub webhook receiver
- `POST /api/webhooks/stripe` - Stripe webhook receiver

### Authenticated Endpoints
- `GET /api/me` - Get current user profile
- `GET /api/models` - List available AI models
- `POST /api/generate` - Generate AI text
- `GET /api/events` - Server-sent events stream
- `GET /api/github/issues` - List GitHub issues

### Example API Usage

```javascript
// Generate text with AI
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    input: 'Write a haiku about programming',
    max_tokens: 50
  })
});

const result = await response.json();
console.log(result.text);
```

## Development

### Database Operations

```bash
# Push schema changes to database
npm run db:push

# Create a new migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate
```

### Type Checking

```bash
npm run type-check
```

### Building

```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker Deployment

1. **Local Docker**
   ```bash
   docker-compose up -d
   ```

2. **Production VPS (IONOS)**
   ```bash
   # Build and deploy
   docker-compose -f docker-compose.yml up -d
   ```

## Environment Variables

See `.env.example` for all required and optional environment variables.

### Required Variables
- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `DATABASE_URL` - Database connection string

### Optional Variables
- OAuth provider credentials
- AI provider API keys
- Stripe configuration
- GitHub integration
- Email configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- All secrets are managed through environment variables
- Webhook signatures are verified using HMAC
- Rate limiting on sensitive endpoints
- Input validation with Zod schemas
- CSRF protection via NextAuth

## Support

- 📧 Email: support@yourapp.com
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.