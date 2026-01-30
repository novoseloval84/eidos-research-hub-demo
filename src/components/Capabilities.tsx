import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faRobot, 
  faUsers, 
  faChartLine,
  faProjectDiagram,
  faDna,
  faHeartbeat,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

export default function Capabilities() {
  const capabilities = [
    {
      icon: faRocket,
      title: 'Predict Breakthrough Research',
      description: 'AI-powered analysis to identify emerging trends, forecast potential critical discoveries, and accelerate Nobel Prize-worthy research through pattern recognition and predictive modeling.',
      color: 'purple',
      subsections: [
        { icon: faRobot, label: 'Generative AI', color: 'pink' },
        { icon: faChartLine, label: 'Benchmark Analysis', color: 'blue' }
      ],
      stats: '312 breakthrough predictions',
      progress: 75
    },
    {
      icon: faRobot,
      title: 'AI Research Assistant',
      description: 'Advanced multi-LLM system providing expert insights, literature synthesis, and collaborative analysis across scientific domains.',
      color: 'pink',
      subsections: [
        { icon: faProjectDiagram, label: 'Knowledge Graph', color: 'purple' },
        { icon: faRobot, label: 'AI Integration', color: 'pink' },
        { icon: faDna, label: 'Life Sciences', color: 'green' },
        { icon: faHeartbeat, label: 'MedTech', color: 'blue' }
      ]
    },
    {
      icon: faUsers,
      title: 'Global Collaboration',
      description: 'Connect with researchers, clinicians, and innovators worldwide to accelerate discovery through shared knowledge and interdisciplinary cooperation.',
      color: 'green',
      stats: '2,148 researchers online from 89 countries'
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' = 'bg') => {
    const colors: Record<string, string> = {
      purple: type === 'bg' ? 'bg-dna-purple/10' : type === 'text' ? 'text-dna-purple' : 'border-dna-purple',
      pink: type === 'bg' ? 'bg-ai-pink/10' : type === 'text' ? 'text-ai-pink' : 'border-ai-pink',
      blue: type === 'bg' ? 'bg-med-blue/10' : type === 'text' ? 'text-med-blue' : 'border-med-blue',
      green: type === 'bg' ? 'bg-lab-green/10' : type === 'text' ? 'text-lab-green' : 'border-lab-green'
    };
    return colors[color] || '';
  };

  return (
    <section className="py-12 px-8 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Research Capabilities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {capabilities.map((cap, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-custom hover:shadow-custom-lg hover:-translate-y-2 transition-all duration-300 border border-gray-light"
          >
            <div className={`w-16 h-16 rounded-xl ${getColorClasses(cap.color, 'bg')} flex items-center justify-center mb-4`}>
              <FontAwesomeIcon 
                icon={cap.icon} 
                className={`text-2xl ${getColorClasses(cap.color, 'text')}`} 
              />
            </div>
            
            <h3 className="text-xl font-bold mb-3">{cap.title}</h3>
            <p className="text-gray-dark mb-4">{cap.description}</p>
            
            {cap.subsections && (
              <div className="flex flex-wrap gap-2 mb-4">
                {cap.subsections.map((sub, subIndex) => (
                  <div 
                    key={subIndex}
                    className={`px-3 py-1.5 rounded-lg text-sm ${getColorClasses(sub.color, 'bg')} ${getColorClasses(sub.color, 'border')} border`}
                  >
                    <FontAwesomeIcon icon={sub.icon} className="mr-1" />
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
            
            {cap.progress && (
              <div className="mt-4">
                <div className="h-1.5 bg-gray-light rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-dna-purple to-ai-pink rounded-full"
                    style={{ width: `${cap.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center text-sm text-gray-dark">
                  <div className="w-2 h-2 rounded-full bg-lab-green mr-2"></div>
                  {cap.stats}
                </div>
              </div>
            )}
            
            {cap.stats && !cap.progress && (
              <div className="flex items-center text-sm text-gray-dark mt-4">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                {cap.stats}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}