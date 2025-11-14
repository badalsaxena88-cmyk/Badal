import React from 'react';
import { ChartType } from '../types';
import { PlusIcon, MinusIcon, HomeIcon, FullscreenIcon, ExitFullscreenIcon } from './icons';

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
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  homeRef: React.Ref<HTMLButtonElement>;
  snellenRef: React.Ref<HTMLButtonElement>;
  hindiRef: React.Ref<HTMLButtonElement>;
  eChartRef: React.Ref<HTMLButtonElement>;
  letterMinusRef: React.Ref<HTMLButtonElement>;
  letterPlusRef: React.Ref<HTMLButtonElement>;
  sizeMinusRef: React.Ref<HTMLButtonElement>;
  sizePlusRef: React.Ref<HTMLButtonElement>;
  fullscreenRef: React.Ref<HTMLButtonElement>;
}

interface ChartButtonProps {
  label: string;
  type: ChartType;
  current: ChartType;
  onClick: (type: ChartType) => void;
}

const ChartButton = React.forwardRef<HTMLButtonElement, ChartButtonProps>(
  ({ label, type, current, onClick }, ref) => (
    <button
      ref={ref}
      onClick={() => onClick(type)}
      className={`px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 ${
        current === type
          ? 'bg-blue-600 text-white'
          : 'text-black hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  )
);

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, disabled = false, ariaLabel, children }, ref) => (
      <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className="p-3 md:p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-300"
          aria-label={ariaLabel}
      >
          {children}
      </button>
  )
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
  onGoHome,
  isFullscreen,
  onToggleFullscreen,
  homeRef,
  snellenRef,
  hindiRef,
  eChartRef,
  letterMinusRef,
  letterPlusRef,
  sizeMinusRef,
  sizePlusRef,
  fullscreenRef
}) => {
  return (
    <div className="controls-container w-full bg-gray-100/80 backdrop-blur-sm p-4 sticky bottom-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            ref={homeRef}
            onClick={onGoHome}
            aria-label="Go to chart selection"
            className="p-3 md:p-4 bg-gray-200 rounded-lg text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          >
            <HomeIcon />
          </button>
          {/* Chart Type Selector */}
          <div className="flex items-center gap-2 md:gap-4 p-1 bg-gray-200 rounded-xl">
            <ChartButton ref={snellenRef} label="English" type={ChartType.Snellen} current={currentChart} onClick={onChartChange} />
            <ChartButton ref={hindiRef} label="Hindi" type={ChartType.Hindi} current={currentChart} onClick={onChartChange} />
            <ChartButton ref={eChartRef} label="E Chart" type={ChartType.EChart} current={currentChart} onClick={onChartChange} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4">
                {/* Letter Controls (only in single letter mode) */}
                {isSingleLetterMode && (
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-lg md:text-xl font-semibold text-gray-700">Letter</span>
                        <IconButton ref={letterMinusRef} onClick={() => onLetterIndexChange('decrease')} disabled={isMinLetter} ariaLabel="Previous letter">
                            <MinusIcon />
                        </IconButton>
                        <IconButton ref={letterPlusRef} onClick={() => onLetterIndexChange('increase')} disabled={isMaxLetter} ariaLabel="Next letter">
                            <PlusIcon />
                        </IconButton>
                    </div>
                )}
                
                {/* Size Controls */}
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-lg md:text-xl font-semibold text-gray-700">Size</span>
                    <IconButton ref={sizeMinusRef} onClick={() => onLineChange('decrease')} disabled={isMinLine} ariaLabel="Decrease size">
                        <MinusIcon />
                    </IconButton>
                    <IconButton ref={sizePlusRef} onClick={() => onLineChange('increase')} disabled={isMaxLine} ariaLabel="Increase size">
                        <PlusIcon />
                    </IconButton>
                </div>
                <IconButton ref={fullscreenRef} onClick={onToggleFullscreen} ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                    {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </IconButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
