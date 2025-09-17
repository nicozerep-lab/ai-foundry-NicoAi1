# Deployment Guide

This guide covers deploying your AI Foundry application to various platforms.

## Overview

AI Foundry can be deployed to:
- **Vercel** - Recommended for serverless deployment
- **Docker** - For containerized deployment on any platform
- **IONOS VPS** - Example VPS deployment
- **Other platforms** - Adaptable to most Node.js hosting

## Vercel Deployment

### Prerequisites

- Vercel account
- Repository connected to Vercel
- Environment variables configured

### Setup

1. **Connect Repository**
   - Login to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select "Next.js" framework preset

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`:

   ```bash
   # Required
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-32-character-secret
   DATABASE_URL=your-postgres-connection-string
   
   # Authentication
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   # ... add all other variables
   ```

3. **Database Setup**
   
   **Option A: Vercel Postgres**
   ```bash
   # In Vercel dashboard, add Postgres storage
   # Connection string automatically set as DATABASE_URL
   ```
   
   **Option B: External Postgres**
   ```bash
   # Use services like Supabase, PlanetScale, or Neon
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or click "Deploy" in Vercel dashboard

### Post-Deployment

1. **Database Migration**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   
   # Push database schema
   vercel env pull .env.local
   npx prisma db push
   ```

2. **Configure Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` environment variable

### Vercel Configuration

The `vercel.json` file configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Docker Deployment

### Building the Image

```bash
# Build Docker image
docker build -t ai-foundry .

# Or using docker-compose
docker-compose build
```

### Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f ai-foundry

# Stop services
docker-compose down
```

### Environment Variables

Create `.env.local` file:

```bash
# Copy from .env.example and fill in values
cp .env.example .env.local
```

The `docker-compose.yml` includes:
- **PostgreSQL** database
- **Redis** for caching (optional)
- **AI Foundry** application

### Production Docker Setup

1. **Prepare Environment**
   ```bash
   # Create production env file
   cp .env.example .env.production
   # Fill in production values
   ```

2. **Build and Deploy**
   ```bash
   # Build for production
   docker-compose -f docker-compose.yml build
   
   # Start services
   docker-compose -f docker-compose.yml up -d
   ```

3. **Database Setup**
   ```bash
   # Run database migrations
   docker-compose exec ai-foundry npx prisma db push
   ```

## IONOS VPS Deployment

### Server Preparation

1. **Create VPS**
   - Choose Ubuntu 22.04 LTS
   - Minimum 2GB RAM, 20GB storage
   - Enable SSH access

2. **Initial Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt install docker-compose-plugin
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/ai-foundry.git
   cd ai-foundry
   ```

### SSL Setup with Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt install certbot nginx
   ```

2. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/ai-foundry
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-foundry /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Get SSL Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Deployment

1. **Configure Environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   nano .env.production
   ```

2. **Deploy Application**
   ```bash
   # Start services
   docker-compose -f docker-compose.yml up -d
   
   # Check status
   docker-compose ps
   ```

3. **Setup Monitoring**
   ```bash
   # Monitor logs
   docker-compose logs -f
   
   # Setup log rotation
   sudo nano /etc/logrotate.d/docker-compose
   ```

## Railway Deployment

### Setup

1. **Connect Repository** to [railway.app](https://railway.app)
2. **Add Services**:
   - PostgreSQL database
   - Your application

3. **Configure Variables**
   ```bash
   # Railway automatically provides DATABASE_URL
   # Add other environment variables in dashboard
   ```

4. **Custom Domain**
   - Add domain in Railway dashboard
   - Update `NEXTAUTH_URL`

## PlanetScale + Vercel

### Database Setup

1. **Create PlanetScale Database**
   ```bash
   # Install PlanetScale CLI
   pscale connect ai-foundry main --port 3309
   ```

2. **Configure Prisma**
   ```prisma
   // Change in schema.prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"
   }
   ```

3. **Deploy Schema**
   ```bash
   npx prisma db push
   ```

## Environment Variables Checklist

### Required for All Deployments

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-32-chars-minimum
DATABASE_URL=your-database-connection-string
```

### Authentication (at least one required)

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

### AI Providers (at least one required)

```bash
OPENAI_API_KEY=sk-your-openai-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-key
HUGGINGFACE_API_KEY=hf_your-huggingface-token
```

### Optional Services

```bash
STRIPE_SECRET_KEY=sk_your-stripe-secret
GITHUB_TOKEN=ghp_your-github-token
PUSHER_APP_ID=your-pusher-app-id
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check application health
curl https://yourdomain.com/api/health

# Check database connection
curl https://yourdomain.com/api/models
```

### Log Monitoring

**Vercel**
```bash
vercel logs --follow
```

**Docker**
```bash
docker-compose logs -f ai-foundry
```

### Database Maintenance

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Monitor connection pool
SELECT * FROM pg_stat_activity;
```

### Performance Monitoring

1. **Vercel Analytics** - Built-in performance monitoring
2. **Sentry** - Error tracking and performance
3. **LogRocket** - User session recording
4. **DataDog** - Infrastructure monitoring

## Scaling Considerations

### Horizontal Scaling

- **Vercel**: Automatic scaling based on traffic
- **Docker**: Use container orchestration (Kubernetes)
- **Load Balancer**: Distribute traffic across instances

### Database Scaling

- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: Use PgBouncer or similar
- **Caching**: Redis for session and API response caching

### CDN Integration

```javascript
// Next.js automatic optimization
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## Security Considerations

### SSL/TLS

- Always use HTTPS in production
- Configure HSTS headers
- Use strong cipher suites

### API Security

```javascript
// Rate limiting
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Environment Security

- Never commit secrets to version control
- Use platform-specific secret management
- Rotate secrets regularly
- Monitor for leaked credentials

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version compatibility
   # Verify all dependencies are installed
   # Check TypeScript errors
   ```

2. **Database Connection**
   ```bash
   # Verify DATABASE_URL format
   # Check network connectivity
   # Validate SSL settings
   ```

3. **Authentication Issues**
   ```bash
   # Verify callback URLs
   # Check NEXTAUTH_URL setting
   # Validate provider credentials
   ```

### Debug Mode

```bash
# Enable debug logging
NEXTAUTH_LOG_LEVEL=debug
DEBUG=stripe:*
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] Health checks passing
- [ ] Error monitoring set up
- [ ] Backup strategy implemented
- [ ] Performance monitoring active
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)