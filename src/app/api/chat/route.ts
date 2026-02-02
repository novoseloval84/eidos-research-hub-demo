import { NextRequest, NextResponse } from 'next/server'

// Define provider types
interface AIProvider {
  name: string;
  endpoint: string;
  models: string[];
  headers: (apiKey: string) => Record<string, string>;
  body: (messages: any[], model: string) => any;
  parseResponse?: (data: any) => string; // Optional property
}

// AI providers configuration with Google AI Studio
const AI_PROVIDERS: Record<string, AIProvider> = {
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
      // Convert OpenAI format to Gemini format
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
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
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
      response: `API key not configured for ${AI_PROVIDERS[provider].name}`,
      confidence: 0,
      error: true
    }
  }

  const config = AI_PROVIDERS[provider];
  const model = config.models[0];

  // Prompt based on expert type
  const systemPrompts: Record<string, string> = {
    'Generative AI': `You are an expert in generative AI and creative research. Respond creatively, offer new ideas and approaches. Be specific and propose practical solutions.`,
    'Knowledge Graph': `You are an expert in semantic networks and relationship analysis. Analyze connections and patterns. Explain complex concepts in simple language.`,
    'Life Sciences': `You are an expert in biomedical research and life sciences. Focus on scientific accuracy. Propose specific methods and approaches.`
  };

  const systemPrompt = systemPrompts[expertType] || 'You are an AI research assistant. Respond in detail and professionally.';

  try {
    let url = config.endpoint;
    let body: any;
    let headers = config.headers(apiKey);
    
    // For Google AI Studio add API key to URL
    if (provider === 'google') {
      url = `${config.endpoint}?key=${apiKey}`;
      // For Google remove Authorization header
      headers = config.headers(apiKey);
      delete headers['Authorization'];
    }
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];
    
    body = config.body(messages, model);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`${config.name} API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse response based on provider
    let aiResponse = '';
    if (provider === 'google' && config.parseResponse) {
      aiResponse = config.parseResponse(data);
    } else {
      aiResponse = data.choices?.[0]?.message?.content || 'No response';
    }
    
    return {
      provider: config.name,
      response: aiResponse,
      confidence: 0.85,
      error: false,
      model: model
    };
    
  } catch (error: any) {
    console.error(`${provider} API error:`, error);
    return {
      provider: config.name,
      response: `Error requesting ${config.name}: ${error.message}`,
      confidence: 0,
      error: true
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, expertType, provider = 'groq' } = await request.json();
    
    if (!query || !expertType) {
      return NextResponse.json(
        { error: 'Query and expertType are required' },
        { status: 400 }
      );
    }
    
    // Check if API keys exist for real requests
    const hasApiKeys = process.env.GROQ_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENROUTER_API_KEY;
    
    // If no API keys, use demo mode
    if (!hasApiKeys) {
      const demoResponses: Record<string, string[]> = {
        'Generative AI': [
          "🎯 **Request Analysis**: Your query relates to generative AI capabilities. \n\n✨ **Creative Ideas**: 1. Using diffusion models for generating scientific hypotheses. 2. Applying GPT architectures for automating literature review. \n\n🚀 **Innovative Approaches**: Combining transformers with generative adversarial networks for creating new research patterns.",
          "💡 **Generative Analysis**: Based on your query, I propose synthesizing interdisciplinary approaches using: \n1. Variational autoencoders for feature compression\n2. Transformer architectures for generating text reports\n3. Diffusion models for visualizing research data"
        ],
        'Knowledge Graph': [
          "🕸️ **Semantic Analysis**: Key connections between concepts have been identified. \n\n🔗 **Main Patterns**: 1. Strong correlation between concepts X and Y. 2. Hidden dependencies in data structure discovered. \n\n📊 **Visualization**: Recommend building a knowledge graph with cluster highlighting by thematic proximity.",
          "🌐 **Relationship Analysis**: Network analysis shows three main clusters of interconnections. \n\n🎯 **Key Nodes**: Central concepts requiring additional study have been identified. \n\n🔍 **Recommendations**: Use graph neural networks for predicting new connections."
        ],
        'Life Sciences': [
          "🧬 **Biomedical Analysis**: Based on your query, I recommend the following methods: \n\n🔬 **Experimental Approaches**: 1. CRISPR-Cas9 for gene editing. 2. Single-cell RNA sequencing for analyzing cellular heterogeneity. \n\n📈 **Statistical Methods**: Applying Bayesian inference for analyzing biological data.",
          "🔍 **Scientific Analysis**: In the context of your query, consider: \n1. Proteomic analysis using mass spectrometry\n2. Protein structure modeling with AlphaFold\n3. Metagenomic data analysis for studying microbiome"
        ],
        'Multi-Domain': [
          "🌐 **Interdisciplinary Analysis**: Integrating approaches from different fields. \n\n🎯 **Method Synthesis**: 1. Combining ML algorithms with traditional statistical methods. 2. Using network analysis to identify cross-domain dependencies. \n\n🚀 **Comprehensive Approach**: Propose a framework combining data analysis, visualization, and prediction.",
          "⚡ **Integrative Analysis**: Synthesizing approaches from computer science, biology, and cognitive sciences. \n\n🔗 **Interdisciplinary Connections**: Promising directions at the intersection of AI technologies and biomedical research have been identified."
        ]
      };
      
      const responses = demoResponses[expertType] || [
        "🤖 **AI Analysis**: The system has processed your request. In demo mode, typical results of the expert system operation are presented."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return NextResponse.json({
        success: true,
        mode: 'demo',
        expertType,
        query,
        response: randomResponse,
        provider: 'Demo Mode',
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        agents: ['Analyst', 'Synthesizer', 'Validator'],
        processingTime: '1.2s'
      });
    }
    
    // Real request to AI API
    const result = await queryAIProvider(provider as keyof typeof AI_PROVIDERS, query, expertType);
    
    return NextResponse.json({
      success: !result.error,
      mode: 'live',
      expertType,
      query,
      response: result.response,
      provider: result.provider,
      confidence: result.confidence,
      error: result.error,
      timestamp: new Date().toISOString(),
      model: result.model,
      agents: ['Analyst', 'Synthesizer', 'Validator'],
      processingTime: '2.5s'
    });
    
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
        mode: 'error',
        fallback: 'Using demo mode due to server error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    mode: 'demo',
    available_providers: Object.keys(AI_PROVIDERS),
    expert_types: ['Generative AI', 'Knowledge Graph', 'Life Sciences', 'Multi-Domain'],
    note: 'For real requests, configure API keys in .env.local'
  });
}
