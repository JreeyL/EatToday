from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# 加载 .env 文件中的环境变量
load_dotenv()

# 初始化 Supabase 客户端
supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# 创建 FastAPI 实例
app = FastAPI()

# 示例根路由
@app.get("/")
async def root():
    return {"message": "Welcome to EatToday API!"}

# 示例接口：从 Supabase 查询 users 表数据
@app.get("/users")
async def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}