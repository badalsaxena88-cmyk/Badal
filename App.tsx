import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartMode, setChartMode] = useState<'display' | 'controls'>('display');
  const [focusedControlIndex, setFocusedControlIndex] = useState(0);

  // Refs for all focusable controls
  const homeRef = useRef<HTMLButtonElement>(null);
  const snellenRef = useRef<HTMLButtonElement>(null);
  const hindiRef = useRef<HTMLButtonElement>(null);
  const eChartRef = useRef<HTMLButtonElement>(null);
  const letterMinusRef = useRef<HTMLButtonElement>(null);
  const letterPlusRef = useRef<HTMLButtonElement>(null);
  const sizeMinusRef = useRef<HTMLButtonElement>(null);
  const sizePlusRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);

  const getControlRefs = useCallback(() => {
    const refs = [homeRef, snellenRef, hindiRef, eChartRef];
    if (isSingleLetterMode) {
      refs.push(letterMinusRef, letterPlusRef);
    }
    refs.push(sizeMinusRef, sizePlusRef, fullscreenRef);
    return refs.map(ref => ref.current ? ref : null).filter(Boolean);
  }, [isSingleLetterMode]);


  const handleSelectChart = (type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0);
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
    setView('chart');
    setChartMode('display');
  };
  
  const handleGoHome = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setView('landing');
    setChartMode('display');
  };

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (isFs) {
        setChartMode('display'); // Force display mode in fullscreen
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

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
    setSingleLetterIndex(0);
    setIsSingleLetterMode(false);
  }, [chartData.length]);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0);
    setSingleLetterIndex(0);
    setIsSingleLetterMode(false);
  }, []);

  const handleToggleSingleLetterMode = useCallback(() => {
    setIsSingleLetterMode(prev => !prev);
    setSingleLetterIndex(0);
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
  
  // When single letter mode changes, reset focus in controls mode to avoid focus errors
  useEffect(() => {
    if (chartMode === 'controls') {
      setFocusedControlIndex(0);
    }
  }, [isSingleLetterMode, chartMode]);


  useEffect(() => {
    if (view !== 'chart') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (chartMode === 'display') {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            handleLineChange('decrease');
            break;
          case 'ArrowDown':
            event.preventDefault();
            handleLineChange('increase');
            break;
          case 'ArrowLeft':
            if (isSingleLetterMode) {
              event.preventDefault();
              handleLetterIndexChange('decrease');
            }
            break;
          case 'ArrowRight':
            if (isSingleLetterMode) {
              event.preventDefault();
              handleLetterIndexChange('increase');
            }
            break;
          case 'Enter':
            event.preventDefault();
            handleToggleSingleLetterMode();
            break;
          case 'f':
          case 'F':
            event.preventDefault();
            handleToggleFullscreen();
            break;
          case 'Escape':
            event.preventDefault();
            if (!isFullscreen) {
              setChartMode('controls');
              setFocusedControlIndex(0);
            }
            break;
          default:
            break;
        }
      } else { // chartMode === 'controls'
        const controlRefs = getControlRefs();
        if (controlRefs.length === 0) return;

        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            setChartMode('display');
            break;
          case 'ArrowRight':
            event.preventDefault();
            setFocusedControlIndex(prev => (prev + 1) % controlRefs.length);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            setFocusedControlIndex(prev => (prev - 1 + controlRefs.length) % controlRefs.length);
            break;
          case 'Enter':
            event.preventDefault();
            const targetRef = controlRefs[focusedControlIndex];
            targetRef?.current?.click();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, chartMode, isSingleLetterMode, handleLineChange, handleLetterIndexChange, handleToggleSingleLetterMode, isFullscreen, handleToggleFullscreen, getControlRefs, focusedControlIndex]);

  // Effect to manage focus on controls
  useEffect(() => {
    if (view === 'chart' && chartMode === 'controls') {
      const controlRefs = getControlRefs();
      const targetRef = controlRefs[focusedControlIndex];
      targetRef?.current?.focus();
    } else if (view === 'chart' && chartMode === 'display') {
       const activeElement = document.activeElement as HTMLElement;
       const controlsContainer = document.querySelector('.controls-container');
       if (activeElement && controlsContainer?.contains(activeElement)) {
          activeElement.blur();
       }
    }
  }, [view, chartMode, focusedControlIndex, getControlRefs]);


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
          isFullscreen={isFullscreen}
        />
      </div>
      {!isFullscreen && (
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
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          homeRef={homeRef}
          snellenRef={snellenRef}
          hindiRef={hindiRef}
          eChartRef={eChartRef}
          letterMinusRef={letterMinusRef}
          letterPlusRef={letterPlusRef}
          sizeMinusRef={sizeMinusRef}
          sizePlusRef={sizePlusRef}
          fullscreenRef={fullscreenRef}
        />
      )}
    </main>
  );
};

export default App;