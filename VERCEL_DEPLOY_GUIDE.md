# ✨ Vercel 一键部署指南

## 📋 部署前检查清单

- ✅ 代码已推送到 GitHub: https://github.com/LzyO-O/LZY-taluo
- ✅ `vercel.json` 已配置
- ✅ `package.json` 已配置
- ✅ `.env.example` 已提供

---

## 🚀 快速部署 (5 分钟)

### 方法 A: 最简单（推荐 ⭐）

#### 第 1 步：打开 Vercel 导入页面

👉 **访问此链接直接导入您的仓库：**

```
https://vercel.com/new/git/third-party-install?repository-url=https://github.com/LzyO-O/LZY-taluo&env=VITE_GEMINI_API_KEY,VITE_GEMINI_API_ENDPOINT
```

或者手动：
1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 "GitHub"
4. 搜索 "LZY-taluo"
5. 点击 "Import"

#### 第 2 步：配置环境变量

在 Vercel 导入页面上，您会看到"Environment Variables"部分。

填入以下值：

| 名称 | 值 |
|------|-----|
| `VITE_GEMINI_API_KEY` | `sk-qbMLbJ4ZRw4dUQrgNBZSX1ncm5t4GXBogWyvGYacNRelOMYJ` |
| `VITE_GEMINI_API_ENDPOINT` | `https://api-666.cc/v1/chat/completions` |

#### 第 3 步：点击 "Deploy"

- ✅ 构建开始（通常 1-2 分钟）
- ✅ 部署完成
- ✅ 获得您的应用链接！

---

### 方法 B: 使用 Vercel CLI（命令行）

#### 前置条件
- 已安装 Node.js 18+
- 已安装 Vercel CLI: `npm install -g vercel`

#### 步骤

1. **登录 Vercel**
   ```bash
   cd /Users/lzy/Desktop/destiny\ \(2\)
   vercel login
   ```
   - 会打开浏览器
   - 授权并登录您的 Vercel 账户

2. **部署应用**
   ```bash
   vercel --prod
   ```
   - 按照提示进行（通常直接按 Enter 使用默认值）
   - 等待部署完成

3. **配置环境变量**
   
   方法 1: 从 Vercel 网页后台配置
   - 访问 https://vercel.com/dashboard
   - 选择您的项目
   - 进入 "Settings" → "Environment Variables"
   - 添加：
     - `VITE_GEMINI_API_KEY`: `sk-qbMLbJ4ZRw4dUQrgNBZSX1ncm5t4GXBogWyvGYacNRelOMYJ`
     - `VITE_GEMINI_API_ENDPOINT`: `https://api-666.cc/v1/chat/completions`
   - 保存并重新部署

   方法 2: 使用部署脚本
   ```bash
   ./deploy.sh
   ```

---

## 🔧 部署后配置

### 环境变量配置（重要！）

部署后，您需要在 Vercel 后台添加环境变量：

1. **访问 Vercel 控制面板**
   - 地址: https://vercel.com/dashboard

2. **选择您的项目 "LZY-taluo"**

3. **进入 Settings → Environment Variables**

4. **添加以下变量**
   ```
   VITE_GEMINI_API_KEY = sk-qbMLbJ4ZRw4dUQrgNBZSX1ncm5t4GXBogWyvGYacNRelOMYJ
   VITE_GEMINI_API_ENDPOINT = https://api-666.cc/v1/chat/completions
   ```

5. **保存更改**

6. **重新部署**
   - 点击 "Deployments" 选项卡
   - 点击最新部署旁的三个点
   - 选择 "Redeploy"

---

## ✅ 验证部署

部署完成后，验证以下内容：

### 1. 访问应用
- [ ] 打开您的 Vercel 部署链接
- [ ] 页面能正常加载
- [ ] 看到塔罗占卜界面

### 2. 测试完整功能
- [ ] 点击"开启旅程"
- [ ] 选择占卜主题
- [ ] 选择牌阵
- [ ] 完成占卜流程
- [ ] 获取 AI 解读

