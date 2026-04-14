import { DrawnCard, Spread, Topic } from "../types";
import { decryptApiKey } from "../utils/encryption";

// ============================================================================
// ⚙️ 配置区域 (Configuration)
// ============================================================================

// 备用的混淆 API key（已混淆，开源后也安全）
const FALLBACK_OBFUSCATED_KEY = "1753011b170839263d22262f11744061500e33193922190a3259502f33337c697f63410b103b226f3d2d0d3c3d09665c660158463343031c06435d3a3f3b1c0f66665e7f";

// 获取配置（优先级：localStorage > 环境变量 > 备用 key）
export const getApiConfig = () => {
  // 尝试从 localStorage 读取用户自定义配置
  const storedKey = localStorage.getItem("tarot_custom_key");
  const storedUrl = localStorage.getItem("tarot_custom_url");
  
  // 从环境变量读取（可能是混淆的）
  let envKey = import.meta.env.VITE_GEMINI_API_KEY ?? "";
  
  // 调试日志：输出环境变量状态
  console.log("[Tarot Config] 开始加载配置");
  console.log("[Tarot Config] localStorage key 存在：", !!storedKey);
  console.log("[Tarot Config] 环境变量 VITE_GEMINI_API_KEY 存在：", !!envKey);
  console.log("[Tarot Config] 环境变量 key 长度：", envKey?.length || 0);
  
  // 如果环境变量为空，使用备用的混淆 key
  if (!envKey) {
    console.log("[Tarot Config] 环境变量为空，使用 FALLBACK_OBFUSCATED_KEY");
    envKey = FALLBACK_OBFUSCATED_KEY;
  }
  
  // 如果 key 看起来是混淆的（很长且由十六进制字符组成），则解密
  if (envKey && /^[0-9a-f]{100,}$/i.test(envKey)) {
    console.log("[Tarot Config] 检测到混淆 key，尝试解密");
    try {
      envKey = decryptApiKey(envKey);
      console.log("[Tarot Config] 解密成功，key 长度：", envKey.length);
    } catch (e) {
      console.warn("[Tarot Config] 解密失败：", e);
    }
  } else if (envKey) {
    console.log("[Tarot Config] Key 不符合混淆格式，直接使用");
  }
  
  const finalKey = storedKey || envKey;
  const finalUrl = storedUrl || (import.meta.env.VITE_GEMINI_API_ENDPOINT ?? "https://api-666.cc/v1/chat/completions");
  
  // 调试日志：输出最终配置
  console.log("[Tarot Config] 最终 API key 来源：", storedKey ? "localStorage" : "环境变量/备用");
  console.log("[Tarot Config] 最终 API endpoint：", finalUrl);
  console.log("[Tarot Config] API key 长度：", finalKey?.length || 0);
  
  // 使用优先级：localStorage > 解密后的 envKey/备用 key
  return {
    apiKey: finalKey,
    baseUrl: finalUrl
  };
};

// 保存配置
export const saveApiConfig = (apiKey: string, baseUrl: string) => {
  localStorage.setItem("tarot_custom_key", apiKey);
  localStorage.setItem("tarot_custom_url", baseUrl);
};

// 2. 模型配置列表 (按优先级尝试)
// ⚠️ 用户严格指定：仅使用该特定模型 ID，不使用其他备用模型
const MODELS_TO_TRY = [
    "gemini-3.1-pro-preview"
];

// ============================================================================

/**
 * 封装后的请求函数
 */
async function fetchCompletion(
  messages: any[], 
  model: string,
  apiKey: string,
  baseUrl: string
): Promise<Response> {
  // 智能处理 URL：如果用户只填了域名（如 https://api-666.cc/），自动补全路径
  let finalUrl = baseUrl.trim();
  // 如果不包含 v1/chat/completions 且不是完整的路径，尝试补全
  if (!finalUrl.endsWith('/chat/completions')) {
      finalUrl = finalUrl.replace(/\/$/, ''); // 去除末尾斜杠
      // 检查是否已经有 v1
      if (finalUrl.endsWith('/v1')) {
          finalUrl += '/chat/completions';
      } else {
          finalUrl += '/v1/chat/completions';
      }
  }

  console.log("[Fetch Completion] 准备发送 API 请求");
  console.log("[Fetch Completion] 最终 URL：", finalUrl);
  console.log("[Fetch Completion] 模型：", model);
  console.log("[Fetch Completion] API Key 长度：", apiKey?.length || 0);
  console.log("[Fetch Completion] 消息数量：", messages?.length || 0);

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    console.log("[Fetch Completion] 收到响应，状态码：", response.status);
    return response;
  } catch (error) {
    console.error("[Fetch Completion] 请求失败：", error);
    throw error;
  }
}

