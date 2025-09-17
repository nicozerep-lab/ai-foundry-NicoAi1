import express from 'express';
import { octokitService } from '../services/octokit.js';

const router = express.Router();

// Get Azure AI Foundry configuration
router.get('/azure/config', async (req, res) => {
  try {
    const config = {
      aiFoundryEndpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT || 'https://your-ai-foundry.openai.azure.com/',
      aiStudioEndpoint: process.env.AZURE_AI_STUDIO_ENDPOINT || 'https://your-ai-studio.azure.com/',
      region: process.env.AZURE_REGION || 'eastus',
      // Note: Never expose API keys in responses
      configured: !!(process.env.AZURE_AI_FOUNDRY_ENDPOINT && process.env.AZURE_OPENAI_API_KEY)
    };
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Azure configuration' });
  }
});

// GitHub API endpoints using Octokit
router.get('/github/user', async (req, res) => {
  try {
    const user = await octokitService.getCurrentUser();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get GitHub user' });
  }
});

router.get('/github/repos', async (req, res) => {
  try {
    const repos = await octokitService.getUserRepositories();
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get repositories' });
  }
});

// AI/ML endpoints (placeholders for Azure AI integration)
router.post('/ai/chat', async (req, res) => {
  try {
    const { message, model = 'gpt-3.5-turbo' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Placeholder for Azure OpenAI integration
    const response = {
      id: `chatcmpl-${Date.now()}`,
      model,
      message: `Echo: ${message}`,
      timestamp: new Date().toISOString(),
      // In production, this would call Azure OpenAI API
      note: 'This is a placeholder response. Configure AZURE_OPENAI_API_KEY to enable AI features.'
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'AI service error' });
  }
});

// System information
router.get('/system/info', (req, res) => {
  const info = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  };
  res.json(info);
});

export default router;