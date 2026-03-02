export type MetricKey =
  | "lifeScore"
  | "avgTechSalary"
  | "costOfLivingIndex"
  | "taxRate"
  | "qualityOfLife"
  | "safety"
  | "internetSpeed"
  | "techJobCount"
  | "healthcareIndex";

export interface MetricConfig {
  key: MetricKey;
  label: string;
  shortLabel: string;
  invertScale: boolean;
  format: (value: number) => string;
}

export interface CountryData {
  code: string;
  numericCode: string;
  name: string;
  continent: string;
  costOfLivingIndex: number;
  avgTechSalary: number;
  taxRate: number;
  qualityOfLife: number;
  safety: number;
  internetSpeed: number;
  techJobCount: number;
  healthcareIndex: number;
  lifeScore: number;
  hasDetailedData: boolean;
}

export interface CentroidZoom {
  center: [number, number];
  zoom: number;
}
