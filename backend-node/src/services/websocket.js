let globalIo;

export const setupWebSocket = (io) => {
  globalIo = io;
  
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Send welcome message
    socket.emit('welcome', {
      message: 'Connected to AI Foundry Backend',
      timestamp: new Date().toISOString(),
      socketId: socket.id
    });

    // Handle client messages
    socket.on('message', (data) => {
      console.log(`💬 Message from ${socket.id}:`, data);
      
      // Echo message back to sender
      socket.emit('message', {
        echo: data,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast to all other clients
      socket.broadcast.emit('broadcast', {
        from: socket.id,
        message: data,
        timestamp: new Date().toISOString()
      });
    });

    // Handle AI chat requests
    socket.on('ai-chat', async (data) => {
      console.log(`🤖 AI chat request from ${socket.id}:`, data.message);
      
      try {
        // Placeholder for AI integration
        const response = {
          id: `chat-${Date.now()}`,
          message: `AI Response to: "${data.message}"`,
          model: data.model || 'gpt-3.5-turbo',
          timestamp: new Date().toISOString(),
          note: 'This is a placeholder response. Configure Azure OpenAI to enable AI features.'
        };

        socket.emit('ai-response', response);
      } catch (error) {
        console.error('AI chat error:', error);
        socket.emit('ai-error', {
          error: 'AI service temporarily unavailable',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle GitHub events relay
    socket.on('join-github-events', () => {
      socket.join('github-events');
      console.log(`📦 ${socket.id} joined GitHub events room`);
    });

    socket.on('leave-github-events', () => {
      socket.leave('github-events');
      console.log(`📦 ${socket.id} left GitHub events room`);
    });

    // Handle Azure AI events
    socket.on('join-azure-events', () => {
      socket.join('azure-events');
      console.log(`☁️ ${socket.id} joined Azure events room`);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  // Global event broadcasting functions
  global.io = io;
};

// Utility functions for broadcasting events
export const broadcastGitHubEvent = (eventData) => {
  if (globalIo) {
    globalIo.to('github-events').emit('github-event', eventData);
  }
};

export const broadcastAzureEvent = (eventData) => {
  if (globalIo) {
    globalIo.to('azure-events').emit('azure-event', eventData);
  }
};

export const broadcastSystemEvent = (eventData) => {
  if (globalIo) {
    globalIo.emit('system-event', eventData);
  }
};