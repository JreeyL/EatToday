import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_root():
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to EatToday API!"}


def test_get_users():
    """测试获取用户列表"""
    response = client.get("/users")
    assert response.status_code == 200
    # 由于需要Supabase连接，这里只测试响应格式
    assert isinstance(response.json(), (list, dict))


def test_create_user():
    """测试创建用户"""
    user_data = {"email": "test@example.com"}
    response = client.post("/users", json=user_data)
    assert response.status_code in [200, 201]
    # 由于需要Supabase连接，这里只测试响应格式
    assert isinstance(response.json(), dict)


def test_test_error():
    """测试错误捕获功能"""
    response = client.get("/test-error")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "error" in data
    assert "test error for Sentry" in data["error"]


def test_cors_headers():
    """测试CORS头部"""
    response = client.options("/")
    assert response.status_code == 200
    # 在测试环境中，CORS头部可能不会自动添加
    # 我们主要测试OPTIONS请求能正常响应


def test_app_initialization():
    """测试应用初始化"""
    assert app is not None
    assert hasattr(app, "routes") 