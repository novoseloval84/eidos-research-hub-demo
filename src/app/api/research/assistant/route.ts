import { NextRequest, NextResponse } from 'next/server'

// AI providers configuration
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
      max_tokens: 1000,
      top_p: 0.9,
      stream: false
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response from model';
    }
  },
  google: {
    name: 'Google AI Studio (Gemini)',
    endpoint: (apiKey: string) => 
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    models: ['gemini-pro'],
    headers: () => ({
      'Content-Type': 'application/json'
    }),
    body: (messages: any[]) => {
      // Collect all messages into a single prompt for Gemini
      const fullPrompt = messages.map(msg => {
        if (msg.role === 'system') return `[SYSTEM INSTRUCTION]: ${msg.content}`;
        if (msg.role === 'user') return `[QUESTION]: ${msg.content}`;
        if (msg.role === 'assistant') return `[ANSWER]: ${msg.content}`;
        return msg.content;
      }).join('\n\n');

      return {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.9,
        }
      };
    },
    parseResponse: (data: any) => {
      try {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 
               data.error?.message || 
               'No response from Gemini';
      } catch (error: any) {
        return `Response parsing error: ${error.message}`;
      }
    }
  }
};

// System prompts for different experts with multi-agent approach
const EXPERT_SYSTEMS = {
  'multi-domain': {
    name: 'Multi-Domain Expert System',
    agents: [
      {
        name: 'Multi-Expert Analyzer',
        role: 'Primary analysis from interdisciplinary perspective',
        prompt: `You are a leading scientific expert with interdisciplinary expertise.
        
Analyze the following research question from the perspective of:
1. Generative AI and machine learning
2. Life sciences and biomedicine
3. Scientific research methodology
4. Semantic analysis and knowledge graphs

Provide deep, structured analysis. Suggest specific methods and approaches.`
      },
      {
        name: 'System Critic-Verifier',
        role: 'Checking integrity and systematicity of analysis',
        prompt: `You are a system critic and verifier of scientific analysis.
        
Check the previous analysis for:
1. Scientific correctness and accuracy
2. Logical integrity
3. Practical feasibility
4. Potential limitations and risks

Suggest improvements and point out weaknesses.`
      },
      {
        name: 'Integrator and Editor',
        role: 'Combining insights into a single structured response',
        prompt: `You are an editor and integrator of scientific content.
        
Combine previous analyses into a single, well-structured response:
1. Use markdown for formatting
2. Highlight key conclusions
3. Suggest specific steps for further actions
4. Indicate potential areas for further research

Make the response professional but accessible.`
      }
    ]
  },
  'generative-ai': {
    name: 'Generative AI Creative System',
    agents: [
      {
        name: 'Idea Generator',
        role: 'Generation of creative ideas and innovative approaches',
        prompt: `You are a creative idea generator in the field of Generative AI.
        
Generate innovative ideas and approaches to solve the given question.
Focus on:
1. Creative applications of generative models
2. Innovative architectures and approaches
3. Interdisciplinary opportunities
4. Future trends and directions

Be bold and original in your suggestions.`
      },
      {
        name: 'Feasibility Analyst',
        role: 'Analysis of practical feasibility of proposed ideas',
        prompt: `You are a practical feasibility analyst.
        
Analyze proposed ideas for:
1. Technical feasibility
2. Resource requirements
3. Potential risks and limitations
4. Alternative approaches

Be critical but constructive.`
      },
      {
        name: 'Structurer-Visionary',
        role: 'Structuring and formatting the final vision',
        prompt: `You are a visionary and structurer.
        
Transform analysis into a clear, structured plan:
1. Implementation stages
2. Key success metrics
3. Potential partners and collaborations
4. Roadmap for the next 1-3 years

Make the response inspiring and practical simultaneously.`
      }
    ]
  },
  'knowledge-graph': {
    name: 'Knowledge Graph Analysis System',
    agents: [
      {
        name: 'Relationship Analyzer',
        role: 'Identifying semantic connections and patterns',
        prompt: `You are an expert in semantic networks and knowledge graphs.
        
Analyze the question from the perspective of:
1. Semantic connections and dependencies
2. Patterns in data and information
3. Network analysis approaches
4. Knowledge extraction methods

Use concepts from graph theory and semantic analysis.`
      },
      {
        name: 'Data Verifier',
        role: 'Verifying accuracy and relevance of identified connections',
        prompt: `You are a data and connections verifier.
        
Check identified connections for:
1. Factual accuracy
2. Statistical significance
3. Relevance of sources
4. Potential cognitive biases

Suggest validation and verification methods.`
      },
      {
        name: 'Knowledge Visualizer',
        role: 'Structuring knowledge into understandable format',
        prompt: `You are a knowledge visualizer and structurer.
        
Present analysis in the form of:
1. Structured ontology
2. Hierarchy of concepts
3. Visual connection diagram
4. Recommendations for further analysis

Use metaphors and analogies for complex concepts.`
      }
    ]
  },
  'life-sciences': {
    name: 'Life Sciences Expert System',
    agents: [
      {
        name: 'Biomedical Expert',
        role: 'Scientific analysis from biomedical perspective',
        prompt: `You are a leading expert in biomedical research.
        
Analyze the question from the position of:
1. Molecular biology and genetics
2. Clinical research and medicine
3. Bioinformatics and omics technologies
4. Pharmacology and drug discovery

Rely on current research and meta-analyses.`
      },
      {
        name: 'Reviewer and Validator',
        role: 'Verifying scientific correctness and reproducibility',
        prompt: `You are a scientific reviewer and validator.
        
Check previous analysis for:
1. Methodological correctness
2. Reproducibility of results
3. Ethical permissibility
4. Compliance with GCP/GLP/GMP standards

Suggest improvements to research protocols.`
      },
      {
        name: 'Translator-Integrator',
        role: 'Adapting complex concepts for interdisciplinary audience',
        prompt: `You are a translator of scientific concepts.
        
Adapt analysis for a broad audience:
1. Explain complex concepts in simple terms
2. Suggest analogies and metaphors
3. Highlight practical significance
4. Indicate potential applications

Make the response understandable for non-specialists.`
      }
    ]
  }
};

