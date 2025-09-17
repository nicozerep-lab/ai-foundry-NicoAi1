from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import httpx
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "gpt-3.5-turbo"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 150

class ChatResponse(BaseModel):
    id: str
    message: str
    model: str
    timestamp: str
    note: Optional[str] = None

@router.get("/config")
async def get_azure_config():
    """Get Azure AI configuration (without exposing sensitive data)"""
    try:
        config = {
            "ai_foundry_endpoint": os.getenv("AZURE_AI_FOUNDRY_ENDPOINT", "https://your-ai-foundry.openai.azure.com/"),
            "ai_studio_endpoint": os.getenv("AZURE_AI_STUDIO_ENDPOINT", "https://your-ai-studio.azure.com/"),
            "region": os.getenv("AZURE_REGION", "eastus"),
            "configured": bool(os.getenv("AZURE_OPENAI_API_KEY") and os.getenv("AZURE_AI_FOUNDRY_ENDPOINT"))
        }
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get Azure configuration")

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """AI chat endpoint with Azure OpenAI integration placeholder"""
    try:
        # Placeholder for Azure OpenAI integration
        # In production, this would call Azure OpenAI API
        
        response = ChatResponse(
            id=f"chatcmpl-{int(datetime.utcnow().timestamp())}",
            message=f"Echo from Python FastAPI: {request.message}",
            model=request.model,
            timestamp=datetime.utcnow().isoformat(),
            note="This is a placeholder response. Configure AZURE_OPENAI_API_KEY to enable AI features."
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI service error")

@router.get("/models")
async def get_available_models():
    """Get available AI models"""
    try:
        # Placeholder for Azure OpenAI models endpoint
        models = [
            {
                "id": "gpt-3.5-turbo",
                "name": "GPT-3.5 Turbo",
                "description": "Fast and efficient model for most tasks",
                "max_tokens": 4096
            },
            {
                "id": "gpt-4",
                "name": "GPT-4",
                "description": "Most capable model for complex tasks",
                "max_tokens": 8192
            },
            {
                "id": "text-embedding-ada-002",
                "name": "Text Embedding Ada 002",
                "description": "Embedding model for semantic search",
                "max_tokens": 8191
            }
        ]
        
        return {
            "models": models,
            "total": len(models),
            "note": "Configure Azure OpenAI to get actual available models"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get models")

@router.get("/deployment/status")
async def get_deployment_status():
    """Get Azure AI deployment status"""
    try:
        # Placeholder for Azure AI deployment status
        status = {
            "ai_foundry": {
                "status": "configured" if os.getenv("AZURE_AI_FOUNDRY_ENDPOINT") else "not_configured",
                "endpoint": os.getenv("AZURE_AI_FOUNDRY_ENDPOINT", "Not configured"),
                "region": os.getenv("AZURE_REGION", "Not configured")
            },
            "ai_studio": {
                "status": "configured" if os.getenv("AZURE_AI_STUDIO_ENDPOINT") else "not_configured", 
                "endpoint": os.getenv("AZURE_AI_STUDIO_ENDPOINT", "Not configured")
            },
            "openai": {
                "status": "configured" if os.getenv("AZURE_OPENAI_API_KEY") else "not_configured"
            }
        }
        
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get deployment status")