export enum ChartType {
  Snellen = 'snellen',
  Hindi = 'hindi',
  EChart = 'e-chart',
}

export interface ChartLine {
  acuity: string;
  letters: string[];
  size: string;
  lineHeight: string;
}
