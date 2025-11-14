import React, { useState, useRef, useEffect } from 'react';
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

const chartOptions = [
  { type: ChartType.Snellen, title: 'English', character: 'A', fontClass: 'font-serif' },
  { type: ChartType.Hindi, title: 'Hindi', character: 'र', fontClass: '' },
  { type: ChartType.EChart, title: 'E Chart', character: 'E', fontClass: 'font-serif' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onSelectChart }) => {
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Set focus when index changes
  useEffect(() => {
    cardRefs.current[focusedCardIndex]?.focus();
  }, [focusedCardIndex]);
  
  // Set initial focus on the first language option
  useEffect(() => {
    cardRefs.current[0]?.focus();
  }, []);

  // Handle remote control navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          setFocusedCardIndex(prev => (prev + 1) % chartOptions.length);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedCardIndex(prev => (prev - 1 + chartOptions.length) % chartOptions.length);
          break;
        case 'Enter':
        case ' ': // Handle space key as select
          event.preventDefault();
          const focusedButton = cardRefs.current[focusedCardIndex];
          if (focusedButton) {
            focusedButton.click();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedCardIndex]);


  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden p-8">
      <h1 className="text-5xl md:text-7xl mb-16 font-bold text-center">Bharat Optical Works</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {chartOptions.map((chart, index) => (
          <ChartCard
            key={chart.type}
            ref={el => cardRefs.current[index] = el}
            title={chart.title}
            character={chart.character}
            fontClass={chart.fontClass}
            onClick={() => onSelectChart(chart.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;