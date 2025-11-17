import React from 'react';
import { PlusIcon, MinusIcon, BackIcon, CheckIcon } from './icons';

interface CalibrationPageProps {
  onSave: () => void;
  onBack: () => void;
  boxWidthPx: number;
  onAdjustWidth: (amount: number) => void;
  backRef: React.Ref<HTMLButtonElement>;
  minusRef: React.Ref<HTMLButtonElement>;
  plusRef: React.Ref<HTMLButtonElement>;
  saveRef: React.Ref<HTMLButtonElement>;
}

const CalibrationPage: React.FC<CalibrationPageProps> = ({
  onSave,
  onBack,
  boxWidthPx,
  onAdjustWidth,
  backRef,
  minusRef,
  plusRef,
  saveRef,
}) => {
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
          onClick={() => onAdjustWidth(-1)}
          className="p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          aria-label="Decrease size"
        >
          <MinusIcon />
        </button>
        <button
          ref={plusRef}
          onClick={() => onAdjustWidth(1)}
          className="p-4 bg-gray-200 rounded-full text-black transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-gray-300"
          aria-label="Increase size"
        >
          <PlusIcon />
        </button>

        <button
          ref={saveRef}
          onClick={onSave}
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
