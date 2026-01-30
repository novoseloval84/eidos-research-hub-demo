import { NextRequest, NextResponse } from 'next/server'

// Конфигурация AI провайдеров с Google AI Studio
const AI_PROVIDERS = {
  groq: {
    name: 'Groq Cloud',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama3-70b-8192', 'mixtral-8x7b-32768'],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (messages: any[], model: string) => ({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  },
  google: {
    name: 'Google AI Studio (Gemini)',
    endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
    models: ['gemini-1.5-flash-latest'],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    body: (messages: any[], model: string) => {
      // Конвертируем OpenAI формат в Gemini формат
      const lastMessage = messages[messages.length - 1];
      return {
        contents: [{
          parts: [{
            text: lastMessage.content
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };
    },
    parseResponse: (data: any) => {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа от Gemini';
    }
  },
  openrouter: {
    name: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: ['openai/gpt-3.5-turbo', 'google/palm-2-chat-bison'],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:8880',
      'X-Title': 'Eidos Research Hub'
    }),
    body: (messages: any[], model: string) => ({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  }
}

async function queryAIProvider(provider: keyof typeof AI_PROVIDERS, query: string, expertType: string) {
  let apiKey: string | undefined;
  
  if (provider === 'google') {
    apiKey = process.env.GOOGLE_AI_API_KEY;
  } else {
    apiKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  }
  
  if (!apiKey) {
    return {
      provider: AI_PROVIDERS[provider].name,
      response: `API ключ не настроен для ${AI_PROVIDERS[provider].name}`,
      confidence: 0,
      error: true
    }
  }

  const config = AI_PROVIDERS[provider];
  const model = config.models[0];

  // Промпт в зависимости от эксперта
  const systemPrompts = {
    'Generative AI': `Ты эксперт по генеративному AI и креативным исследованиям. Отвечай креативно, предлагай новые идеи и подходы. Будь конкретным и предлагай практические решения.`,
    'Knowledge Graph': `Ты эксперт по семантическим сетям и анализу связей. Анализируй связи и паттерны. Объясняй сложные концепции простым языком.`,
    'Life Sciences': `Ты эксперт по биомедицинским исследованиям и наукам о жизни. Фокусируйся на научной точности. Предлагай конкретные методы и подходы.`
  };

  const systemPrompt = systemPrompts[expertType as keyof typeof systemPrompts] || 'Ты AI исследовательский ассистент. Отвечай подробно и профессионально.';

  try {
    let url = config.endpoint;
    let body: any;
    let headers = config.headers(
