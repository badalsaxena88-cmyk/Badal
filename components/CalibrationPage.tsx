import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, MinusIcon, BackIcon, CheckIcon } from './icons';

interface CalibrationPageProps {
  onCalibrationComplete: (pixelsPerMm: number) => void;
  onBack: () => void;
}

const CREDIT_CARD_WIDTH_MM = 85.6;
// Start with a reasonable pixel width for a 32" TV
const INITIAL_PIXEL_WIDTH = 230;

const CalibrationPage: React.FC<CalibrationPageProps> = ({ onCalibrationComplete, onBack }) => {
  const [boxWidthPx, setBoxWidthPx] = useState(INITIAL_PIXEL_WIDTH);
  const [focusedControlIndex, setFocusedControlIndex] = useState(1); // Start focus on Minus button

  const backRef = useRef<HTMLButtonElement>(null);
  const minusRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  
  const controlRefs = [backRef, minusRef, plusRef, saveRef];

  const handleSave = () => {
    const pixelsPerMm = boxWidthPx / CREDIT_CARD_WIDTH_MM;
    onCalibrationComplete(pixelsPerMm);
  };
  
  const adjustWidth = (amount: number) => {
      setBoxWidthPx(prev => Math.max(50, prev + amount));
  };

  useEffect(() => {
    const focusedElement = controlRefs[focusedControlIndex]?.current;
    if (focusedElement) {
        focusedElement.focus();
    }
  }, [focusedControlIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          setFocusedControlIndex(prev => (prev + 1) % controlRefs.length);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedControlIndex(prev => (prev - 1 + controlRefs.length) % controlRefs.length);
          break;
        case 'ArrowUp':
            event.preventDefault();
            adjustWidth(1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            adjustWidth(-1);
            break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          controlRefs[focusedControlIndex]?.current?.click();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedControlIndex, controlRefs]);

  return (
    <div className="bg-white text-black h-screen w-screen flex flex-col items-center justify-center font-sans p-8 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Display Calibration</h1>
      <p className="text-xl md:text-3xl max-w-4xl mb-12">
        Hold a standard credit card up to the screen. Use the buttons or arrow keys to adjust the box's width to match your card.
      </p>
      
      <div className="flex flex-col items-center">
        <div
          className="bg-gray-300 border-2 border-dashed border-gray-600 rounded-lg"
          style={{ 
              width: `${boxWidthPx}px`, 
              height: `${boxWidthPx * (53.98 / 85.6)}px`, // Maintain credit card aspect ratio
            }}
        />
        <p className="text-lg md:text-xl font-mono mt-4">Target Width: 85.6 mm</p>
      </div>

      <div className="mt-12 flex items-center justify-center gap-8">
        <button
            ref={backRef}
            onClick={onBack}
            className="p-4 bg-gray-200 rounded-lg text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300 flex items-center gap-2"
            aria-label="Go back"
        >
            <BackIcon />
            <span className="text-xl font-semibold">Back</span>
        </button>

        <button
          ref={minusRef}
          onClick={() => adjustWidth(-1)}
          className="p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          aria-label="Decrease size"
        >
          <MinusIcon />
        </button>
        <button
          ref={plusRef}
          onClick={() => adjustWidth(1)}
          className="p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          aria-label="Increase size"
        >
          <PlusIcon />
        </button>

        <button
          ref={saveRef}
          onClick={handleSave}
          className="p-4 bg-blue-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-blue-700 flex items-center gap-2"
          aria-label="Save calibration"
        >
          <CheckIcon />
          <span className="text-xl font-semibold">Save & Start</span>
        </button>
      </div>
    </div>
  );
};

export default CalibrationPage;
