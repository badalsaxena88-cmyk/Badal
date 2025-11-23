import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChartType } from './types';
import EyeChart from './components/EyeChart';
import Controls from './components/Controls';
import LandingPage from './components/LandingPage';
import CalibrationPage from './components/CalibrationPage';
import { SNELLEN_CHART, HINDI_CHART, C_CHART, NUMERIC_CHART } from './constants';
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
  
  // State for focused elements in other views
  const [landingFocusedIndex, setLandingFocusedIndex] = useState(0);
  const [calibrationFocusedIndex, setCalibrationFocusedIndex] = useState(1);
  const [calibrationBoxWidth, setCalibrationBoxWidth] = useState(230); // INITIAL_PIXEL_WIDTH in calibration page

  useEffect(() => {
    const storedPpmm = localStorage.getItem('pixelsPerMm');
    if (storedPpmm) {
      setPixelsPerMm(parseFloat(storedPpmm));
    }
  }, []);

  // --- REFS FOR ALL FOCUSABLE ELEMENTS ---
  // Chart Controls Refs
  const homeRef = useRef<HTMLButtonElement>(null);
  const snellenRef = useRef<HTMLButtonElement>(null);
  const hindiRef = useRef<HTMLButtonElement>(null);
  const numericRef = useRef<HTMLButtonElement>(null);
  const cChartRef = useRef<HTMLButtonElement>(null);
  const sizeMinusRef = useRef<HTMLButtonElement>(null);
  const sizePlusRef = useRef<HTMLButtonElement>(null);
  const letterMinusRef = useRef<HTMLButtonElement>(null);
  const letterPlusRef = useRef<HTMLButtonElement>(null);
  const resetViewRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);

  // Landing Page Refs
  const snellenCardRef = useRef<HTMLButtonElement>(null);
  const hindiCardRef = useRef<HTMLButtonElement>(null);
  const numericCardRef = useRef<HTMLButtonElement>(null);
  const cChartCardRef = useRef<HTMLButtonElement>(null);
  const calibrateButtonRef = useRef<HTMLButtonElement>(null);

  // Calibration Page Refs
  const calibBackRef = useRef<HTMLButtonElement>(null);
  const calibMinusRef = useRef<HTMLButtonElement>(null);
  const calibPlusRef = useRef<HTMLButtonElement>(null);
  const calibSaveRef = useRef<HTMLButtonElement>(null);

  const getControlRefs = useCallback(() => {
    const refs = [homeRef, snellenRef, hindiRef, numericRef, cChartRef, sizePlusRef, sizeMinusRef, letterMinusRef, letterPlusRef, resetViewRef, fullscreenRef];
    return refs.map(ref => ref.current ? ref : null).filter(Boolean);
  }, []);
  
  const getLandingRefs = useCallback(() => [snellenCardRef, hindiCardRef, numericCardRef, cChartCardRef, calibrateButtonRef], []);
  const getCalibrationRefs = useCallback(() => [calibBackRef, calibMinusRef, calibPlusRef, calibSaveRef], []);


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
      case ChartType.Snellen: return SNELLEN_CHART;
      case ChartType.Hindi: return HINDI_CHART;
      case ChartType.Numeric: return NUMERIC_CHART;
      case ChartType.CChart: return C_CHART;
      default: return SNELLEN_CHART;
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
      if (isSingleLetterMode) handleSetLineView();
      else handleSetLetterView();
  }, [isSingleLetterMode, handleSetLineView, handleSetLetterView]);

  const handleNextLetter = useCallback(() => {
    if (!isSingleLetterMode) {
      setIsSingleLetterMode(true);
      return;
    }

    const currentLine = chartData[currentLineIndex];
    if (singleLetterIndex < currentLine.letters.length - 1) {
      setSingleLetterIndex(prev => prev + 1);
    } else if (currentLineIndex < chartData.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setSingleLetterIndex(0);
    }
  }, [isSingleLetterMode, currentLineIndex, singleLetterIndex, chartData]);

  const handlePreviousLetter = useCallback(() => {
    if (!isSingleLetterMode) {
      setIsSingleLetterMode(true);
      return;
    }

    if (singleLetterIndex > 0) {
      setSingleLetterIndex(prev => prev - 1);
    } else if (currentLineIndex > 0) {
      const prevLineIndex = currentLineIndex - 1;
      const prevLine = chartData[prevLineIndex];
      setCurrentLineIndex(prevLineIndex);
      setSingleLetterIndex(prevLine.letters.length - 1);
    }
  }, [isSingleLetterMode, currentLineIndex, singleLetterIndex, chartData]);

  const handleResetView = useCallback(() => {
    setCurrentLineIndex(0);
    setIsSingleLetterMode(false);
    setSingleLetterIndex(0);
    setChartMode('display');
  }, []);

  // --- CENTRALIZED KEYDOWN HANDLER ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // --- Mouse Mode Handler (runs first) ---
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setIsMouseMode(prev => {
          if (!prev) {
            setCursorPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          }
          return !prev;
        });
        return;
      }

      if (isMouseMode) {
        event.preventDefault();
        const CURSOR_SPEED = 20;
        switch (event.key) {
          case 'ArrowUp': setCursorPosition(prev => ({ ...prev, y: Math.max(0, prev.y - CURSOR_SPEED) })); break;
          case 'ArrowDown': setCursorPosition(prev => ({ ...prev, y: Math.min(window.innerHeight - 1, prev.y + CURSOR_SPEED) })); break;
          case 'ArrowLeft': setCursorPosition(prev => ({ ...prev, x: Math.max(0, prev.x - CURSOR_SPEED) })); break;
          case 'ArrowRight': setCursorPosition(prev => ({ ...prev, x: Math.min(window.innerWidth - 1, prev.x + CURSOR_SPEED) })); break;
          case 'Enter': case ' ':
            const elem = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
            if (elem instanceof HTMLElement) elem.click();
            break;
        }
        return; // Stop further processing if in mouse mode
      }

      // --- View-based Handlers ---
      switch (view) {
        case 'landing': {
          const landingRefs = getLandingRefs();
          const focusableItemsCount = landingRefs.length;
          switch (event.key) {
            case 'ArrowRight': event.preventDefault(); setLandingFocusedIndex(prev => (prev + 1) % focusableItemsCount); break;
            case 'ArrowLeft': event.preventDefault(); setLandingFocusedIndex(prev => (prev - 1 + focusableItemsCount) % focusableItemsCount); break;
            case 'Enter': case ' ': event.preventDefault(); landingRefs[landingFocusedIndex]?.current?.click(); break;
          }
          break;
        }
        case 'chart': {
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
                event.preventDefault();
                handlePreviousLetter();
                break;
              case 'ArrowRight':
                event.preventDefault();
                handleNextLetter();
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
                if (!isFullscreen) {
                  event.preventDefault();
                  setChartMode('controls');
                  setFocusedControlIndex(0);
                }
                break;
            }
          } else { // chartMode === 'controls'
            const controlRefs = getControlRefs();
            if (controlRefs.length === 0) return;
            switch (event.key) {
              case 'Escape': event.preventDefault(); setChartMode('display'); break;
              case 'ArrowRight': event.preventDefault(); setFocusedControlIndex(prev => (prev + 1) % controlRefs.length); break;
              case 'ArrowLeft': event.preventDefault(); setFocusedControlIndex(prev => (prev - 1 + controlRefs.length) % controlRefs.length); break;
              case 'Enter': case ' ': event.preventDefault(); controlRefs[focusedControlIndex]?.current?.click(); break;
            }
          }
          break;
        }
        case 'calibration': {
          const calibRefs = getCalibrationRefs();
          const focusableItemsCount = calibRefs.length;
          switch (event.key) {
            case 'ArrowRight': event.preventDefault(); setCalibrationFocusedIndex(prev => (prev + 1) % focusableItemsCount); break;
            case 'ArrowLeft': event.preventDefault(); setCalibrationFocusedIndex(prev => (prev - 1 + focusableItemsCount) % focusableItemsCount); break;
            case 'ArrowUp': event.preventDefault(); setCalibrationBoxWidth(prev => Math.max(50, prev + 1)); break;
            case 'ArrowDown': event.preventDefault(); setCalibrationBoxWidth(prev => Math.max(50, prev - 1)); break;
            case 'Enter': case ' ': event.preventDefault(); calibRefs[calibrationFocusedIndex]?.current?.click(); break;
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, isMouseMode, cursorPosition, landingFocusedIndex, calibrationFocusedIndex, calibrationBoxWidth, chartMode, isSingleLetterMode, focusedControlIndex, handleLineChange, handleNextLetter, handlePreviousLetter, handleToggleSingleLetterMode, isFullscreen, handleToggleFullscreen, getControlRefs, getLandingRefs, getCalibrationRefs]);

  // --- FOCUS MANAGEMENT EFFECT ---
  useEffect(() => {
    if (isMouseMode) return;

    switch (view) {
        case 'landing': getLandingRefs()[landingFocusedIndex]?.current?.focus(); break;
        case 'calibration': getCalibrationRefs()[calibrationFocusedIndex]?.current?.focus(); break;
        case 'chart':
            if (chartMode === 'controls') {
                getControlRefs()[focusedControlIndex]?.current?.focus();
            } else {
                const activeElement = document.activeElement as HTMLElement;
                const controlsContainer = document.querySelector('.controls-container');
                if (activeElement && controlsContainer?.contains(activeElement)) {
                    activeElement.blur();
                }
            }
            break;
    }
  }, [view, landingFocusedIndex, calibrationFocusedIndex, chartMode, focusedControlIndex, getLandingRefs, getCalibrationRefs, getControlRefs, isMouseMode]);
  
  const handleAdjustCalibrationWidth = (amount: number) => {
    setCalibrationBoxWidth(prev => Math.max(50, prev + amount));
  };
  
  const handleSaveCalibration = () => {
    const CREDIT_CARD_WIDTH_MM = 85.6;
    const ppmm = calibrationBoxWidth / CREDIT_CARD_WIDTH_MM;
    handleCalibrationComplete(ppmm);
  };

  const isAtChartStart = currentLineIndex === 0 && singleLetterIndex === 0;
  const lastLineIndex = chartData.length - 1;
  const isAtChartEnd = currentLineIndex === lastLineIndex && singleLetterIndex === chartData[lastLineIndex].letters.length - 1;


  if (view === 'landing') {
    return <LandingPage 
      onSelectChart={handleSelectChart} 
      onCalibrate={handleStartCalibration} 
      snellenCardRef={snellenCardRef}
      hindiCardRef={hindiCardRef}
      numericCardRef={numericCardRef}
      cChartCardRef={cChartCardRef}
      calibrateButtonRef={calibrateButtonRef}
    />;
  }
  
  if (view === 'calibration') {
    return <CalibrationPage 
      onSave={handleSaveCalibration} 
      onBack={() => setView('landing')} 
      boxWidthPx={calibrationBoxWidth}
      onAdjustWidth={handleAdjustCalibrationWidth}
      backRef={calibBackRef}
      minusRef={calibMinusRef}
      plusRef={calibPlusRef}
      saveRef={calibSaveRef}
    />;
  }
  
  return (
    <main className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans overflow-hidden">
      {isMouseMode && <VirtualCursor position={cursorPosition} />}
      {isMouseMode && (
        <div className="fixed bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-lg px-4 py-2 rounded-lg shadow-lg z-[9998]" aria-live="polite">
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
          onGoHome={handleGoHome}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onResetView={handleResetView}
          onNextLetter={handleNextLetter}
          onPreviousLetter={handlePreviousLetter}
          isSingleLetterMode={isSingleLetterMode}
          isAtChartStart={isAtChartStart}
          isAtChartEnd={isAtChartEnd}
          homeRef={homeRef}
          snellenRef={snellenRef}
          hindiRef={hindiRef}
          numericRef={numericRef}
          cChartRef={cChartRef}
          sizeMinusRef={sizeMinusRef}
          sizePlusRef={sizePlusRef}
          letterMinusRef={letterMinusRef}
          letterPlusRef={letterPlusRef}
          fullscreenRef={fullscreenRef}
          resetViewRef={resetViewRef}
        />
      )}
    </main>
  );
};

export default App;