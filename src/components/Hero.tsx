import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default function Hero() {
  return (
    <section className="pt-24 pb-12 px-8 text-center max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-6 flex flex-col items-center">
          <span className="gradient-text">Advancing Generative AI</span>
          <span className="text-gray-dark text-4xl md:text-5xl font-normal my-2">for</span>
          <span className="gradient-text">Research & Development</span>
        </h1>
        
        <p className="text-xl text-gray-dark max-w-3xl mx-auto leading-relaxed mb-10">
          A collaborative research community pioneering AI applications across diverse domains of knowledge. 
          Recent advancements in generative AI research facilitate breakthroughs in various scientific fields, 
          including fundamental research and life sciences, accelerating discovery and innovation.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="bg-gradient-to-r from-lab-green to-research-teal text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} />
            Join Community
          </button>
        </div>
      </div>
    </section>
  );
}