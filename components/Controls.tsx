import React from 'react';
import { ChartType } from '../types';
import { PlusIcon, MinusIcon, HomeIcon, FullscreenIcon, ExitFullscreenIcon, ResetIcon } from './icons';

interface ControlsProps {
  currentChart: ChartType;
  onChartChange: (type: ChartType) => void;
  onLineChange: (direction: 'increase' | 'decrease') => void;
  isMinLine: boolean;
  isMaxLine: boolean;
  isSingleLetterMode: boolean;
  onSetLetterView: () => void;
  onPreviousLetter: () => void;
  onNextLetter: () => void;
  isAtFirstLetter: boolean;
  isAtLastLetter: boolean;
  onGoHome: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
  homeRef: React.Ref<HTMLButtonElement>;
  snellenRef: React.Ref<HTMLButtonElement>;
  hindiRef: React.Ref<HTMLButtonElement>;
  cChartRef: React.Ref<HTMLButtonElement>;
  sizeMinusRef: React.Ref<HTMLButtonElement>;
  sizePlusRef: React.Ref<HTMLButtonElement>;
  letterPrevRef: React.Ref<HTMLButtonElement>;
  letterNextRef: React.Ref<HTMLButtonElement>;
  fullscreenRef: React.Ref<HTMLButtonElement>;
  resetViewRef: React.Ref<HTMLButtonElement>;
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
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, disabled = false, ariaLabel, children, className = '' }, ref) => (
      <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={`p-3 md:p-4 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-300 ${className}`}
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
  onSetLetterView,
  onPreviousLetter,
  onNextLetter,
  isAtFirstLetter,
  isAtLastLetter,
  onGoHome,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
  homeRef,
  snellenRef,
  hindiRef,
  cChartRef,
  sizeMinusRef,
  sizePlusRef,
  letterPrevRef,
  letterNextRef,
  fullscreenRef,
  resetViewRef
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
            <ChartButton ref={cChartRef} label="C Chart" type={ChartType.CChart} current={currentChart} onClick={onChartChange} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
            {/* Line Controls */}
            <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-xl">
                <IconButton
                    ref={sizePlusRef}
                    onClick={() => onLineChange('decrease')}
                    disabled={isMinLine}
                    ariaLabel={'Larger letters (previous line)'}
                >
                    <PlusIcon />
                </IconButton>
                <IconButton
                    ref={sizeMinusRef}
                    onClick={() => onLineChange('increase')}
                    disabled={isMaxLine}
                    ariaLabel={'Smaller letters (next line)'}
                >
                    <MinusIcon />
                </IconButton>
            </div>
            
            {/* Letter Controls */}
            <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-xl">
                <IconButton
                    ref={letterPrevRef}
                    onClick={onPreviousLetter}
                    disabled={!isSingleLetterMode || isAtFirstLetter}
                    ariaLabel={'Previous letter'}
                >
                    <MinusIcon />
                </IconButton>
                <IconButton
                    ref={letterNextRef}
                    onClick={isSingleLetterMode ? onNextLetter : onSetLetterView}
                    disabled={isSingleLetterMode && isAtLastLetter}
                    ariaLabel={isSingleLetterMode ? 'Next letter' : 'Switch to single letter view'}
                >
                    <PlusIcon />
                </IconButton>
            </div>

            <IconButton
              ref={resetViewRef}
              onClick={onResetView}
              ariaLabel={'Reset view to default'}
              className="bg-gray-200"
            >
                <ResetIcon />
            </IconButton>

            <IconButton
              ref={fullscreenRef}
              onClick={onToggleFullscreen}
              ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="bg-gray-200"
            >
                {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Controls;
