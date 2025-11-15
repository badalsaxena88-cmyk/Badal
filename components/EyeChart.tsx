import React, { useState, useEffect, useMemo } from 'react';
import { ChartType, ChartLine } from '../types';

interface EyeChartProps {
  chartType: ChartType;
  line: ChartLine;
  isSingleLetterMode: boolean;
  singleLetterIndex: number;
  isFullscreen: boolean;
  pixelsPerMm: number;
}

const rotations = ['rotate-0', 'rotate-90', 'rotate-180', '-rotate-90'];
const getRandomRotation = () => rotations[Math.floor(Math.random() * rotations.length)];

const EyeChart: React.FC<EyeChartProps> = ({ chartType, line, isSingleLetterMode, singleLetterIndex, isFullscreen, pixelsPerMm }) => {
  const [cRotations, setCRotations] = useState<string[]>([]);

  useEffect(() => {
    if (chartType === ChartType.CChart) {
      setCRotations(line.letters.map(() => getRandomRotation()));
    }
  }, [line, chartType]);

  const fontSizePx = useMemo(() => {
    // CSS font-size sets the height of the em-box, not the actual character height (cap-height).
    // For many fonts, cap-height is ~70% of the font-size. To make the rendered character
    // height match the required physical height, we apply a correction factor.
    const correctionFactor = 1.4; // (1 / 0.7)
    return line.size * pixelsPerMm * correctionFactor;
  }, [line.size, pixelsPerMm]);

  const chartContent = useMemo(() => {
    const lettersToRender = isSingleLetterMode ? [line.letters[singleLetterIndex]] : line.letters;
    const letterKeyOffset = isSingleLetterMode ? singleLetterIndex : 0;

    return lettersToRender.map((letter, index) => {
      if (letter === undefined) return null; // Safety check if index is out of bounds
      
      const isCChart = chartType === ChartType.CChart;
      const originalIndex = index + letterKeyOffset;
      const transformClass = isCChart ? cRotations[originalIndex] || '' : '';
      
      return (
        <span
          key={`${line.acuity}-${originalIndex}`}
          className={`inline-block transition-transform duration-200 ${transformClass}`}
        >
          {letter}
        </span>
      );
    });
  }, [line, chartType, cRotations, isSingleLetterMode, singleLetterIndex]);

  return (
    <div className="w-full text-center p-4 flex flex-col items-center justify-center">
      <div 
        className={`flex items-center justify-center gap-x-2 md:gap-x-8 flex-wrap font-serif tracking-wider ${line.lineHeight}`}
        style={{ fontSize: `${fontSizePx}px` }}
        aria-live="polite"
      >
        {chartContent}
      </div>
      {!isFullscreen && (
        <div className="absolute top-4 left-4 bg-gray-100 text-black px-4 py-2 rounded-lg text-2xl md:text-3xl font-mono">
          {line.acuity}
        </div>
      )}
    </div>
  );
};

export default EyeChart;
