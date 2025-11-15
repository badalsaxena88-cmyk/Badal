import React, { useState, useRef, useEffect } from 'react';
import { ChartType } from '../types';

interface LandingPageProps {
  onSelectChart: (type: ChartType) => void;
  onCalibrate: () => void;
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
  { type: ChartType.CChart, title: 'C Chart', character: 'C', fontClass: 'font-serif' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onSelectChart, onCalibrate }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const focusableItems = [...chartOptions, { type: 'calibrate', title: 'Calibrate' }];

  // Set focus when index changes
  useEffect(() => {
    itemRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);
  
  // Set initial focus
  useEffect(() => {
    itemRefs.current[0]?.focus();
  }, []);

  // Handle remote control navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          setFocusedIndex(prev => (prev + 1) % focusableItems.length);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedIndex(prev => (prev - 1 + focusableItems.length) % focusableItems.length);
          break;
        case 'Enter':
        case ' ': // Handle space key as select
          event.preventDefault();
          itemRefs.current[focusedIndex]?.click();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex, focusableItems.length]);


  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden p-8">
      <h1 className="text-5xl md:text-7xl mb-16 font-bold text-center">Bharat Optical Works</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {chartOptions.map((chart, index) => (
          <ChartCard
            key={chart.type}
            ref={el => itemRefs.current[index] = el}
            title={chart.title}
            character={chart.character}
            fontClass={chart.fontClass}
            onClick={() => onSelectChart(chart.type)}
          />
        ))}
      </div>
      <div className="mt-16">
        <button
          ref={el => itemRefs.current[chartOptions.length] = el}
          onClick={onCalibrate}
          className="px-8 py-4 bg-gray-200 text-xl font-semibold text-black rounded-lg transition-colors duration-200 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          Calibrate Display
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