### 3. 检查控制台
- [ ] 打开浏览器 DevTools (F12)
- [ ] 查看 Console 标签
- [ ] 确保没有错误信息

### 4. 检查部署日志
- [ ] 访问 Vercel 项目面板
- [ ] 点击 "Deployments"
- [ ] 查看最新部署的构建日志

---

## 🔒 安全检查

部署完成后，请确认：

- [ ] API 密钥存储在 Vercel 环境变量中
- [ ] `.env.local` 不在 GitHub 上（已在 `.gitignore` 中）
- [ ] `.env.example` 只包含占位符
- [ ] 启用了 HTTPS（Vercel 默认支持）

---

## 🔄 后续更新

### 自动部署更新

一旦部署完成，后续更新将自动进行：

1. **在本地进行更改**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Vercel 会自动检测到变更**
   - 自动触发构建
   - 自动部署新版本
   - 通常在 1-2 分钟内完成

3. **检查部署状态**
   - 访问 https://vercel.com/dashboard
   - 查看 "Deployments" 标签
   - 新版本会出现在列表顶部

---

## 🆘 常见问题

### Q1: 部署失败，显示"Build Error"

**解决方案：**
1. 检查构建日志中的错误信息
2. 确保 Node.js 版本为 18+
3. 验证 `package.json` 没有问题
4. 清理 npm 缓存：`npm cache clean --force`

### Q2: 部署成功但应用无法工作

**解决方案：**
1. 检查环境变量是否已正确配置
2. 确认 API 密钥有效
3. 打开浏览器控制台查看错误信息
4. 检查网络请求是否到达 API 端点

### Q3: 获得 404 错误

**解决方案：**
- 这通常是因为路由问题
- Vercel 已自动配置了 SPA 路由处理
- 如问题持续，联系 Vercel 支持

### Q4: 占卜无法获取 AI 解读

**解决方案：**
1. 检查环保变量配置
2. 验证 API 密钥是否正确
3. 打开 DevTools → Network 检查 API 请求
4. 查看响应状态码和错误信息

### Q5: 如何使用自定义域名？

**步骤：**
1. 在 Vercel 项目设置中进入 "Domains"
2. 添加您的自定义域名
3. 按照说明配置 DNS 记录
4. 等待 DNS 生效（通常 24 小时内）

---

## 📊 部署后的监控

### Vercel 提供的功能

- **性能分析**: 查看应用加载时间和性能指标
- **部署历史**: 查看所有部署版本
- **日志查看**: 实时查看构建和运行日志
- **自动回滚**: 如需要，可快速回滚到上一个版本

### 访问这些功能

1. 访问 https://vercel.com/dashboard
2. 选择您的项目 "LZY-taluo"
3. 浏览各个标签：
   - **Deployments**: 查看部署历史
   - **Settings**: 配置项目设置
   - **Logs**: 查看实时日志
   - **Domains**: 管理域名

---

## 💡 最佳实践

1. **定期备份代码**
   - 使用 Git 管理所有版本
   - 定期推送到 GitHub

2. **监控性能**
   - 定期检查部署日志
   - 使用 Vercel Analytics 监控应用性能

3. **安全管理**
   - 定期轮换 API 密钥
   - 永远不要在代码中硬编码敏感信息
   - 使用 Vercel 环境变量功能

4. **自动化部署**
   - 利用 GitHub 自动触发 Vercel 部署
   - 无需手动部署，推送代码即可

---

## 📞 获取帮助

如需帮助：

1. **Vercel 文档**: https://vercel.com/docs
2. **Vercel 支持**: https://vercel.com/support
3. **GitHub Issues**: 在项目仓库中报告问题

---

## 🎉 恭喜！

您的应用已准备好部署到生产环境！

**现在就开始部署吧：** 👉 https://vercel.com/new

---

**需要帮助？查看上面的故障排除部分或联系 Vercel 支持。** ✨
