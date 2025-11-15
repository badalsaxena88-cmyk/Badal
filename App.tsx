import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChartType } from './types';
import EyeChart from './components/EyeChart';
import Controls from './components/Controls';
import LandingPage from './components/LandingPage';
import CalibrationPage from './components/CalibrationPage';
import { SNELLEN_CHART, HINDI_CHART, C_CHART } from './constants';
import VirtualCursor from './components/VirtualCursor';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'chart' | 'calibration'>('landing');
  const [chartType, setChartType] = useState<ChartType>(ChartType.Snellen);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isSingleLetterMode, setIsSingleLetterMode] = useState(false);
  const [singleLetterIndex, setSingleLetterIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartMode, setChartMode] = useState<'display' | 'controls'>('display');
  const [focusedControlIndex, setFocusedControlIndex] = useState(0);
  const [pixelsPerMm, setPixelsPerMm] = useState<number>(2.7); // Default for ~70 PPI TV
  const [isMouseMode, setIsMouseMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const storedPpmm = localStorage.getItem('pixelsPerMm');
    if (storedPpmm) {
      setPixelsPerMm(parseFloat(storedPpmm));
    }
  }, []);

  // Refs for all focusable controls
  const homeRef = useRef<HTMLButtonElement>(null);
  const snellenRef = useRef<HTMLButtonElement>(null);
  const hindiRef = useRef<HTMLButtonElement>(null);
  const cChartRef = useRef<HTMLButtonElement>(null);
  const sizeMinusRef = useRef<HTMLButtonElement>(null);
  const sizePlusRef = useRef<HTMLButtonElement>(null);
  const resetViewRef = useRef<HTMLButtonElement>(null);
  const letterPrevRef = useRef<HTMLButtonElement>(null);
  const letterNextRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);

  const getControlRefs = useCallback(() => {
    const refs = [
      homeRef, 
      snellenRef, 
      hindiRef, 
      cChartRef, 
      sizePlusRef, 
      sizeMinusRef, 
      letterPrevRef, 
      letterNextRef, 
      resetViewRef,
      fullscreenRef
    ];
    return refs.map(ref => ref.current ? ref : null).filter(Boolean);
  }, []);


  const handleSelectChart = (type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0);
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
    setView('chart');
    setChartMode('display');
  };
  
  const handleStartCalibration = () => {
    setView('calibration');
  };

  const handleCalibrationComplete = (ppmm: number) => {
    setPixelsPerMm(ppmm);
    localStorage.setItem('pixelsPerMm', ppmm.toString());
    setView('landing');
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
      case ChartType.CChart:
        return C_CHART;
      default:
        return SNELLEN_CHART;
    }
  };
  
  const chartData = getChartData();
  const currentLine = chartData[currentLineIndex];

  const handleLineChange = useCallback((direction: 'increase' | 'decrease') => {
    setIsSingleLetterMode(false); // Always show full line when changing lines
    setCurrentLineIndex(prevIndex => {
      if (direction === 'increase') {
        return Math.min(prevIndex + 1, chartData.length - 1);
      } else {
        return Math.max(prevIndex - 1, 0);
      }
    });
    setSingleLetterIndex(0);
  }, [chartData.length]);

  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartType(type);
    setCurrentLineIndex(0);
    setSingleLetterIndex(0);
    setIsSingleLetterMode(false);
  }, []);

  const handleSetLineView = useCallback(() => {
    if (!isSingleLetterMode) return;
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
  }, [isSingleLetterMode]);

  const handleSetLetterView = useCallback(() => {
      if (isSingleLetterMode) return;
      setIsSingleLetterMode(true);
      setSingleLetterIndex(0);
  }, [isSingleLetterMode]);

  const handleToggleSingleLetterMode = useCallback(() => {
      if (isSingleLetterMode) {
        handleSetLineView();
      } else {
        handleSetLetterView();
      }
  }, [isSingleLetterMode, handleSetLineView, handleSetLetterView]);

  const handleNextLetter = useCallback(() => {
    const currentLine = chartData[currentLineIndex];
    if (singleLetterIndex < currentLine.letters.length - 1) {
      setSingleLetterIndex(prev => prev + 1);
    } else if (currentLineIndex < chartData.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setSingleLetterIndex(0);
    }
  }, [currentLineIndex, singleLetterIndex, chartData]);

  const handlePreviousLetter = useCallback(() => {
    if (singleLetterIndex > 0) {
      setSingleLetterIndex(prev => prev - 1);
    } else if (currentLineIndex > 0) {
      const prevLineIndex = currentLineIndex - 1;
      const prevLine = chartData[prevLineIndex];
      setCurrentLineIndex(prevLineIndex);
      setSingleLetterIndex(prevLine.letters.length - 1);
    }
  }, [currentLineIndex, singleLetterIndex, chartData]);

  const handleResetView = useCallback(() => {
    setCurrentLineIndex(0);
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
    setChartMode('display');
  }, []);
  
  // Effect for Mouse Mode - runs globally and captures events
  useEffect(() => {
    const CURSOR_SPEED = 20;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Toggle mouse mode with 'm' key
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setIsMouseMode(prev => {
          if (!prev) { // When turning on, reset cursor position
            setCursorPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          }
          return !prev;
        });
        return;
      }

      if (isMouseMode) {
        event.preventDefault();
        event.stopImmediatePropagation(); // This stops other listeners on window (e.g., in other components)

        switch (event.key) {
          case 'ArrowUp':
            setCursorPosition(prev => ({ ...prev, y: Math.max(0, prev.y - CURSOR_SPEED) }));
            break;
          case 'ArrowDown':
            setCursorPosition(prev => ({ ...prev, y: Math.min(window.innerHeight - 1, prev.y + CURSOR_SPEED) }));
            break;
          case 'ArrowLeft':
            setCursorPosition(prev => ({ ...prev, x: Math.max(0, prev.x - CURSOR_SPEED) }));
            break;
          case 'ArrowRight':
            setCursorPosition(prev => ({ ...prev, x: Math.min(window.innerWidth - 1, prev.x + CURSOR_SPEED) }));
            break;
          case 'Enter':
          case ' ':
            const elem = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
            if (elem instanceof HTMLElement) {
              elem.click();
            }
            break;
          default:
            break;
        }
      }
    };
    
    // Use capture phase to ensure this listener runs before others
    window.addEventListener('keydown', handleGlobalKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [isMouseMode, cursorPosition]);


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
              handlePreviousLetter();
            }
            break;
          case 'ArrowRight':
            if (isSingleLetterMode) {
              event.preventDefault();
              handleNextLetter();
            } else {
              event.preventDefault();
              handleSetLetterView();
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
          case ' ': // Handle space key as select
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
  }, [view, chartMode, isSingleLetterMode, handleLineChange, handleNextLetter, handlePreviousLetter, handleSetLetterView, handleToggleSingleLetterMode, isFullscreen, handleToggleFullscreen, getControlRefs, focusedControlIndex]);

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
    return <LandingPage onSelectChart={handleSelectChart} onCalibrate={handleStartCalibration} />;
  }
  
  if (view === 'calibration') {
    return <CalibrationPage onCalibrationComplete={handleCalibrationComplete} onBack={() => setView('landing')} />;
  }
  
  const isAtFirstLetterOverall = currentLineIndex === 0 && singleLetterIndex === 0;
  const isAtLastLetterOverall = currentLineIndex === chartData.length - 1 && singleLetterIndex === chartData[currentLineIndex].letters.length - 1;

  return (
    <main className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden">
      {isMouseMode && <VirtualCursor position={cursorPosition} />}
      {isMouseMode && (
        <div 
          className="fixed bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-lg px-4 py-2 rounded-lg shadow-lg z-[9998]"
          aria-live="polite"
        >
          Mouse Mode <span className="font-mono bg-white/20 px-2 py-1 rounded">M</span>
        </div>
      )}
      <div className="flex-grow flex items-center justify-center w-full">
        <EyeChart 
          chartType={chartType}
          line={currentLine}
          isSingleLetterMode={isSingleLetterMode}
          singleLetterIndex={singleLetterIndex}
          isFullscreen={isFullscreen}
          pixelsPerMm={pixelsPerMm}
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
          onSetLetterView={handleSetLetterView}
          onPreviousLetter={handlePreviousLetter}
          onNextLetter={handleNextLetter}
          isAtFirstLetter={isAtFirstLetterOverall}
          isAtLastLetter={isAtLastLetterOverall}
          onGoHome={handleGoHome}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onResetView={handleResetView}
          homeRef={homeRef}
          snellenRef={snellenRef}
          hindiRef={hindiRef}
          cChartRef={cChartRef}
          sizeMinusRef={sizeMinusRef}
          sizePlusRef={sizePlusRef}
          letterPrevRef={letterPrevRef}
          letterNextRef={letterNextRef}
          fullscreenRef={fullscreenRef}
          resetViewRef={resetViewRef}
        />
      )}
    </main>
  );
};

export default App;