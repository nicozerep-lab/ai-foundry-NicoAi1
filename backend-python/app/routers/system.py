from fastapi import APIRouter
import os
import sys
import psutil
from datetime import datetime
import platform

router = APIRouter()

@router.get("/info")
async def get_system_info():
    """Get system information"""
    try:
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        info = {
            "python_version": sys.version,
            "platform": {
                "system": platform.system(),
                "release": platform.release(),
                "version": platform.version(),
                "machine": platform.machine(),
                "processor": platform.processor()
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent,
                "used": memory.used,
                "free": memory.free
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": (disk.used / disk.total) * 100
            },
            "environment": os.getenv("ENVIRONMENT", "development"),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return info
    except Exception as e:
        return {
            "error": "Failed to get system information",
            "details": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/health")
async def health_check():
    """Extended health check with system metrics"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        
        health = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "uptime": psutil.boot_time(),
            "metrics": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "disk_percent": (psutil.disk_usage('/').used / psutil.disk_usage('/').total) * 100
            },
            "services": {
                "fastapi": "running",
                "websocket": "running",
                "github_integration": "configured" if os.getenv("GITHUB_TOKEN") else "not_configured",
                "azure_ai": "configured" if os.getenv("AZURE_OPENAI_API_KEY") else "not_configured"
            }
        }
        
        # Set overall health status based on metrics
        if cpu_percent > 90 or memory.percent > 90:
            health["status"] = "degraded"
            health["warnings"] = []
            
            if cpu_percent > 90:
                health["warnings"].append("High CPU usage")
            if memory.percent > 90:
                health["warnings"].append("High memory usage")
        
        return health
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@router.get("/environment")
async def get_environment_info():
    """Get environment variables (safe subset)"""
    try:
        safe_env_vars = [
            "ENVIRONMENT",
            "PORT",
            "AZURE_REGION",
            "AZURE_AI_FOUNDRY_ENDPOINT",
            "AZURE_AI_STUDIO_ENDPOINT",
            "FRONTEND_URL"
        ]
        
        env_info = {}
        for var in safe_env_vars:
            value = os.getenv(var)
            if value:
                # Mask sensitive endpoints partially
                if "ENDPOINT" in var and value.startswith("https://"):
                    parts = value.split(".")
                    if len(parts) > 2:
                        env_info[var] = f"{parts[0]}.***.***/..."
                    else:
                        env_info[var] = "***configured***"
                else:
                    env_info[var] = value
            else:
                env_info[var] = "not_set"
        
        # Add configuration status
        env_info["configuration_status"] = {
            "github_token": "configured" if os.getenv("GITHUB_TOKEN") else "not_configured",
            "azure_openai_key": "configured" if os.getenv("AZURE_OPENAI_API_KEY") else "not_configured",
            "github_webhook_secret": "configured" if os.getenv("GITHUB_WEBHOOK_SECRET") else "not_configured"
        }
        
        return {
            "environment": env_info,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "error": "Failed to get environment information",
            "details": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }