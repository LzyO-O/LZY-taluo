#!/bin/bash

# 🚀 Destiny Tarot - Vercel 部署脚本
# 这个脚本将帮助您快速部署应用到 Vercel

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 Destiny Tarot - Vercel 部署助手                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 检查 Vercel CLI 是否已安装
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI 未检测到，正在安装..."
    npm install -g vercel
    echo "✅ Vercel CLI 安装完成"
else
    echo "✅ Vercel CLI 已安装"
fi

echo ""
echo "🔐 下一步需要登录 Vercel..."
echo "如果这是您的第一次部署，系统会打开浏览器让您授权。"
echo ""

# 登录 Vercel
vercel login

echo ""
echo "📤 开始部署到 Vercel..."
echo ""

# 部署应用
vercel --prod

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ 部署完成！                                                 ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  您的应用已部署到 Vercel！                                     ║"
echo "║                                                                ║"
echo "║  📝 重要提醒：                                                  ║"
echo "║  1. 访问 https://vercel.com 查看部署状态                       ║"
echo "║  2. 配置环境变量（如未自动配置）：                             ║"
echo "║     - VITE_GEMINI_API_KEY                                      ║"
echo "║     - VITE_GEMINI_API_ENDPOINT                                 ║"
echo "║  3. 环境变量配置后，应用会自动重新部署                         ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 下次更新时，只需运行："
echo "   git push origin main"
echo "   Vercel 会自动部署新版本！"
echo ""
