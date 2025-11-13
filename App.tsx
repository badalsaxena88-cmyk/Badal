import React, { useState, useCallback, useEffect } from 'react';
import { ChartType } from './types';
import EyeChart from './components/EyeChart';
import Controls from './components/Controls';
import LandingPage from './components/LandingPage';
import { SNELLEN_CHART, HINDI_CHART, E_CHART } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'chart'>('landing');
  const [chartType, setChartType] = useState<ChartType>(ChartType.Snellen);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isSingleLetterMode, setIsSingleLetterMode] = useState(false);
  const [singleLetterIndex, setSingleLetterIndex] = useState(0);

  const handleSelectChart = (type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0);
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
    setView('chart');
  };
  
  const handleGoHome = () => {
    setView('landing');
  };

  const getChartData = () => {
    switch (chartType) {
      case ChartType.Snellen:
        return SNELLEN_CHART;
      case ChartType.Hindi:
        return HINDI_CHART;
      case ChartType.EChart:
        return E_CHART;
      default:
        return SNELLEN_CHART;
    }
  };
  
  const chartData = getChartData();
  const currentLine = chartData[currentLineIndex];

  const handleLineChange = useCallback((direction: 'increase' | 'decrease') => {
    setCurrentLineIndex(prevIndex => {
      if (direction === 'increase') {
        return Math.min(prevIndex + 1, chartData.length - 1);
      } else {
        return Math.max(prevIndex - 1, 0);
      }
    });
    setSingleLetterIndex(0); // Reset letter index when line changes
    setIsSingleLetterMode(false); // Always show full line when size changes
  }, [chartData.length]);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0); // Reset to the first line when chart changes
    setSingleLetterIndex(0); // Reset letter index when chart changes
    setIsSingleLetterMode(false); // Also reset single letter mode
  }, []);

  const handleToggleSingleLetterMode = useCallback(() => {
    setIsSingleLetterMode(prev => !prev);
    setSingleLetterIndex(0); // Reset letter index when toggling mode
  }, []);

  const handleLetterIndexChange = useCallback((direction: 'increase' | 'decrease') => {
    setSingleLetterIndex(prevIndex => {
      if (direction === 'increase') {
        return Math.min(prevIndex + 1, currentLine.letters.length - 1);
      } else {
        return Math.max(prevIndex - 1, 0);
      }
    });
  }, [currentLine.letters.length]);

  useEffect(() => {
    if (view !== 'chart') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          handleLineChange('decrease'); // Decrease index = larger font size
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleLineChange('increase'); // Increase index = smaller font size
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (isSingleLetterMode) {
            handleLetterIndexChange('decrease');
          } else {
            setIsSingleLetterMode(true);
            setSingleLetterIndex(currentLine.letters.length > 0 ? currentLine.letters.length - 1 : 0);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (isSingleLetterMode) {
            handleLetterIndexChange('increase');
          } else {
            handleToggleSingleLetterMode(); // Activates mode and sets index to 0
          }
          break;
        case 'Enter':
          event.preventDefault();
          handleToggleSingleLetterMode();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, isSingleLetterMode, handleLineChange, handleLetterIndexChange, handleToggleSingleLetterMode, currentLine.letters.length]);

  if (view === 'landing') {
    return <LandingPage onSelectChart={handleSelectChart} />;
  }

  return (
    <main className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="flex-grow flex items-center justify-center w-full">
        <EyeChart 
          chartType={chartType}
          line={currentLine}
          isSingleLetterMode={isSingleLetterMode}
          singleLetterIndex={singleLetterIndex}
        />
      </div>
      <Controls
        currentChart={chartType}
        onChartChange={handleChartTypeChange}
        onLineChange={handleLineChange}
        isMinLine={currentLineIndex === 0}
        isMaxLine={currentLineIndex === chartData.length - 1}
        isSingleLetterMode={isSingleLetterMode}
        onToggleSingleLetterMode={handleToggleSingleLetterMode}
        onLetterIndexChange={handleLetterIndexChange}
        isMinLetter={singleLetterIndex === 0}
        isMaxLetter={currentLine.letters.length === 0 || singleLetterIndex === currentLine.letters.length - 1}
        onGoHome={handleGoHome}
      />
    </main>
  );
};

export default App;
