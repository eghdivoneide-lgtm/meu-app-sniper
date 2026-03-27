import { useState } from 'react';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function CompareSlider({ beforeImage, afterImage }: CompareSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div 
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden group cursor-ew-resize shadow-lg border border-slate-200"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setPosition((x / rect.width) * 100);
      }}
      onTouchMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        setPosition((x / rect.width) * 100);
      }}
    >
      {/* Imagem Base (Antes) */}
      <img 
        src={beforeImage} 
        alt="Antes" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
      />
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md z-0 font-medium tracking-wide">
        Foto Original
      </div>

      {/* Imagem Modificada pela IA (Depois) - Usando view de clip para manter tamanho igual */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <img 
          src={afterImage} 
          alt="Depois" 
          className="absolute inset-0 w-full h-full object-cover max-w-none" 
        />
        <div className="absolute top-4 left-4 bg-blue-600 border border-blue-400/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md z-10 font-bold tracking-wide shadow-lg shadow-blue-500/20">
          Design por IA
        </div>
      </div>

      {/* Linha do Slider */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none flex items-center justify-center transition-all duration-75"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-xl flex items-center justify-center -ml-0.5 border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 scale-75 md:scale-100">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 scale-75 md:scale-100 transform rotate-180">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}
