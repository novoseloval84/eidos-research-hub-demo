"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faProjectDiagram, 
  faDna, 
  faCommentMedical,
  faPaperclip,
  faLightbulb,
  faBrain,
  faSpinner,
  faUsers,
  faChartLine,
  faMicroscope,
  faShieldAlt,
  faEdit,
  faCheckCircle,
  faLayerGroup,
  faExclamationTriangle,
  faToggleOn
} from '@fortawesome/free-solid-svg-icons';

interface AIResponse {
  provider: string;
  response: string;
  confidence: number;
  model: string;
  tokens?: number;
  error: boolean;
  needsApiKey?: boolean;
  agentSteps?: AgentStep[];
  testMode?: boolean;
  demoMode?: boolean;
  fallbackMode?: boolean;
}

interface AgentStep {
  agent: string;
  action: string;
  result: string;
  timestamp: string;
  fallback?: boolean;
}

interface ApiResult {
  success: boolean;
  responses: AIResponse[];
  timestamp: string;
  mode: string;
  availableProviders?: string[];
  warning?: string;
  error?: string;
  info?: string;
  testMode?: boolean;
  demoMode?: boolean;
  fallbackMode?: boolean;
}

// Simple markdown parser
const SimpleMarkdownRenderer = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold mt-3 mb-1">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold mt-2 mb-1">{line.substring(4)}</h3>;
        }
        
        if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\./.test(line)) {
          return (
            <div key={index} className="flex items-start ml-4">
              <span className="mr-2">•</span>
              <span>{line.replace(/^[-*\d.]+ /, '')}</span>
            </div>
          );
        }
        
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        if (line.trim() === '') {
          return <div key={index} className="h-3"></div>;
        }
        
        return (
          <p key={index} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
      })}
    </div>
  );
};

// Configuration of multi-agent systems for different modalities
const AGENT_SYSTEMS = {
  'generative-ai': {
    name: 'Generative AI',
    icon: faRobot,
    color: 'bg-ai-pink',
    agents: [
      { 
        name: 'Idea Generator', 
        role: 'Generates creative ideas and approaches',
        model: 'gemini-pro',
        color: 'from-pink-400 to-rose-500'
      },
      { 
        name: 'Critic-Analyst', 
        role: 'Analyzes feasibility and risks',
        model: 'llama3-70b',
        color: 'from-purple-500 to-indigo-600'
      },
      { 
        name: 'Expert Editor', 
        role: 'Structures and formats the final response',
        model: 'gpt-4',
        color: 'from-blue-500 to-cyan-600'
      }
    ],
    description: 'Creative synthesis and generation of innovative solutions'
  },
  'knowledge-graph': {
    name: 'Knowledge Graph',
    icon: faProjectDiagram,
    color: 'bg-dna-purple',
    agents: [
      { 
        name: 'Relationship Analyzer', 
        role: 'Identifies semantic connections and patterns',
        model: 'gemini-pro',
        color: 'from-purple-500 to-violet-600'
      },
      { 
        name: 'Data Verifier', 
        role: 'Checks accuracy and relevance of information',
        model: 'llama3-70b',
        color: 'from-indigo-500 to-blue-600'
      },
      { 
        name: 'Visualizer', 
        role: 'Structures knowledge into understandable format',
        model: 'gpt-4',
        color: 'from-teal-500 to-emerald-600'
      }
    ],
    description: 'Analysis of semantic networks and pattern identification'
  },
  'life-sciences': {
    name: 'Life Sciences',
    icon: faDna,
    color: 'bg-lab-green',
    agents: [
      { 
        name: 'Biomedical Expert', 
        role: 'Analyzes from biomedical perspective',
        model: 'gemini-pro',
        color: 'from-green-500 to-emerald-600'
      },
      { 
        name: 'Research Methodologist', 
        role: 'Verifies scientific correctness',
        model: 'llama3-70b',
        color: 'from-lime-500 to-green-600'
      },
      { 
        name: 'Clinical Editor', 
        role: 'Adapts for practical application',
        model: 'gpt-4',
        color: 'from-cyan-500 to-blue-600'
      }
    ],
    description: 'Scientific analysis in the field of biomedicine'
  },
  'multi-domain': {
    name: 'Multi-Domain',
    icon: faMicroscope,
    color: 'bg-med-blue',
    agents: [
      { 
        name: 'Multi-Expert', 
        role: 'Analyzes from interdisciplinary perspective',
        model: 'gemini-pro',
        color: 'from-blue-500 to-cyan-600'
      },
      { 
        name: 'System Critic', 
        role: 'Checks integrity and systematicity',
        model: 'llama3-70b',
        color: 'from-indigo-500 to-purple-600'
      },
      { 
        name: 'Integrator', 
        role: 'Combines insights into unified picture',
        model: 'gpt-4',
        color: 'from-violet-500 to-pink-600'
      }
    ],
    description: 'Comprehensive interdisciplinary analysis'
  }
};

