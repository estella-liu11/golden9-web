# 后端服务器设置指南

## 问题诊断

你遇到的错误 "Failed to fetch" 通常是由以下原因造成的：

1. **后端服务器没有运行** - 这是最可能的原因
2. **数据库连接失败** - PostgreSQL 没有运行或配置错误
3. **CORS 问题** - 已解决（代码中已启用 CORS）

## 快速启动步骤

### 1. 安装后端依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（复制 `.env.example` 并修改）：

```bash
cp .env.example .env
```

然后编辑 `.env` 文件，填入你的数据库信息：

```
DB_HOST=localhost
DB_NAME=golden9-db
DB_USER=你的PostgreSQL用户名
DB_PASSWORD=你的PostgreSQL密码
DB_PORT=5432
JWT_SECRET=一个随机的安全字符串（例如：my-super-secret-jwt-key-12345）
```

### 3. 确保数据库已创建并运行

```bash
# 检查 PostgreSQL 是否运行（这会显示PostgreSQL版本）
psql -U 你的用户名 -d postgres -c "SELECT version();"

# 检查 golden9-db 数据库是否存在（列出所有数据库）
psql -U 你的用户名 -d postgres -c "\l" | grep golden9-db

# 或者直接尝试连接到数据库（如果不存在会报错）
psql -U 你的用户名 -d golden9-db -c "SELECT 1;"

# 如果数据库不存在，创建它
createdb -U 你的用户名 golden9-db

# 运行 schema 设置脚本（从 backend 目录执行）
psql -U 你的用户名 -d golden9-db -f ../schema_setup.sql
```

### 4. 启动后端服务器

```bash
# 开发模式（自动重启）
npm run dev

# 或生产模式
npm start
```

你应该看到：
```
✅ PostgreSQL database connected successfully.
✅ PostgreSQL API Server running at http://localhost:3000
```

### 5. 测试 API

在另一个终端窗口：

```bash
# 测试服务器是否运行
curl http://localhost:3000/api/events
```

如果返回 401（需要认证）或空数组，说明服务器正常运行。

## 常见问题

### 问题1: "Failed to connect to PostgreSQL database"

**解决方案：**
- 确保 PostgreSQL 服务正在运行
- 检查 `.env` 文件中的数据库配置是否正确
- 确认数据库 `golden9-db` 已创建
- 检查用户名和密码是否正确

### 问题2: "Port 3000 is already in use"

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程（替换 PID 为实际进程ID）
kill -9 PID
```

### 问题3: 前端仍然报错 "Failed to fetch"

**检查清单：**
1. ✅ 后端服务器是否在运行？（应该看到 "Server running at http://localhost:3000"）
2. ✅ 数据库是否连接成功？（应该看到 "PostgreSQL database connected successfully"）
3. ✅ 前端是否在运行？（通常运行在 http://localhost:5173）
4. ✅ 浏览器控制台是否有 CORS 错误？（应该没有，因为已启用 CORS）

## 验证步骤

1. **启动后端服务器** - 应该看到成功连接数据库的消息
2. **打开前端应用** - 在浏览器中访问你的前端地址
3. **登录管理员账户** - 使用管理员账号登录
4. **测试保存功能** - 在 Admin 页面尝试创建/编辑 Events 或 Products

如果所有步骤都正确，Save 按钮应该可以正常工作了！

