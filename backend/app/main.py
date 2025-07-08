from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from datetime import datetime

# 加载 .env 文件中的环境变量
load_dotenv()

# 初始化 Supabase 客户端
supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# 创建 FastAPI 实例
app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 用户模型
class UserCreate(BaseModel):
    email: str

# 示例根路由
@app.get("/")
async def root():
    return {"message": "Welcome to EatToday API!"}

# 获取用户列表
@app.get("/users")
async def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}

# 创建新用户
@app.post("/users")
async def create_user(user: UserCreate):
    try:
        user_data = {
            "email": user.email,
            "created_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("users").insert(user_data).execute()
        if response.data:
            return response.data[0]
        else:
            return {"error": "Failed to create user"}
    except Exception as e:
        return {"error": str(e)}