"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-light fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        {/* Иконка мозга с градиентом */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-dna-purple to-ai-pink rounded-full blur-sm opacity-70"></div>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-dna-purple to-ai-pink flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faBrain} 
              className="text-white text-xl"
            />
          </div>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-dna-purple to-ai-pink bg-clip-text text-transparent">
          Eidos
        </span>
      </div>
      
      <div className="flex items-center gap-8">
        <a href="#research" className="text-gray-dark font-medium hover:text-dna-purple transition-colors relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-dna-purple after:transition-all hover:after:w-full">
          Research
        </a>
        <a href="#community" className="text-gray-dark font-medium hover:text-dna-purple transition-colors relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-dna-purple after:transition-all hover:after:w-full">
          Community
        </a>
        <a href="#tools" className="text-gray-dark font-medium hover:text-dna-purple transition-colors relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-dna-purple after:transition-all hover:after:w-full">
          Tools
        </a>
        <a href="#publications" className="text-gray-dark font-medium hover:text-dna-purple transition-colors relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-dna-purple after:transition-all hover:after:w-full">
          Publications
        </a>
        <a href="#about" className="text-gray-dark font-medium hover:text-dna-purple transition-colors relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-dna-purple after:transition-all hover:after:w-full">
          About
        </a>
        <button className="bg-gradient-to-r from-dna-purple to-ai-pink text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
          Join Research
        </button>
      </div>
    </nav>
  );
}