export default function ResearchAssistant() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [expertMode, setExpertMode] = useState<'multi-domain' | 'generative-ai' | 'life-sciences' | 'knowledge-graph'>('multi-domain');
  const [showAgentDetails, setShowAgentDetails] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Please enter your research question');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setShowAgentDetails(true);

    try {
      const response = await fetch('/api/research/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          expertType: expertMode
        }),
      });

      const data = await response.json();
      setResult(data);
      
      if (!data.success && !data.testMode && !data.demoMode) {
        alert(data.error || 'An error occurred while processing the request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to the service. The system is running in demo mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const currentSystem = AGENT_SYSTEMS[expertMode];
  const examples = {
    'generative-ai': [
      "Generate 5 innovative ideas for applying generative AI in medicine",
      "How can diffusion models be used for designing new molecules?",
      "Suggest creative approaches to automating scientific discoveries"
    ],
    'knowledge-graph': [
      "Analyze connections between neuroscience and machine learning",
      "What patterns can be identified in the history of scientific discoveries?",
      "Build a semantic map for the topic 'artificial intelligence in biology'"
    ],
    'life-sciences': [
      "What are promising directions for CRISPR application combined with AI?",
      "Analyze modern methods for omics data analysis",
      "What are breakthrough approaches in drug discovery using machine learning?"
    ],
    'multi-domain': [
      "How will the integration of AI and biotechnology change medicine in the next 10 years?",
      "Analyze interdisciplinary opportunities at the intersection of quantum computing and biology",
      "What ethical issues arise when using AI in biomedical research?"
    ]
  };

  return (
    <section className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8 rounded-3xl mx-8 my-8 max-w-6xl mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dna-purple to-ai-pink flex items-center justify-center text-white text-2xl">
          <FontAwesomeIcon icon={faBrain} />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">AI Research Assistant</h2>
          <p className="text-gray-dark">Multi-agent expert analysis system</p>
        </div>
      </div>

      {/* Demo mode notification */}
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-xl" />
          <div>
            <h3 className="font-bold text-amber-800">Demonstration Mode</h3>
            <p className="text-amber-700 text-sm">
              The system operates without connection to LLMs. Demo data is used for interface testing.
              Add API keys to .env.local to connect to real models.
            </p>
          </div>
        </div>
      </div>

      {/* Expertise selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select expertise:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(AGENT_SYSTEMS) as [keyof typeof AGENT_SYSTEMS, any][]).map(([mode, system]) => (
            <button
              key={mode}
              onClick={() => setExpertMode(mode)}
              className={`p-4 rounded-2xl border-2 transition-all transform ${
                expertMode === mode 
                  ? `${system.color} border-white shadow-xl scale-[1.02] text-white` 
                  : 'bg-white border-gray-200 hover:border-dna-purple hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl ${expertMode === mode ? 'bg-white/20' : system.color} flex items-center justify-center`}>
                  <FontAwesomeIcon 
                    icon={system.icon} 
                    className={expertMode === mode ? 'text-white' : 'text-white'} 
                  />
                </div>
                <div className="text-left">
                  <div className={`font-bold ${expertMode === mode ? 'text-white' : 'text-gray-900'}`}>
                    {system.name}
                  </div>
                  <div className={`text-xs ${expertMode === mode ? 'text-white/80' : 'text-gray-600'}`}>
                    {system.agents.length} agents
                  </div>
                </div>
              </div>
              <div className={`text-sm ${expertMode === mode ? 'text-white/90' : 'text-gray-700'}`}>
                {system.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Information about selected multi-agent system */}
      <div className="mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Multi-agent system: {currentSystem.name}</h3>
          <button
            onClick={() => setShowAgentDetails(!showAgentDetails)}
            className="text-sm text-dna-purple hover:text-ai-pink flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            {showAgentDetails ? 'Hide details' : 'Show agents'}
          </button>
        </div>
        
        {showAgentDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {currentSystem.agents.map((agent, index) => (
              <div key={index} className="p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center text-white`}>
                    {index === 0 ? <FontAwesomeIcon icon={faRobot} /> :
                     index === 1 ? <FontAwesomeIcon icon={faShieldAlt} /> :
                     <FontAwesomeIcon icon={faEdit} />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-600">{agent.model}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-700">{agent.role}</div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="text-xs text-gray-500">
                    {index === 0 ? '🎯 Generation' : 
                     index === 1 ? '🛡️ Verification' : 
                     '✏️ Editing'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 text-sm text-gray-600">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Works as a chain of {currentSystem.agents.length} AI agents
        </div>
      </div>

      {/* Example questions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Examples for {currentSystem.name}:</h3>
        <div className="flex flex-wrap gap-2">
          {examples[expertMode].map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-4 py-3 bg-white border border-gray-light rounded-xl hover:border-dna-purple hover:shadow transition-all text-left max-w-xs group"
            >
              <div className="text-sm text-gray-dark line-clamp-2 group-hover:text-dna-purple">
                {example}
              </div>
              <div className="text-xs text-gray-400 mt-1">Click to use</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main form */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faCommentMedical} className="text-gray-dark" />
          <h3 className="text-xl font-bold">Research Query</h3>
          <span className="ml-2 bg-gradient-to-r from-lab-green to-research-teal text-white px-3 py-1 rounded-full text-sm font-semibold">
            Multi-agent analysis
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter your research question for ${currentSystem.name} system...

Example: '${examples[expertMode][0]}'`}
            className="w-full p-5 border-2 border-gray-light rounded-xl text-lg resize-y min-h-[150px] mb-4 focus:border-dna-purple focus:outline-none transition-colors"
            disabled={isLoading}
          />

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-gray-dark">
              <FontAwesomeIcon icon={faPaperclip} />
              <span className="hidden md:inline">Attach research materials</span>
              <span className="md:hidden">Attach files</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-dna-purple to-ai-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Launching agents...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBrain} />
                  Start analysis
                </>
              )}
            </button>
          </div>
        </form>

        {/* Multi-agent analysis process */}
        {isLoading && (
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-ai-pink" />
              <h4 className="text-lg font-semibold text-ai-pink">Multi-agent analysis in progress</h4>
            </div>

            <div className="space-y-6">
              {currentSystem.agents.map((agent, index) => (
                <div key={index} className="relative">
                  {/* Connection line between agents */}
                  {index < currentSystem.agents.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${agent.color} flex items-center justify-center text-white shadow-md`}>
                        {index === 0 ? <FontAwesomeIcon icon={faRobot} /> :
                         index === 1 ? <FontAwesomeIcon icon={faShieldAlt} /> :
                         <FontAwesomeIcon icon={faEdit} />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="font-semibold">{agent.name}</div>
                          <div className="text-sm text-gray-600">{agent.role}</div>
                        </div>
                        <div className="text-sm text-gray-500">{agent.model}</div>
                      </div>
                      
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full bg-gradient-to-r ${agent.color} rounded-full transition-all duration-1000`}
                          style={{ 
                            width: isLoading ? `${33 + index * 33}%` : '0%',
                            animationDelay: `${index * 500}ms`
                          }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-700">
                        {index === 0 && '🎯 Initial analysis generation...'}
                        {index === 1 && '🛡️ Verification and checking...'}
                        {index === 2 && '✏️ Final editing...'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-dark">
                <FontAwesomeIcon icon={faUsers} className="text-dna-purple" />
                <span>{currentSystem.agents.length} AI agents are working on your request...</span>
              </div>
            </div>
          </div>
        )}

        {/* Analysis results */}
        {result && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLightbulb} className="text-ai-pink" />
                <h4 className="text-lg font-semibold text-ai-pink">Analysis Results</h4>
                
                {(result.testMode || result.demoMode) && (
                  <span className="ml-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FontAwesomeIcon icon={faToggleOn} />
                    Demo Mode
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-dark">
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {result.warning && (
              <div className={`mb-4 p-4 rounded-xl ${
                result.testMode || result.demoMode
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <p className={result.testMode || result.demoMode ? 'text-amber-800' : 'text-yellow-800'}>
                  {result.warning}
                </p>
                {result.info && (
                  <p className={`text-sm mt-1 ${result.testMode || result.demoMode ? 'text-amber-700' : 'text-yellow-700'}`}>
                    {result.info}
                  </p>
                )}
              </div>
            )}

            {result.responses.map((response, index) => (
              <div key={index} className="mb-6">
                {/* Agent process if available */}
                {response.agentSteps && response.agentSteps.length > 0 && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200">
                    <h5 className="font-semibold mb-3 text-gray-700">Agent Work Process:</h5>
                    <div className="space-y-3">
                      {response.agentSteps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.agent.includes('Generator') ? 'bg-pink-100 text-pink-600' :
                            step.agent.includes('Critic') ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {step.agent.includes('Generator') ? '🤖' :
                             step.agent.includes('Critic') ? '🛡️' : '✏️'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{step.agent}</div>
                            <div className="text-xs text-gray-600 mb-1">{step.action}</div>
                            <div className="text-sm text-gray-700">{step.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`p-6 rounded-2xl border ${
                  result.testMode || result.demoMode
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-light'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg ${
                        result.testMode || result.demoMode
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          : currentSystem.color
                      } flex items-center justify-center text-white`}>
                        <FontAwesomeIcon icon={
                          result.testMode || result.demoMode ? faToggleOn : currentSystem.icon
                        } />
                      </div>
                      <div>
                        <div className="font-semibold">{response.provider}</div>
                        <div className="text-xs text-gray-dark">{response.model}</div>
                      </div>
                    </div>
                    
                    {!response.error && (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-dark">Quality</div>
                          <div className={`text-lg font-bold ${
                            result.testMode || result.demoMode ? 'text-amber-600' : 'text-ai-pink'
                          }`}>
                            {response.confidence}%
                          </div>
                        </div>
                        {response.tokens && (
                          <div className="text-right">
                            <div className="text-sm text-gray-dark">Tokens</div>
                            <div className="text-lg font-bold text-dna-purple">{response.tokens}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {response.error ? (
                      <div className="text-red-600 p-3 bg-red-50 rounded-lg">
                        {response.response}
                      </div>
                    ) : (
                      <>
                        {result.testMode && (
                          <div className="mb-4 p-3 bg-amber-100/50 border border-amber-200 rounded-lg">
                            <div className="flex items-center gap-2 text-amber-800 text-sm">
                              <FontAwesomeIcon icon={faExclamationTriangle} />
                              <span>Demo response. LLMs are not available.</span>
                            </div>
                          </div>
                        )}
                        <SimpleMarkdownRenderer text={response.response} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Analysis statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-200">
                <div className="text-2xl font-bold text-dna-purple">
                  {currentSystem.agents.length}
                </div>
                <div className="text-sm text-gray-dark">AI agents</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-200">
                <div className="text-2xl font-bold text-ai-pink">
                  {result.responses.filter(r => !r.error).length}
                </div>
                <div className="text-sm text-gray-dark">Successful stages</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-200">
                <div className="text-2xl font-bold text-lab-green">
                  {Math.max(...result.responses.map(r => r.confidence))}%
                </div>
                <div className="text-sm text-gray-dark">Analysis quality</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-200">
                <div className="text-2xl font-bold text-med-blue">
                  {currentSystem.name}
                </div>
                <div className="text-sm text-gray-dark">System</div>
              </div>
            </div>

            {/* API setup instructions */}
            {(result.testMode || result.demoMode) && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">How to connect real LLMs:</h5>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Get API keys from Groq or Google Gemini</li>
                  <li>Add them to <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
                  <li>Restart server for activation</li>
                </ol>
                <div className="mt-2 text-xs text-blue-600">
                  Example: <code>GROQ_API_KEY=your_key_here</code>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}