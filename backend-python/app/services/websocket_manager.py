from fastapi import WebSocket
from typing import Dict, Set, List, Any
import json
import asyncio

class WebSocketManager:
    def __init__(self):
        # Active connections
        self.active_connections: List[WebSocket] = []
        
        # Room-based connections
        self.rooms: Dict[str, Set[WebSocket]] = {}
        
        # Connection metadata
        self.connection_info: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Store connection metadata
        self.connection_info[websocket] = {
            "connected_at": asyncio.get_event_loop().time(),
            "rooms": set()
        }
        
        print(f"🔌 WebSocket connected: {id(websocket)} (Total: {len(self.active_connections)})")

    def disconnect(self, websocket: WebSocket):
        """Disconnect a WebSocket and clean up"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from all rooms
        if websocket in self.connection_info:
            rooms_to_leave = self.connection_info[websocket]["rooms"].copy()
            for room in rooms_to_leave:
                self.leave_room(websocket, room)
            
            del self.connection_info[websocket]
        
        print(f"🔌 WebSocket disconnected: {id(websocket)} (Total: {len(self.active_connections)})")

    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: Dict[str, Any], exclude: WebSocket = None):
        """Broadcast a message to all connected clients"""
        disconnected = []
        
        for connection in self.active_connections:
            if connection != exclude:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error broadcasting to {id(connection)}: {e}")
                    disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

    async def broadcast_to_room(self, room: str, message: Dict[str, Any], exclude: WebSocket = None):
        """Broadcast a message to all clients in a specific room"""
        if room not in self.rooms:
            return
        
        disconnected = []
        
        for connection in self.rooms[room]:
            if connection != exclude:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error broadcasting to room {room}, connection {id(connection)}: {e}")
                    disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

    def join_room(self, websocket: WebSocket, room: str):
        """Add a WebSocket connection to a room"""
        if room not in self.rooms:
            self.rooms[room] = set()
        
        self.rooms[room].add(websocket)
        
        if websocket in self.connection_info:
            self.connection_info[websocket]["rooms"].add(room)
        
        print(f"🏠 {id(websocket)} joined room '{room}' (Room size: {len(self.rooms[room])})")

    def leave_room(self, websocket: WebSocket, room: str):
        """Remove a WebSocket connection from a room"""
        if room in self.rooms and websocket in self.rooms[room]:
            self.rooms[room].remove(websocket)
            
            # Clean up empty rooms
            if not self.rooms[room]:
                del self.rooms[room]
        
        if websocket in self.connection_info:
            self.connection_info[websocket]["rooms"].discard(room)
        
        print(f"🏠 {id(websocket)} left room '{room}'")

    def get_connection_count(self) -> int:
        """Get the total number of active connections"""
        return len(self.active_connections)

    def get_room_count(self, room: str) -> int:
        """Get the number of connections in a specific room"""
        return len(self.rooms.get(room, set()))

    def get_rooms(self) -> List[str]:
        """Get a list of all active rooms"""
        return list(self.rooms.keys())

    def get_connection_rooms(self, websocket: WebSocket) -> Set[str]:
        """Get the rooms a specific connection is in"""
        return self.connection_info.get(websocket, {}).get("rooms", set())

    async def send_connection_stats(self):
        """Send connection statistics to all clients"""
        stats = {
            "type": "stats",
            "total_connections": self.get_connection_count(),
            "active_rooms": len(self.rooms),
            "rooms": {room: len(connections) for room, connections in self.rooms.items()}
        }
        
        await self.broadcast(stats)