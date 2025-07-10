import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestUserAPI:
    """用户API测试类"""
    
    def test_create_user_success(self):
        """测试成功创建用户"""
        user_data = {
            "email": "test@example.com"
        }
        response = client.post("/users", json=user_data)
        assert response.status_code in [200, 201]
        
    def test_create_user_invalid_email(self):
        """测试无效邮箱格式"""
        user_data = {
            "email": "invalid-email"
        }
        response = client.post("/users", json=user_data)
        # 应该返回400错误
        assert response.status_code == 422
        
    def test_create_user_missing_email(self):
        """测试缺少邮箱字段"""
        user_data = {}
        response = client.post("/users", json=user_data)
        assert response.status_code == 422


class TestErrorHandling:
    """错误处理测试类"""
    
    def test_sentry_error_capture(self):
        """测试Sentry错误捕获"""
        response = client.get("/test-error")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "error" in data
        
    def test_api_root_endpoint(self):
        """测试API根路径"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome to EatToday API!"}


class TestCORS:
    """CORS测试类"""
    
    def test_cors_headers_present(self):
        """测试CORS头部存在"""
        response = client.options("/")
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
        
    def test_cors_allowed_origins(self):
        """测试允许的源"""
        response = client.get("/")
        # 检查CORS头部是否包含允许的源
        assert "access-control-allow-origin" in response.headers


class TestAsyncFeatures:
    """异步功能测试类"""
    
    def test_app_initialization(self):
        """测试应用初始化"""
        assert app is not None
        assert hasattr(app, "routes")
        
    def test_app_middleware(self):
        """测试中间件配置"""
        # 检查CORS中间件是否配置
        assert any(
            middleware.cls.__name__ == "CORSMiddleware" 
            for middleware in app.user_middleware
        ) 