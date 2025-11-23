export enum ChartType {
  Snellen = 'snellen',
  Hindi = 'hindi',
  Numeric = 'numeric',
  CChart = 'c-chart',
}

export interface ChartLine {
  acuity: string;
  letters: string[];
  size: number; // Optotype height in mm
  lineHeight: string;
}