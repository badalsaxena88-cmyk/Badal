import React from 'react';
import { ChartType } from '../types';
import { PlusIcon, MinusIcon, HomeIcon } from './icons';

interface ControlsProps {
  currentChart: ChartType;
  onChartChange: (type: ChartType) => void;
  onLineChange: (direction: 'increase' | 'decrease') => void;
  isMinLine: boolean;
  isMaxLine: boolean;
  isSingleLetterMode: boolean;
  onToggleSingleLetterMode: () => void;
  onLetterIndexChange: (direction: 'increase' | 'decrease') => void;
  isMinLetter: boolean;
  isMaxLetter: boolean;
  onGoHome: () => void;
}

const ChartButton: React.FC<{
  label: string;
  type: ChartType;
  current: ChartType;
  onClick: (type: ChartType) => void;
}> = ({ label, type, current, onClick }) => (
  <button
    onClick={() => onClick(type)}
    className={`px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 ${
      current === type
        ? 'bg-blue-600 text-white'
        : 'text-black hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

const ControlButton: React.FC<{
    direction: 'increase' | 'decrease';
    onClick: (direction: 'increase' | 'decrease') => void;
    disabled: boolean;
    ariaLabel: string;
}> = ({ direction, onClick, disabled, ariaLabel }) => (
    <button
        onClick={() => onClick(direction)}
        disabled={disabled}
        className="p-3 md:p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-300"
        aria-label={ariaLabel}
    >
        {direction === 'increase' ? <PlusIcon /> : <MinusIcon />}
    </button>
);


const Controls: React.FC<ControlsProps> = ({
  currentChart,
  onChartChange,
  onLineChange,
  isMinLine,
  isMaxLine,
  isSingleLetterMode,
  onToggleSingleLetterMode,
  onLetterIndexChange,
  isMinLetter,
  isMaxLetter,
  onGoHome
}) => {
  return (
    <div className="w-full bg-gray-100/80 backdrop-blur-sm p-4 sticky bottom-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            aria-label="Go to chart selection"
            className="p-3 md:p-4 bg-gray-200 rounded-lg text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          >
            <HomeIcon />
          </button>
          {/* Chart Type Selector */}
          <div className="flex items-center gap-2 md:gap-4 p-1 bg-gray-200 rounded-xl">
            <ChartButton label="English" type={ChartType.Snellen} current={currentChart} onClick={onChartChange} />
            <ChartButton label="Hindi" type={ChartType.Hindi} current={currentChart} onClick={onChartChange} />
            <ChartButton label="E Chart" type={ChartType.EChart} current={currentChart} onClick={onChartChange} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4">
                {/* Letter Controls (only in single letter mode) */}
                {isSingleLetterMode && (
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-lg md:text-xl font-semibold text-gray-700">Letter</span>
                        <ControlButton direction="decrease" onClick={onLetterIndexChange} disabled={isMinLetter} ariaLabel="Previous letter" />
                        <ControlButton direction="increase" onClick={onLetterIndexChange} disabled={isMaxLetter} ariaLabel="Next letter" />
                    </div>
                )}
                
                {/* Size Controls */}
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-lg md:text-xl font-semibold text-gray-700">Size</span>
                    <ControlButton direction="decrease" onClick={onLineChange} disabled={isMinLine} ariaLabel="Decrease size" />
                    <ControlButton direction="increase" onClick={onLineChange} disabled={isMaxLine} ariaLabel="Increase size" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
