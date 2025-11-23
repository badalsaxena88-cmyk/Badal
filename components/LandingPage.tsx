import React from 'react';
import { ChartType } from '../types';
import { EyeIcon } from './icons';

interface LandingPageProps {
  onSelectChart: (type: ChartType) => void;
  onCalibrate: () => void;
  snellenCardRef: React.Ref<HTMLButtonElement>;
  hindiCardRef: React.Ref<HTMLButtonElement>;
  numericCardRef: React.Ref<HTMLButtonElement>;
  cChartCardRef: React.Ref<HTMLButtonElement>;
  calibrateButtonRef: React.Ref<HTMLButtonElement>;
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
  { type: ChartType.Numeric, title: 'Numeric', character: '8', fontClass: 'font-mono' },
  { type: ChartType.CChart, title: 'C Chart', character: 'C', fontClass: 'font-serif' },
];

const LandingPage: React.FC<LandingPageProps> = ({ 
  onSelectChart, 
  onCalibrate,
  snellenCardRef,
  hindiCardRef,
  numericCardRef,
  cChartCardRef,
  calibrateButtonRef
}) => {
  const chartRefs = [snellenCardRef, hindiCardRef, numericCardRef, cChartCardRef];

  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden p-8">
      <div className="flex items-center justify-center gap-4 md:gap-6 mb-16">
        <EyeIcon />
        <h1 className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent select-none">
          Bharat Optical Works
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {chartOptions.map((chart, index) => (
          <ChartCard
            key={chart.type}
            ref={chartRefs[index]}
            title={chart.title}
            character={chart.character}
            fontClass={chart.fontClass}
            onClick={() => onSelectChart(chart.type)}
          />
        ))}
      </div>
      <div className="mt-16">
        <button
          ref={calibrateButtonRef}
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