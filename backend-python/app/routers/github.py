from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx
import asyncio
from datetime import datetime

router = APIRouter()

class GitHubUser(BaseModel):
    login: str
    name: Optional[str]
    email: Optional[str]
    avatar_url: str
    public_repos: int
    followers: int
    following: int

class Repository(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str]
    private: bool
    html_url: str
    language: Optional[str]
    stargazers_count: int
    forks_count: int
    updated_at: str
    created_at: str

@router.get("/user", response_model=GitHubUser)
async def get_github_user():
    """Get authenticated GitHub user information"""
    try:
        github_token = os.getenv("GITHUB_TOKEN")
        if not github_token:
            raise HTTPException(status_code=401, detail="GitHub token not configured")
        
        headers = {
            "Authorization": f"Bearer {github_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "ai-foundry-monorepo/1.0.0"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.github.com/user", headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch GitHub user")
            
            data = response.json()
            
            return GitHubUser(
                login=data["login"],
                name=data.get("name"),
                email=data.get("email"),
                avatar_url=data["avatar_url"],
                public_repos=data["public_repos"],
                followers=data["followers"],
                following=data["following"]
            )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"GitHub API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get GitHub user")

@router.get("/repos", response_model=List[Repository])
async def get_github_repos(limit: int = 30, page: int = 1):
    """Get user repositories"""
    try:
        github_token = os.getenv("GITHUB_TOKEN")
        if not github_token:
            raise HTTPException(status_code=401, detail="GitHub token not configured")
        
        headers = {
            "Authorization": f"Bearer {github_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "ai-foundry-monorepo/1.0.0"
        }
        
        params = {
            "sort": "updated",
            "direction": "desc",
            "per_page": min(limit, 100),
            "page": page
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/user/repos",
                headers=headers,
                params=params
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repositories")
            
            data = response.json()
            
            repos = []
            for repo in data:
                repos.append(Repository(
                    id=repo["id"],
                    name=repo["name"],
                    full_name=repo["full_name"],
                    description=repo.get("description"),
                    private=repo["private"],
                    html_url=repo["html_url"],
                    language=repo.get("language"),
                    stargazers_count=repo["stargazers_count"],
                    forks_count=repo["forks_count"],
                    updated_at=repo["updated_at"],
                    created_at=repo["created_at"]
                ))
            
            return repos
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"GitHub API request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get repositories")

@router.get("/status")
async def get_github_status():
    """Get GitHub API status and configuration"""
    try:
        github_token = os.getenv("GITHUB_TOKEN")
        configured = bool(github_token)
        
        status = {
            "configured": configured,
            "api_url": "https://api.github.com",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if configured:
            # Test API connectivity
            headers = {
                "Authorization": f"Bearer {github_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "ai-foundry-monorepo/1.0.0"
            }
            
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get("https://api.github.com/rate_limit", headers=headers)
                    
                    if response.status_code == 200:
                        rate_limit_data = response.json()
                        status["api_status"] = "connected"
                        status["rate_limit"] = {
                            "limit": rate_limit_data["rate"]["limit"],
                            "remaining": rate_limit_data["rate"]["remaining"],
                            "reset": rate_limit_data["rate"]["reset"]
                        }
                    else:
                        status["api_status"] = "error"
                        status["error"] = f"API returned status {response.status_code}"
            except asyncio.TimeoutError:
                status["api_status"] = "timeout"
            except Exception as e:
                status["api_status"] = "error"
                status["error"] = str(e)
        else:
            status["api_status"] = "not_configured"
            status["message"] = "Set GITHUB_TOKEN environment variable to enable GitHub integration"
        
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get GitHub status")