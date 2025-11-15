export enum ChartType {
  Snellen = 'snellen',
  Hindi = 'hindi',
  CChart = 'c-chart',
}

export interface ChartLine {
  acuity: string;
  letters: string[];
  size: number; // Optotype height in mm
  lineHeight: string;
}
