import type { MetricKey, MetricConfig, CentroidZoom, CountryData } from "./types";
import { countries } from "./countries";

export const metrics: Record<MetricKey, MetricConfig> = {
  lifeScore: { key: "lifeScore", label: "Life Score", shortLabel: "Life", invertScale: false, format: (v) => v.toFixed(1) },
  avgTechSalary: { key: "avgTechSalary", label: "Avg Tech Salary", shortLabel: "Salary", invertScale: false, format: (v) => `$${(v / 1000).toFixed(0)}k` },
  costOfLivingIndex: { key: "costOfLivingIndex", label: "Cost of Living", shortLabel: "CoL", invertScale: true, format: (v) => v.toFixed(0) },
  taxRate: { key: "taxRate", label: "Tax Rate", shortLabel: "Tax", invertScale: true, format: (v) => `${v}%` },
  qualityOfLife: { key: "qualityOfLife", label: "Quality of Life", shortLabel: "QoL", invertScale: false, format: (v) => v.toFixed(0) },
  safety: { key: "safety", label: "Safety Index", shortLabel: "Safety", invertScale: false, format: (v) => v.toFixed(0) },
  internetSpeed: { key: "internetSpeed", label: "Internet Speed", shortLabel: "Internet", invertScale: false, format: (v) => `${v} Mbps` },
  techJobCount: { key: "techJobCount", label: "Tech Job Market", shortLabel: "Jobs", invertScale: false, format: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v) },
  healthcareIndex: { key: "healthcareIndex", label: "Healthcare", shortLabel: "Health", invertScale: false, format: (v) => v.toFixed(0) },
};

export const metricKeys: MetricKey[] = [
  "lifeScore", "avgTechSalary", "costOfLivingIndex", "taxRate",
  "qualityOfLife", "safety", "internetSpeed", "techJobCount", "healthcareIndex",
];

export function getColorForValue(value: number, min: number, max: number, invertScale: boolean): string {
  if (max === min) return "hsl(60, 70%, 50%)";
  let normalized = (value - min) / (max - min);
  if (invertScale) normalized = 1 - normalized;
  normalized = Math.max(0, Math.min(1, normalized));
  return `hsl(${normalized * 120}, 70%, 45%)`;
}

export const NO_DATA_COLOR = "hsl(0, 0%, 88%)";

export function getMetricRange(key: MetricKey): { min: number; max: number } {
  const values = countries.map((c) => c[key] as number);
  return { min: Math.min(...values), max: Math.max(...values) };
}

const centroidZoomMap: Record<string, CentroidZoom> = {
  "840": { center: [-97, 38], zoom: 3.5 }, "124": { center: [-96, 56], zoom: 3 },
  "076": { center: [-52, -14], zoom: 3 }, "156": { center: [104, 35], zoom: 3 },
  "356": { center: [79, 22], zoom: 3.5 }, "036": { center: [134, -25], zoom: 3.5 },
  "484": { center: [-102, 23], zoom: 4 }, "032": { center: [-64, -34], zoom: 3.5 },
  "710": { center: [25, -29], zoom: 5 }, "566": { center: [8, 10], zoom: 5 },
  "404": { center: [38, 1], zoom: 5 }, "818": { center: [30, 27], zoom: 5 },
  "392": { center: [138, 36], zoom: 5 }, "410": { center: [128, 36], zoom: 6 },
  "764": { center: [101, 15], zoom: 5 }, "704": { center: [108, 16], zoom: 5 },
  "360": { center: [118, -2], zoom: 3.5 }, "792": { center: [35, 39], zoom: 5 },
  "826": { center: [-2, 54], zoom: 6 }, "276": { center: [10, 51], zoom: 6 },
  "250": { center: [2, 47], zoom: 5.5 }, "380": { center: [12, 42], zoom: 5.5 },
  "724": { center: [-3, 40], zoom: 5.5 }, "528": { center: [5, 52], zoom: 8 },
  "752": { center: [16, 62], zoom: 5 }, "578": { center: [10, 64], zoom: 4.5 },
  "208": { center: [10, 56], zoom: 8 }, "246": { center: [26, 64], zoom: 5 },
  "756": { center: [8, 47], zoom: 8 }, "040": { center: [14, 47.5], zoom: 7 },
  "372": { center: [-8, 53], zoom: 7 }, "616": { center: [19, 52], zoom: 6 },
  "203": { center: [15, 50], zoom: 7 }, "642": { center: [25, 46], zoom: 6.5 },
  "620": { center: [-8, 39.5], zoom: 7 }, "056": { center: [4, 50.5], zoom: 8 },
  "233": { center: [25, 59], zoom: 8 }, "702": { center: [104, 1.3], zoom: 12 },
  "344": { center: [114, 22.3], zoom: 12 }, "376": { center: [35, 31], zoom: 7 },
  "784": { center: [54, 24], zoom: 7 }, "682": { center: [45, 24], zoom: 4.5 },
  "554": { center: [174, -41], zoom: 5 }, "170": { center: [-72, 4], zoom: 4.5 },
  "152": { center: [-71, -33], zoom: 4 }, "268": { center: [43.5, 42], zoom: 8 },
  "158": { center: [121, 24], zoom: 7 }, "458": { center: [109, 4], zoom: 5 },
  "804": { center: [32, 49], zoom: 5.5 }, "348": { center: [19, 47], zoom: 7 },
};

export function getCentroidZoom(numericCode: string, country?: CountryData): CentroidZoom {
  if (centroidZoomMap[numericCode]) return centroidZoomMap[numericCode];
  const continent = country?.continent ?? "";
  switch (continent) {
    case "Europe": return { center: [15, 50], zoom: 4 };
    case "Asia": return { center: [100, 35], zoom: 3 };
    case "Africa": return { center: [20, 0], zoom: 3 };
    case "North America": case "Central America": case "Caribbean": return { center: [-80, 20], zoom: 3 };
    case "South America": return { center: [-58, -15], zoom: 3 };
    case "Oceania": return { center: [150, -25], zoom: 3.5 };
    case "Middle East": return { center: [45, 28], zoom: 4 };
    default: return { center: [0, 20], zoom: 1 };
  }
}

export function getFlagEmoji(code: string): string {
  return code.toUpperCase().split("").map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
}
