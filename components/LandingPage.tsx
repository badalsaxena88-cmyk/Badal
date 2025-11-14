import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChartType } from '../types';

interface LandingPageProps {
  onSelectChart: (type: ChartType) => void;
}

interface ChartCardProps {
  title: string;
  character: string;
  fontClass?: string;
  onClick: () => void;
}

const ChartCard = React.forwardRef<HTMLButtonElement, ChartCardProps>(
  ({ title, character, fontClass = '', onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="bg-gray-100 rounded-2xl w-64 h-64 flex flex-col items-center justify-center text-black transition-all duration-300 ease-in-out transform hover:bg-blue-600 hover:text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75"
    >
      <span className={`text-9xl ${fontClass}`}>{character}</span>
      <span className="text-3xl mt-4 font-semibold">{title}</span>
    </button>
  )
);

const LandingPage: React.FC<LandingPageProps> = ({ onSelectChart }) => {
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current[focusedCardIndex]?.focus();
  }, [focusedCardIndex]);
  
  useEffect(() => {
    // Focus the first card on mount
    cardRefs.current[0]?.focus();
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      setFocusedCardIndex(prev => Math.min(prev + 1, 2));
    } else if (event.key === 'ArrowLeft') {
      setFocusedCardIndex(prev => Math.max(prev - 1, 0));
    }
  }, []);


  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden p-8" onKeyDown={handleKeyDown}>
      <h1 className="text-5xl md:text-7xl mb-16 font-bold text-center">Select Eye Chart</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <ChartCard
          ref={el => cardRefs.current[0] = el}
          title="English"
          character="A"
          fontClass="font-serif"
          onClick={() => onSelectChart(ChartType.Snellen)}
        />
        <ChartCard
          ref={el => cardRefs.current[1] = el}
          title="Hindi"
          character="र"
          onClick={() => onSelectChart(ChartType.Hindi)}
        />
        <ChartCard
          ref={el => cardRefs.current[2] = el}
          title="E Chart"
          character="E"
          fontClass="font-serif"
          onClick={() => onSelectChart(ChartType.EChart)}
        />
      </div>
    </div>
  );
};

export default LandingPage;
