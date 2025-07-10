import pytest

# 禁用asyncio插件
pytest_plugins = []

def pytest_configure(config):
    """配置pytest"""
    # 禁用asyncio插件
    config.option.asyncio_mode = None 