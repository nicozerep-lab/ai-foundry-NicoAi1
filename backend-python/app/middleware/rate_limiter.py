from fastapi import Request, Response, HTTPException
from fastapi.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
import asyncio
import os

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = None):
        super().__init__(app)
        
        # Default rate limits
        self.requests_per_minute = requests_per_minute or (60 if os.getenv("ENVIRONMENT") == "production" else 300)
        self.window_size = 60  # 1 minute window
        
        # Storage for rate limiting
        self.requests = defaultdict(list)
        
        # Cleanup task
        asyncio.create_task(self.cleanup_old_requests())

    async def dispatch(self, request: Request, call_next):
        client_ip = self.get_client_ip(request)
        
        # Skip rate limiting for health checks and WebSocket upgrades
        if (request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"] or 
            request.headers.get("upgrade") == "websocket"):
            return await call_next(request)
        
        # Check rate limit
        if not self.is_allowed(client_ip):
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": f"Maximum {self.requests_per_minute} requests per minute allowed",
                    "retry_after": 60
                }
            )
        
        # Record the request
        self.record_request(client_ip)
        
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = max(0, self.requests_per_minute - len(self.requests[client_ip]))
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
        
        return response

    def get_client_ip(self, request: Request) -> str:
        """Get the client IP address, considering proxy headers"""
        # Check for forwarded headers (from load balancers/proxies)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"

    def is_allowed(self, client_ip: str) -> bool:
        """Check if the client is allowed to make a request"""
        now = time.time()
        window_start = now - self.window_size
        
        # Get requests within the current window
        recent_requests = [
            req_time for req_time in self.requests[client_ip]
            if req_time > window_start
        ]
        
        # Update the stored requests
        self.requests[client_ip] = recent_requests
        
        return len(recent_requests) < self.requests_per_minute

    def record_request(self, client_ip: str):
        """Record a request timestamp"""
        self.requests[client_ip].append(time.time())

    async def cleanup_old_requests(self):
        """Periodically clean up old request records"""
        while True:
            await asyncio.sleep(300)  # Clean up every 5 minutes
            
            now = time.time()
            cutoff = now - (self.window_size * 2)  # Keep data for 2 windows
            
            for client_ip in list(self.requests.keys()):
                self.requests[client_ip] = [
                    req_time for req_time in self.requests[client_ip]
                    if req_time > cutoff
                ]
                
                # Remove empty entries
                if not self.requests[client_ip]:
                    del self.requests[client_ip]