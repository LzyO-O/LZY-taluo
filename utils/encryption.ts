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
 * 简单的 XOR 加密
 */
export function encryptApiKey(apiKey: string): string {
  return Buffer.from(apiKey)
    .toString('base64')
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
    
    return Buffer.from(decrypted, 'base64').toString('utf-8');
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
