# CI/CD 配置说明

## 概述

本项目配置了完整的CI/CD流程，使用GitHub Actions进行自动化测试、代码质量检查和部署。

## 工作流文件

### 1. frontend-ci.yml
- **触发条件**: 当 `frontend/` 目录有变更时
- **功能**:
  - Node.js多版本测试 (18.x, 20.x)
  - 依赖安装和缓存
  - ESLint代码检查
  - TypeScript类型检查
  - Next.js构建测试
  - 构建产物上传

### 2. backend-ci.yml
- **触发条件**: 当 `backend/` 目录有变更时
- **功能**:
  - Python多版本测试 (3.9, 3.10, 3.11)
  - 依赖安装和缓存
  - flake8代码风格检查
  - black代码格式化检查
  - mypy类型检查
  - pytest测试运行
  - 代码覆盖率上传到Codecov

### 3. full-ci.yml
- **触发条件**: 任何分支的push或PR
- **功能**:
  - 前后端并行测试
  - 安全漏洞扫描 (Trivy)
  - PR预览部署 (Vercel)

## 代码质量工具

### 前端
- **ESLint**: JavaScript/TypeScript代码检查
- **TypeScript**: 类型检查
- **Next.js**: 构建验证

### 后端
- **flake8**: Python代码风格检查
- **black**: 代码格式化检查
- **mypy**: 类型检查
- **pytest**: 单元测试

## 安全扫描

使用Trivy进行安全漏洞扫描，结果会上传到GitHub Security tab。

## 部署

- **预览部署**: PR时自动部署到Vercel预览环境
- **生产部署**: 需要手动配置 (可扩展)

## 环境变量

需要在GitHub仓库设置以下secrets:

```bash
# Vercel部署 (可选)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Codecov (可选)
CODECOV_TOKEN=your_codecov_token
```

## 本地测试

### 前端
```bash
cd frontend
npm install
npm run lint
npx tsc --noEmit
npm run build
```

### 后端
```bash
cd backend
pip install -r requirements.txt
flake8 app/
black --check app/
mypy app/
pytest --cov=app
```

## 注意事项

1. 所有工作流都配置了缓存以提高运行速度
2. 测试失败会阻止PR合并
3. 代码覆盖率报告会自动生成
4. 安全扫描结果会显示在GitHub Security tab中

## 扩展建议

1. 添加Docker镜像构建和推送
2. 配置生产环境自动部署
3. 添加性能测试
4. 集成更多安全扫描工具
5. 添加数据库迁移检查 