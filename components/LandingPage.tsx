import React from 'react';
import { ChartType } from '../types';

interface LandingPageProps {
  onSelectChart: (type: ChartType) => void;
}

const ChartCard: React.FC<{
  title: string;
  character: string;
  fontClass?: string;
  onClick: () => void;
}> = ({ title, character, fontClass = '', onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-100 rounded-2xl w-64 h-64 flex flex-col items-center justify-center text-black transition-all duration-300 ease-in-out transform hover:bg-blue-600 hover:text-white hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75"
  >
    <span className={`text-9xl ${fontClass}`}>{character}</span>
    <span className="text-3xl mt-4 font-semibold">{title}</span>
  </button>
);

const LandingPage: React.FC<LandingPageProps> = ({ onSelectChart }) => {
  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden p-8">
      <h1 className="text-5xl md:text-7xl mb-16 font-bold text-center">Select Eye Chart</h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <ChartCard
          title="English"
          character="A"
          fontClass="font-serif"
          onClick={() => onSelectChart(ChartType.Snellen)}
        />
        <ChartCard
          title="Hindi"
          character="र"
          onClick={() => onSelectChart(ChartType.Hindi)}
        />
        <ChartCard
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
