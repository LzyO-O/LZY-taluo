# 🚀 部署指南

## 概述
这个项目是一个高级塔罗占卜应用，已完全为生产部署做好准备。

## 前置要求
- Node.js 18+
- npm 9+
- GitHub 账户（已配置）
- Vercel/Netlify 账户

## 快速部署

### 方式 1: Vercel（推荐）⭐

#### 步骤 1: 连接仓库
1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 输入: https://github.com/LzyO-O/LZY-taluo
4. 点击 "Import"

#### 步骤 2: 配置环境变量
在 Vercel 项目设置中，添加以下环境变量：

```bash
VITE_GEMINI_API_KEY=sk-qbMLbJ4ZRw4dUQrgNBZSX1ncm5t4GXBogWyvGYacNRelOMYJ
VITE_GEMINI_API_ENDPOINT=https://api-666.cc/v1/chat/completions
```

#### 步骤 3: 部署
- Vercel 会自动检测到 `vercel.json` 配置
- 点击 "Deploy" 按钮
- 等待部署完成（通常 1-2 分钟）

#### 步骤 4: 验证
- 部署成功后会收到部署链接
- 访问链接验证应用是否正常运行

---

### 方式 2: Netlify

#### 步骤 1: 连接仓库
1. 访问 https://netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub"
4. 授权并选择 `LZY-taluo` 仓库

#### 步骤 2: 配置构建设置
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Runtime**: Node.js 18.x

#### 步骤 3: 配置环境变量
在 "Site settings" → "Build & deploy" → "Environment" 中添加：

```bash
VITE_GEMINI_API_KEY=sk-qbMLbJ4ZRw4dUQrgNBZSX1ncm5t4GXBogWyvGYacNRelOMYJ
VITE_GEMINI_API_ENDPOINT=https://api-666.cc/v1/chat/completions
```

#### 步骤 4: 部署
- 点击 "Deploy site"
- Netlify 会自动部署

---

### 方式 3: 自托管服务器

#### 构建应用
```bash
npm install
npm run build
```

#### 上传 `dist` 文件夹到服务器
```bash
scp -r dist/ user@your-server:/var/www/destiny/
```

#### 配置 Web 服务器（Nginx 示例）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/destiny;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 设置缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 不缓存 HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }
}
```

#### 配置环境变量
在服务器上创建 `.env` 文件（注意：这不会在生产部署中使用，环境变量应在系统级别配置）

---

## 🔒 安全配置检查清单

部署前请确保：

- [ ] `.env.local` 不会被提交到 Git（已在 `.gitignore` 中）
- [ ] 环境变量已在部署平台中配置
- [ ] API 密钥定期轮换
- [ ] 启用 HTTPS（所有部署平台默认支持）
- [ ] 配置适当的 CORS 策略（如需要）

---

## 🆘 常见问题

### Q: API 密钥如何配置？
A: 在部署平台的环境变量设置中添加 `VITE_GEMINI_API_KEY` 和 `VITE_GEMINI_API_ENDPOINT`。

### Q: 为什么我的占卜没有 AI 解读？
A: 检查以下几点：
1. 环境变量是否正确配置
2. API 密钥是否有效
3. 网络连接是否正常
4. 检查浏览器控制台是否有错误信息

### Q: 可以在本地测试吗？
A: 可以！
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

### Q: 如何更新部署的应用？
A: 只需推送更新到 GitHub：
```bash
git add .
git commit -m "Update: your changes"
git push origin main
```
Vercel/Netlify 会自动部署新版本。

---

## 📊 部署后的监控

### Vercel
- 访问 vercel.com 项目面板
- 查看构建日志和部署历史
- 监控性能指标

### Netlify
- 访问 netlify.com 项目面板
- 查看部署状态和日志
- 使用 Analytics 功能

---

## 🔧 故障排除

### 构建失败
检查 Node.js 版本是否为 18+：
```bash
node --version
```

### 环境变量未加载
确保在部署平台中正确配置了环境变量（注意 `VITE_` 前缀很重要）。

### 应用加载缓慢
- 检查网络连接
- 查看浏览器 DevTools 的 Network 标签
- 检查 API 响应时间

---

## 📝 版本信息

- **React**: 19.2.3
- **Vite**: 6.2.0
- **TypeScript**: 5.8.2
- **Framer Motion**: 12.23.26

---

## 📧 支持

如有问题，请：
1. 检查本文档的故障排除部分
2. 查看 GitHub Issues
3. 检查部署平台的文档

---

**祝您部署顺利！** 🚀✨
