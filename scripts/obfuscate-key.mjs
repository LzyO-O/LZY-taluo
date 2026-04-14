#!/usr/bin/env node

/**
 * 生成混淆后的 API key 的脚本
 * 用法: node scripts/obfuscate-key.mjs "your-actual-api-key"
 */

const SECRET_KEY = "tarot_shield_2024";

function encryptApiKey(apiKey) {
  const base64 = Buffer.from(apiKey).toString('base64');
  let encrypted = '';
  
  for (let i = 0; i < base64.length; i++) {
    const charCode = base64.charCodeAt(i);
    const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    const xored = charCode ^ keyCode;
    encrypted += xored.toString(16).padStart(2, '0');
  }
  
  return encrypted;
}

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('❌ 错误：请提供 API key');
  console.error('用法: node scripts/obfuscate-key.mjs "your-api-key"');
  process.exit(1);
}

if (apiKey.length < 20) {
  console.error('❌ 错误：API key 看起来太短');
  process.exit(1);
}

const obfuscated = encryptApiKey(apiKey);

console.log('✅ 混淆成功！');
console.log('');
console.log('原始 API key 长度:', apiKey.length);
console.log('混淆后长度:', obfuscated.length);
console.log('');
console.log('📌 请在部署时使用以下值作为环境变量：');
console.log('');
console.log('VITE_GEMINI_API_KEY=' + obfuscated);
console.log('');
console.log('⚠️ 注意：');
console.log('1. 这个混淆值是"模糊"而非"加密"，其目的是防止源代码泄露时的直接key暴露');
console.log('2. 即使代码被看到，没有混淆密钥也无法解密');
console.log('3. 真正的安全来自于源代码的私密性');
console.log('');
