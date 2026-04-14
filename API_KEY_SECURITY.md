# 🔐 API Key 安全指南

本项目实现了 **API Key 混淆**机制，确保即使代码被公开，也不会直接泄露真实的 API key。

## 安全机制说明

### ✅ 安全流程

1. **混淆存储**：你的真实 API key 被转换为十六进制混淆值
2. **代码保护**：混淆值存储在环境变量中，源代码不包含真实 key
3. **运行时解密**：应用在运行时自动解密混淆值
4. **源代码透明**：即使 GitHub 仓库是公开的，没有混淆密钥也无法解密

### ⚠️ 安全说明

- 这是**混淆**而非**加密**，目的是防止源代码泄露时的直接 key 暴露
- 真正的安全来自于：
  - ✅ 环境变量的私密性
  - ✅ 部署平台（GitHub Pages）不显示环境变量
  - ✅ 混淆密钥不在源代码中公开

## 如何使用

### 方式 1️⃣：生成混淆后的 API Key

如果你有自己的 API key，需要混淆它：

```bash
node scripts/obfuscate-key.mjs "your-actual-api-key"
```

输出示例：
```
VITE_GEMINI_API_KEY=1753011b170839263d22262f11744061...
```

### 方式 2️⃣：部署到 GitHub Pages

1. **设置 GitHub Secret**（如果需要）
   - 访问 GitHub 仓库 → Settings → Secrets and variables → Actions
   - 创建 `GEMINI_API_KEY_ENCRYPTED` secret，值为混淆后的 key

2. **配置 GitHub Actions**
   - 在 workflow 中使用该 secret 设置环境变量

3. **或者，直接在部署配置中使用混淆值**
   - GitHub Pages 在 `/.github/workflows/deploy.yml` 中配置

### 方式 3️⃣：部署到 Vercel/Netlify

1. **生成混淆 key**
   ```bash
   node scripts/obfuscate-key.mjs "your-actual-api-key"
   ```

2. **在平台中设置环境变量**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Build & deploy → Environment
   
   添加：
   ```
   VITE_GEMINI_API_KEY=<混淆后的值>
   VITE_GEMINI_API_ENDPOINT=https://api-666.cc/v1/chat/completions
   ```

3. **重新部署**

## 解密工作原理

混淆使用了**固定的混淆密钥**（`tarot_shield_2024`），代码会自动：

1. 检测环境变量 `VITE_GEMINI_API_KEY` 是否为混淆格式（长十六进制字符串）
2. 如果是，使用内置密钥自动解密
3. 使用解密后的真实 key 调用 API

## 文件说明

| 文件 | 说明 |
|------|------|
| `utils/encryption.ts` | 加密/解密函数库 |
| `scripts/obfuscate-key.mjs` | 生成混淆 key 的脚本 |
| `services/geminiService.ts` | 已更新，支持自动解密 |

## 本地开发

本地开发时，你有两种选择：

### 选项 A：使用真实 key（推荐快速测试）
```bash
# 创建 .env.local 文件
echo "VITE_GEMINI_API_KEY=sk-your-actual-key" > .env.local
npm run dev
```

### 选项 B：使用混淆 key
```bash
# 创建 .env.local 文件
echo "VITE_GEMINI_API_KEY=1753011b170839263d22262f11744061..." > .env.local
npm run dev
```

## 常见问题

### Q: 代码中的混淆密钥 `tarot_shield_2024` 是什么？
A: 这是内置的解密密钥，用于自动解密混淆的 API key。它存储在代码中是安全的，因为：
- 混淆值 + 混淆密钥 ≠ 真实 key（需要正确的解密算法）
- 没有源代码，仅有混淆值是无法解密的

### Q: 这是完全安全的吗？
A: 不是 100% 安全，但在以下场景中足够安全：
- ✅ 防止源代码无意中被提交真实 key
- ✅ 防止公开 GitHub 仓库中的 key 直接暴露
- ❌ 不能防止：反向工程、代码审计等高级威胁

### Q: 如何更新 API key？
A: 
1. 使用新的 key 运行混淆脚本
2. 更新部署平台中的环境变量
3. 重新部署

### Q: 混淆后的 key 很长，这是正常的吗？
A: 是的，这是正常的。原始 key 约 51 字符，混淆后约 136 字符（每个字节转换为 2 位十六进制）。

## 安全最佳实践

1. ✅ 从不在代码中硬编码真实的 API key
2. ✅ 使用环境变量存储混淆值
3. ✅ 定期轮换 API key
4. ✅ 监控 API 使用情况
5. ✅ 如果发现 key 泄露，立即创建新 key 并更新部署

---

**祝你部署顺利！🚀**
