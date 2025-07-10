from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel, EmailStr
from datetime import datetime
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from typing import Dict, Any

# Load environment variables from .env file
load_dotenv()

# Initialize Sentry
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development"),
)

# Initialize Supabase client
supabase_url: str = os.getenv("SUPABASE_URL", "")
if not supabase_url:
    raise ValueError("SUPABASE_URL environment variable is not set")

supabase_key: str = os.getenv("SUPABASE_KEY", "")
if not supabase_key:
    raise ValueError("SUPABASE_KEY environment variable is not set")

supabase: Client = create_client(supabase_url, supabase_key)

# 创建 FastAPI 实例
app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


class UserCreate(BaseModel):
    email: EmailStr


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Welcome to EatToday API!"}


@app.options("/")
async def options_root() -> Dict[str, str]:
    """处理OPTIONS请求"""
    return {"message": "OK"}


@app.get("/users")
async def get_users() -> Any:
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        # Capture error to Sentry
        sentry_sdk.capture_exception(e)
        return {"error": str(e)}


@app.get("/test-error")
async def test_error() -> dict:
    try:
        # Intentionally throw an error to test Sentry
        raise Exception("This is a test error for Sentry integration verification")
    except Exception as e:
        sentry_sdk.capture_exception(e)
        return {"message": "Error captured to Sentry", "error": str(e)}


@app.post("/users")
async def create_user(user: UserCreate) -> Any:
    try:
        user_data = {"email": user.email, "created_at": datetime.utcnow().isoformat()}
        response = supabase.table("users").insert(user_data).execute()
        if response.data:
            return response.data[0]
        else:
            return {"error": "Failed to create user"}
    except Exception as e:
        # Capture error to Sentry
        sentry_sdk.capture_exception(e)
        return {"error": str(e)}