// Generate test responses for different expert systems
function generateTestResponse(expertType: string, query: string) {
  const testResponses = {
    'multi-domain': [
      {
        agent: 'Multi-Expert Analyzer',
        response: `🔍 **INTERDISCIPLINARY ANALYSIS**\n\nQuestion: "${query.substring(0, 80)}..."\n\n**1. Generative AI/ML:**\n• Transformer architectures for text analysis\n• Generative models for hypothesis creation\n• RL for research process optimization\n\n**2. Biomedicine:**\n• CRISPR-Cas systems for genetic research\n• Clinical protocols for validation\n• Omics technologies for data analysis\n\n**Conclusion:** Integration of computational and experimental approaches is required.`
      },
      {
        agent: 'System Critic-Verifier',
        response: `🛡️ **ANALYSIS VERIFICATION**\n\n**Check completed:**\n✓ Methodological correctness: high level\n✓ Practical feasibility: medium (requires resources)\n✓ Scientific novelty: present\n\n**Recommendations:**\n1. Start with pilot study\n2. Consider ethical aspects\n3. Develop phased implementation plan\n\n**Risks:** Computational complexity, equipment cost.`
      },
      {
        agent: 'Integrator and Editor',
        response: `📋 **INTEGRATED ACTION PLAN**\n\n## 🔬 Analysis Summary\nInterdisciplinary approach shows high potential for solving the given task.\n\n## 🎯 Recommended Steps\n1. **Stage 1 (1-3 months):** Prototyping and proof-of-concept\n2. **Stage 2 (3-6 months):** Validation on test data\n3. **Stage 3 (6-12 months):** Clinical/experimental trials\n\n## 📊 Key Metrics\n• Accuracy: >85%\n• Reproducibility: >90%\n• Execution time: <24 hours\n\n## 🤝 Potential Collaborations\n• Computational centers\n• Biomedical laboratories\n• Scientific institutes\n\n## 💡 Further Research\nExplore application of quantum computing to accelerate analysis.`
      }
    ],
    'generative-ai': [
      {
        agent: 'Idea Generator',
        response: `💡 **INNOVATIVE IDEAS**\n\nFor "${query.substring(0, 80)}..."\n\n**Creative applications:**\n1. 🌟 Using GAN for molecular structure generation\n2. 🧠 Transformers for scientific article analysis\n3. 🎨 Diffusion models for protein design\n4. 🤖 RL for research process optimization\n5. 👁️ Multimodal models for image and text analysis\n\n**Innovative approaches:**\n• Neuro-symbolic AI\n• Federated learning\n• Meta-learning for rapid adaptation`
      },
      {
        agent: 'Feasibility Analyst',
        response: `📊 **FEASIBILITY ANALYSIS**\n\n**Evaluation of proposed ideas:**\n✓ Ideas 1-3: Technically feasible, require GPU clusters\n✓ Idea 4: Requires additional research\n✓ Idea 5: High potential but complex implementation\n\n**Resource requirements:**\n• Computational: 8+ GPUs\n• Data: 1TB+ labeled data\n• Time: 6-12 months\n\n**Alternatives:**\n• Use of cloud services\n• Collaborations with AI laboratories`
      },
      {
        agent: 'Structurer-Visionary',
        response: `🚀 **IMPLEMENTATION ROADMAP**\n\n## 📅 Timeline\n**Q1 2024:** Prototyping and MVP\n**Q2-Q3 2024:** Validation and optimization\n**Q4 2024:** Pilot implementation\n**2025:** Scaling\n\n## 🎯 Key Goals\n1. Develop working prototype in 3 months\n2. Achieve >80% accuracy on test data\n3. Attract 2+ scientific collaborations\n\n## 🤝 Partnership Strategy\n• Cloud providers (AWS, Google Cloud)\n• Research institutes\n• Startup incubators\n\n## 📈 Expected Impact\n• Research acceleration: 40%\n• Experiment cost reduction: 25%\n• New publications in top journals`
      }
    ],
    'life-sciences': [
      {
        agent: 'Biomedical Expert',
        response: `🧬 **BIOMEDICAL ANALYSIS**\n\n**Question:** "${query.substring(0, 80)}..."\n\n**Molecular biology:**\n• CRISPR-Cas9 for genome editing\n• Single-cell RNA-seq for expression analysis\n• Proteomics for protein interaction studies\n\n**Clinical aspects:**\n• Randomized controlled trials\n• Phase I-III clinical trials\n• Long-term patient monitoring\n\n**Drug Discovery:**\n• In-silico compound screening\n• ADMET predictions\n• Pharmacokinetic modeling`
      },
      {
        agent: 'Reviewer and Validator',
        response: `⚖️ **SCIENTIFIC VERIFICATION**\n\n**Protocol verification:**\n✓ Methodology complies with GLP/GCP\n✓ Statistical power adequate\n✓ Ethical approval required\n\n**Validation:**\n• Results must be reproducible in 3+ laboratories\n• Control groups necessary\n• Blind studies to minimize bias\n\n**Recommendations:**\n1. Approve protocol in ethics committee\n2. Register study (ClinicalTrials.gov)\n3. Plan independent verification`
      },
      {
        agent: 'Translator-Integrator',
        response: `🌐 **PRACTICAL APPLICATION**\n\n## 📋 For Researchers\nDeveloped 4-stage plan with clear success criteria.\n\n## 🏥 For Clinicians\nSpecific protocols proposed for clinical practice implementation.\n\n## 💼 For Investors\n**Business potential:**\n• Payback period: 3-5 years\n• Market: $XX billion\n• Competitive advantages: speed, accuracy\n\n## 🎯 Key Conclusions\n1. Technology ready for pilot trials\n2. Requires $X million investment\n3. First results in 12-18 months\n\n## 🤝 Next Steps\n• Consortium creation\n• Grant application submission\n• Search for industrial partners`
      }
    ],
    'knowledge-graph': [
      {
        agent: 'Relationship Analyzer',
        response: `🕸️ **SEMANTIC ANALYSIS**\n\n**Concepts in question:**\n• Artificial intelligence\n• Biological systems\n• Scientific research\n• Data and information\n\n**Identified connections:**\n1. AI → Data analysis → Scientific discoveries\n2. Biology → Experiments → Validation\n3. Research → Publications → Application\n\n**Patterns:**\n• Interdisciplinarity enhances innovation\n• Cycle: hypothesis → experiment → analysis → conclusion\n• Network effect in scientific collaborations`
      },
      {
        agent: 'Data Verifier',
        response: `🔍 **DATA VALIDATION**\n\n**Confirmation sources:**\n• PubMed: 150+ relevant articles\n• arXiv: 80+ preprints\n• Patents: 20+ applications\n\n**Statistical significance:**\n• Correlations: p < 0.01\n• Effect size: medium to large\n• Power analysis: >80%\n\n**Data recommendations:**\n1. Use multiple independent sources\n2. Apply cross-validation\n3. Consider publication bias`
      },
      {
        agent: 'Knowledge Visualizer',
        response: `📊 **KNOWLEDGE STRUCTURE**\n\n## 🏗️ Ontology\n**Level 1 (Concepts):**\n• AI methods\n• Biological objects\n• Research processes\n\n**Level 2 (Connections):**\n• Analysis → Results\n• Experiments → Data\n• Hypotheses → Verification\n\n**Level 3 (Applications):**\n• Medicine\n• Biotechnology\n• Pharmaceuticals\n\n## 🎨 Visualization\nRecommended tools:\n• Neo4j for knowledge graphs\n• Gephi for network analysis\n• D3.js for interactive visualizations\n\n## 📈 Insights\n1. Most promising connections: AI+Biology\n2. Critical nodes: data validation\n3. Potential breakthroughs: integrative approaches`
      }
    ]
  };

  return testResponses[expertType as keyof typeof testResponses] || testResponses['multi-domain'];
}

