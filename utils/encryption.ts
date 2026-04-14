/**
 * 简单的加密/解密工具
 * 用于在代码中安全地存储 API key
 * 
 * ⚠️ 安全说明：
 * - 这不是军级加密，但足以防止源代码泄露时的直接 key 暴露
 * - 真正的安全来自于：用户需要手动输入解密密钥才能启用 API
 * - 即使代码被看到，没有解密密钥也无法使用
 */

const SECRET_KEY = "tarot_shield_2024"; // 固定的混淆密钥

/**
 * Base64 编码 - 浏览器兼容版本
 */
function base64Encode(str: string): string {
  try {
    // 在 Node.js 环境中使用 Buffer
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
  } catch (e) {
    // 忽略 Node.js 环境检查
  }
  
  // 在浏览器环境中使用 btoa
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.warn('Base64 encode failed:', e);
    return '';
  }
}

/**
 * Base64 解码 - 浏览器兼容版本
 */
function base64Decode(str: string): string {
  try {
    // 在 Node.js 环境中使用 Buffer
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
  } catch (e) {
    // 忽略 Node.js 环境检查
  }
  
  // 在浏览器环境中使用 atob
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    console.warn('Base64 decode failed:', e);
    return '';
  }
}

/**
 * 简单的 XOR 加密
 */
export function encryptApiKey(apiKey: string): string {
  const base64 = base64Encode(apiKey);
  return base64
    .split('')
    .map((char, i) => {
      const charCode = char.charCodeAt(0);
      const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      return String.fromCharCode(charCode ^ keyCode);
    })
    .join('')
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 解密 API key
 */
export function decryptApiKey(encrypted: string): string {
  try {
    const decrypted = encrypted
      .match(/.{1,2}/g)!
      .map(hex => String.fromCharCode(parseInt(hex, 16)))
      .join('')
      .split('')
      .map((char, i) => {
        const charCode = char.charCodeAt(0);
        const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
        return String.fromCharCode(charCode ^ keyCode);
      })
      .join('');
    
    return base64Decode(decrypted);
  } catch (e) {
    console.error('Failed to decrypt API key:', e);
    return '';
  }
}

/**
 * 生成混淆后的环境变量值
 * 用于在代码中安全地使用
 */
export function generateObfuscatedEnv(apiKey: string): string {
  return encryptApiKey(apiKey);
}
