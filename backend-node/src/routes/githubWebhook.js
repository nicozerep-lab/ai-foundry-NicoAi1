import express from 'express';
import crypto from 'crypto';
import { io } from '../index.js';

const router = express.Router();

// GitHub webhook signature verification
const verifyGitHubSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('GITHUB_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
};

// GitHub webhook handler
router.post('/github', verifyGitHubSignature, (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  console.log(`📦 Received GitHub webhook: ${event}`);

  try {
    // Process different GitHub events
    switch (event) {
      case 'push':
        handlePushEvent(payload);
        break;
      case 'pull_request':
        handlePullRequestEvent(payload);
        break;
      case 'issues':
        handleIssuesEvent(payload);
        break;
      case 'ping':
        console.log('🏓 GitHub webhook ping received');
        break;
      default:
        console.log(`🤷 Unhandled GitHub event: ${event}`);
    }

    // Broadcast event to connected WebSocket clients
    if (global.io) {
      global.io.emit('github-event', {
        event,
        timestamp: new Date().toISOString(),
        repository: payload.repository?.full_name,
        sender: payload.sender?.login
      });
    }

    res.status(200).json({ status: 'success', event });
  } catch (error) {
    console.error('Error processing GitHub webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

function handlePushEvent(payload) {
  console.log(`🔄 Push to ${payload.repository.full_name} by ${payload.pusher.name}`);
  console.log(`📝 ${payload.commits.length} commit(s) pushed to ${payload.ref}`);
}

function handlePullRequestEvent(payload) {
  const action = payload.action;
  const pr = payload.pull_request;
  console.log(`🔀 Pull request ${action}: #${pr.number} - ${pr.title}`);
  console.log(`👤 By ${pr.user.login} in ${payload.repository.full_name}`);
}

function handleIssuesEvent(payload) {
  const action = payload.action;
  const issue = payload.issue;
  console.log(`🐛 Issue ${action}: #${issue.number} - ${issue.title}`);
  console.log(`👤 By ${issue.user.login} in ${payload.repository.full_name}`);
}

export default router;