// Main request processing function
export async function POST(request: NextRequest) {
  console.log('=== Research Assistant API Called ===');
  
  // Объявим переменные вне try блока, чтобы они были доступны в catch
  let query = '';
  let expertType = 'multi-domain';
  
  try {
    const body = await request.json();
    console.log('Request body:', { 
      query: body.query?.substring(0, 100), 
      expertType: body.expertType,
      testMode: body.testMode
    });

    query = body.query || '';
    expertType = body.expertType || 'multi-domain';
    const testMode = body.testMode || false;
    
    if (!query) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Query is required',
          responses: [] 
        },
        { status: 400 }
      );
    }

    // Get settings for selected expert system
    const expertSystem = EXPERT_SYSTEMS[expertType as keyof typeof EXPERT_SYSTEMS];
    if (!expertSystem) {
      return NextResponse.json(
        { 
          success: false,
          error: `Expert system "${expertType}" not found`,
          responses: [] 
        },
        { status: 400 }
      );
    }

    // === ALWAYS USE TEST MODE ===
    console.log('Using TEST MODE - generating mock responses');
    const testResponses = generateTestResponse(expertType, query);
    
    return NextResponse.json({
      success: true,
      responses: [{
        provider: 'Demo Mode (LLMs not available)',
        model: 'demo-model',
        response: testResponses[testResponses.length - 1].response,
        confidence: 85,
        tokens: 450,
        error: false,
        demoMode: true,
        agentSteps: testResponses.map((r, i) => ({
          agent: r.agent,
          action: expertSystem.agents[i]?.role || 'Analysis',
          result: r.response.substring(0, 150) + '...',
          timestamp: new Date().toISOString()
        }))
      }],
      timestamp: new Date().toISOString(),
      mode: expertType,
      demoMode: true,
      info: 'Running in demo mode. Add API keys to connect to real LLMs.'
    });

  } catch (error: any) {
    console.error('Fatal error:', error);
    
    // On fatal error return simple test response
    // Теперь query доступна, потому что объявлена вне try блока
    const simpleResponse = `📊 **DEMONSTRATION RESPONSE**\n\nSystem is running in demonstration mode.\n\n**Question:** ${query?.substring(0, 100) || 'Not specified'}\n\n**Key recommendations:**\n1. Start with pilot study\n2. Test multiple approaches\n3. Collect feedback\n\n**Next steps:**\n• Configure API keys for real analysis\n• Study documentation\n• Test different expert systems`;
    
    return NextResponse.json({
      success: true,
      responses: [{
        provider: 'Emergency Demo Mode',
        model: 'emergency-demo',
        response: simpleResponse,
        confidence: 70,
        tokens: 250,
        error: false,
        emergencyMode: true,
        agentSteps: [
          {
            agent: 'Emergency Handler',
            action: 'Generating demo response',
            result: 'Created basic demonstration response',
            timestamp: new Date().toISOString()
          }
        ]
      }],
      timestamp: new Date().toISOString(),
      mode: expertType,
      demoMode: true,
      warning: '⚠️ System error. Emergency demo mode is used.',
      info: 'Service is running in limited demonstration mode.'
    });
  }
}

// GET request to get system information
export async function GET() {
  const hasGroqKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  const hasGoogleKey = !!process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY !== 'your_google_ai_studio_key_here';
  
  return NextResponse.json({
    status: 'ok',
    demoMode: true,
    realModeAvailable: hasGroqKey || hasGoogleKey,
    availableProviders: {
      groq: hasGroqKey,
      google: hasGoogleKey
    },
    expertSystems: Object.keys(EXPERT_SYSTEMS),
    info: 'System operates in demonstration mode without connection to LLMs',
    timestamp: new Date().toISOString()
  });
}
