from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import HTMLResponse
import json
import asyncio
from datetime import datetime
from typing import Dict, Any

from app.services.websocket_manager import WebSocketManager

router = APIRouter()

# HTML page for testing WebSocket connections
websocket_test_html = """
<!DOCTYPE html>
<html>
<head>
    <title>AI Foundry WebSocket Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .messages { height: 400px; border: 1px solid #ccc; padding: 10px; overflow-y: auto; margin: 10px 0; }
        input, button { padding: 8px; margin: 5px; }
        .message { margin: 5px 0; padding: 5px; background: #f5f5f5; border-radius: 3px; }
        .error { background: #ffebee; color: #c62828; }
        .success { background: #e8f5e8; color: #2e7d32; }
        .system { background: #e3f2fd; color: #1565c0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Foundry WebSocket Test</h1>
        <div>
            <button onclick="connect()">Connect</button>
            <button onclick="disconnect()">Disconnect</button>
            <span id="status">Disconnected</span>
        </div>
        
        <div class="messages" id="messages"></div>
        
        <div>
            <input type="text" id="messageInput" placeholder="Enter message..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Send Message</button>
        </div>
        
        <div>
            <input type="text" id="aiInput" placeholder="Ask AI something..." onkeypress="handleAIKeyPress(event)">
            <button onclick="sendAIMessage()">Ask AI</button>
        </div>
    </div>

    <script>
        let ws = null;
        const messages = document.getElementById('messages');
        const status = document.getElementById('status');

        function connect() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/websocket`;
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function(event) {
                status.textContent = 'Connected';
                status.style.color = 'green';
                addMessage('Connected to WebSocket server', 'success');
            };
            
            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                addMessage(JSON.stringify(data, null, 2), 'system');
            };
            
            ws.onclose = function(event) {
                status.textContent = 'Disconnected';
                status.style.color = 'red';
                addMessage('WebSocket connection closed', 'error');
            };
            
            ws.onerror = function(error) {
                addMessage('WebSocket error: ' + error, 'error');
            };
        }

        function disconnect() {
            if (ws) {
                ws.close();
            }
        }

        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                const data = {
                    type: 'message',
                    message: message,
                    timestamp: new Date().toISOString()
                };
                
                ws.send(JSON.stringify(data));
                addMessage(`Sent: ${message}`, 'message');
                input.value = '';
            }
        }

        function sendAIMessage() {
            const input = document.getElementById('aiInput');
            const message = input.value.trim();
            
            if (message && ws && ws.readyState === WebSocket.OPEN) {
                const data = {
                    type: 'ai_chat',
                    message: message,
                    model: 'gpt-3.5-turbo',
                    timestamp: new Date().toISOString()
                };
                
                ws.send(JSON.stringify(data));
                addMessage(`AI Request: ${message}`, 'message');
                input.value = '';
            }
        }

        function addMessage(message, type = 'message') {
            const div = document.createElement('div');
            div.className = `message ${type}`;
            div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function handleAIKeyPress(event) {
            if (event.key === 'Enter') {
                sendAIMessage();
            }
        }

        // Auto-connect on page load
        window.onload = function() {
            connect();
        };
    </script>
</body>
</html>
"""

@router.get("/test")
async def websocket_test_page():
    """WebSocket test page"""
    return HTMLResponse(content=websocket_test_html)

@router.websocket("/websocket")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint"""
    manager = websocket.app.state.websocket_manager
    await manager.connect(websocket)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "welcome",
            "message": "Connected to AI Foundry Python Backend",
            "timestamp": datetime.utcnow().isoformat(),
            "client_id": id(websocket)
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            message_type = data.get("type", "message")
            
            if message_type == "message":
                await handle_message(websocket, data, manager)
            elif message_type == "ai_chat":
                await handle_ai_chat(websocket, data, manager)
            elif message_type == "join_room":
                await handle_join_room(websocket, data, manager)
            elif message_type == "leave_room":
                await handle_leave_room(websocket, data, manager)
            else:
                await websocket.send_json({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                    "timestamp": datetime.utcnow().isoformat()
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

async def handle_message(websocket: WebSocket, data: Dict[Any, Any], manager: WebSocketManager):
    """Handle regular chat messages"""
    message = data.get("message", "")
    
    # Echo message back to sender
    await websocket.send_json({
        "type": "echo",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Broadcast to all other clients
    await manager.broadcast({
        "type": "broadcast",
        "message": message,
        "sender_id": id(websocket),
        "timestamp": datetime.utcnow().isoformat()
    }, exclude=websocket)

async def handle_ai_chat(websocket: WebSocket, data: Dict[Any, Any], manager: WebSocketManager):
    """Handle AI chat requests"""
    message = data.get("message", "")
    model = data.get("model", "gpt-3.5-turbo")
    
    # Simulate AI processing delay
    await asyncio.sleep(1)
    
    # Send AI response (placeholder)
    await websocket.send_json({
        "type": "ai_response",
        "id": f"chat-{int(datetime.utcnow().timestamp())}",
        "message": f"AI Response from Python FastAPI: {message}",
        "model": model,
        "timestamp": datetime.utcnow().isoformat(),
        "note": "This is a placeholder response. Configure Azure OpenAI to enable AI features."
    })

async def handle_join_room(websocket: WebSocket, data: Dict[Any, Any], manager: WebSocketManager):
    """Handle room join requests"""
    room = data.get("room", "")
    
    if room:
        manager.join_room(websocket, room)
        await websocket.send_json({
            "type": "room_joined",
            "room": room,
            "timestamp": datetime.utcnow().isoformat()
        })

async def handle_leave_room(websocket: WebSocket, data: Dict[Any, Any], manager: WebSocketManager):
    """Handle room leave requests"""
    room = data.get("room", "")
    
    if room:
        manager.leave_room(websocket, room)
        await websocket.send_json({
            "type": "room_left",
            "room": room,
            "timestamp": datetime.utcnow().isoformat()
        })