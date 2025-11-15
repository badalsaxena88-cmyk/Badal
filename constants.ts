import { ChartLine } from './types';

// Standard optotype heights in mm for a 6-meter testing distance.
// Based on size for 6/6 being 8.87mm. Size for 6/X = (X/6) * 8.87mm.
export const SNELLEN_CHART: ChartLine[] = [
  { acuity: '6/60', letters: ['A'], size: 88.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/36', letters: ['O', 'X'], size: 53.2, lineHeight: 'leading-[1.1]' },
  { acuity: '6/24', letters: ['H', 'V', 'T'], size: 35.5, lineHeight: 'leading-[1.1]' },
  { acuity: '6/18', letters: ['X', 'A', 'U'], size: 26.6, lineHeight: 'leading-[1.1]' },
  { acuity: '6/12', letters: ['V', 'O', 'T', 'H'], size: 17.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/9', letters: ['X', 'A', 'M', 'U', 'T'], size: 13.3, lineHeight: 'leading-[1.1]' },
  { acuity: '6/6', letters: ['V', 'H', 'A', 'I', 'X', 'U', 'Y'], size: 8.9, lineHeight: 'leading-[1.1]' }, // Rounded
  { acuity: '6/5', letters: ['A', 'U', 'T', 'H', 'Y', 'M', 'X', 'V'], size: 7.4, lineHeight: 'leading-[1.1]' },
];

export const HINDI_CHART: ChartLine[] = [
  { acuity: '6/60', letters: ['र'], size: 88.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/36', letters: ['त', 'प'], size: 53.2, lineHeight: 'leading-[1.1]' },
  { acuity: '6/24', letters: ['न', 'ग', 'ट'], size: 35.5, lineHeight: 'leading-[1.1]' },
  { acuity: '6/18', letters: ['म', 'त', 'र', 'फ'], size: 26.6, lineHeight: 'leading-[1.1]' },
  { acuity: '6/12', letters: ['ग', 'ड', 'त', 'र', 'व', 'म'], size: 17.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/9', letters: ['फ', 'न', 'र', 'व', 'म'], size: 13.3, lineHeight: 'leading-[1.1]' },
  { acuity: '6/6', letters: ['ट', 'म', 'ग', 'प', 'त'], size: 8.9, lineHeight: 'leading-[1.1]' },
];

export const C_CHART: ChartLine[] = [
  { acuity: '6/60', letters: ['C'], size: 88.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/36', letters: ['C', 'C'], size: 53.2, lineHeight: 'leading-[1.1]' },
  { acuity: '6/24', letters: ['C', 'C', 'C'], size: 35.5, lineHeight: 'leading-[1.1]' },
  { acuity: '6/18', letters: ['C', 'C', 'C', 'C'], size: 26.6, lineHeight: 'leading-[1.1]' },
  { acuity: '6/12', letters: ['C', 'C', 'C', 'C', 'C'], size: 17.7, lineHeight: 'leading-[1.1]' },
  { acuity: '6/9', letters: ['C', 'C', 'C', 'C', 'C', 'C'], size: 13.3, lineHeight: 'leading-[1.1]' },
  { acuity: '6/6', letters: ['C', 'C', 'C', 'C', 'C', 'C', 'C'], size: 8.9, lineHeight: 'leading-[1.1]' },
  { acuity: '6/5', letters: ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'], size: 7.4, lineHeight: 'leading-[1.1]' },
  { acuity: '6/4', letters: ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'], size: 5.9, lineHeight: 'leading-[1.1]' },
];