export const getTarotReading = async (
  topic: Topic | null,
  spread: Spread,
  cards: DrawnCard[]
): Promise<string> => {
  console.log("[Tarot Reading] 开始生成塔罗解读");
  const { apiKey, baseUrl } = getApiConfig();
  
  console.log("[Tarot Reading] 加载完成 - API key 长度：", apiKey?.length || 0);
  console.log("[Tarot Reading] 使用的 endpoint：", baseUrl);

  if (!apiKey || apiKey.trim() === "") {
    const errMsg = "⚠️ 配置错误：未检测到有效的 API Key。\n\n本地开发：请在项目根目录创建 .env.local 文件，配置 VITE_GEMINI_API_KEY\n线上部署：请在平台（Vercel/Netlify等）中配置环境变量 VITE_GEMINI_API_KEY\n\n您也可以点击右上角设置图标手动配置密钥。";
    console.error("[Tarot Reading] API Key 缺失！", errMsg);
    return errMsg;
  }

  const topicName = topic ? topic.name : "综合运势";
  const topicDesc = topic ? topic.description : "一般性指导";

  const cardDescriptions = cards
    .map(
      (c) =>
        `位置 ${c.positionId} - ${spread.positions.find((p) => p.id === c.positionId)?.name}:
         牌名: ${c.card.name} (${c.isReversed ? '逆位' : '正位'})
         画面描述与含义: ${c.isReversed ? c.card.meaningReversed : c.card.meaningUpright}`
    )
    .join('\n\n');

  const systemPrompt = `你是一位精通神秘学、心理学与象征符号的塔罗大师。你的语言风格应当神秘、优美、富有洞察力，就像一位拥有古老智慧的智者在与求问者进行灵魂对话。请全程使用中文回答。`;

  const userMessage = `
    本次占卜的主题是：**${topicName}** (${topicDesc})
    使用的牌阵是：**${spread.name}**
    
    以下是抽出的塔罗牌（按牌阵位置顺序）：
    ${cardDescriptions}
    
    请根据以上信息，为求问者提供一份深度的解读。请严格按照以下 Markdown 格式输出：
    
    ## 🔮 灵视综述
    用一段充满画面感和诗意的语言，概括整组牌面所呈现的能量场，直接回应求问者关于“${topicName}”的关切。
    
    ## 🃏 牌面低语
    逐一解析每一张牌。请不要只罗列关键词，而是要结合“${topicName}”这个主题，讲述牌面符号在当前位置所传达的具体讯息。
    *(请为每一张牌的解析使用三级标题 ###)*
    
    ## 🌟 命运指引
    综合所有牌面的启示，给出一段具体的、具有建设性的行动建议或心灵指引。告诉求问者下一步该如何做，或者应该保持怎样的心态。
    
    请注意：
    1. 语气要温暖而坚定，富有同理心。
    2. 解释要具体联系到"${topicName}"。
  `;

  const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
  ];

  let lastErrorDetail = "";
  let successModel = "";

  // 🔄 轮询尝试模型列表
  for (const model of MODELS_TO_TRY) {
      try {
          console.log(`[Tarot AI] Trying model: ${model} at ${baseUrl}...`);
          const response = await fetchCompletion(messages, model, apiKey, baseUrl);

          if (response.ok) {
              const data = await response.json();
              
              // 🔍 深度检查：有些中转站即使返回 200，错误信息也藏在 body 里
              if (data.error) {
                  const errMsg = data.error.message || JSON.stringify(data.error);
                  console.warn(`[Tarot AI] Model ${model} returned 200 but with error:`, errMsg);
                  throw new Error(`API Error: ${errMsg}`);
              }

              if (data?.choices?.[0]?.message?.content) {
                  successModel = model;
                  console.log(`[Tarot AI] Success with model: ${model}`);
                  return data.choices[0].message.content;
              } else {
                  console.warn(`[Tarot AI] Model ${model} returned invalid structure:`, data);
                  // 尝试提取更具体的错误信息
                  const debugInfo = JSON.stringify(data).slice(0, 100);
                  throw new Error(`服务器返回数据格式异常 (Missing 'choices'): ${debugInfo}`);
              }
          } else {
              // 处理非 200 错误
              let errorMsg = `HTTP ${response.status}`;
              try {
                  const errorText = await response.text();
                  try {
                      const jsonErr = JSON.parse(errorText);
                      if (jsonErr.error && jsonErr.error.message) {
                          errorMsg = jsonErr.error.message;
                      } else if (jsonErr.message) {
                          errorMsg = jsonErr.message;
                      } else {
                          errorMsg = JSON.stringify(jsonErr);
                      }
                  } catch {
                      errorMsg = errorText.slice(0, 200);
                  }
              } catch {}

              console.warn(`[Tarot AI] Model ${model} failed: ${errorMsg}`);
              throw new Error(errorMsg);
          }
      } catch (error: any) {
          console.warn(`[Tarot AI] Error with ${model}:`, error);
          lastErrorDetail = error.message || String(error);
      }
  }

  console.error("[Tarot AI] All models exhausted.");
  
  let friendlyMsg = "🌌 星辰的信号暂时中断。";
  
  if (lastErrorDetail) {
      if (lastErrorDetail.includes("quota") || lastErrorDetail.includes("balance")) {
          friendlyMsg += "\n(原因：API 额度/余额不足)";
      } else if (lastErrorDetail.includes("model_not_found") || lastErrorDetail.includes("Invalid model")) {
          friendlyMsg += "\n(原因：指定的模型ID在中转站不存在或写错)";
      } else if (lastErrorDetail.includes("Failed to fetch") || lastErrorDetail.includes("NetworkError")) {
          friendlyMsg += "\n(原因：网络连接失败，请检查网络或代理设置)";
      } else if (lastErrorDetail.includes("safety")) {
          friendlyMsg += "\n(原因：触发了AI的安全内容审查)";
      } else {
          // 显示具体的错误信息，方便排查
          const cleanError = lastErrorDetail.replace(/[{}"\\]/g, ' ').trim();
          friendlyMsg += `\n(错误详情: ${cleanError.substring(0, 100)}...)`;
      }
  }
  friendlyMsg += "\n\n💡 建议：请核对右上角⚙️设置中的密钥，或确认该模型ID是否支持。";
  
  return friendlyMsg;
};