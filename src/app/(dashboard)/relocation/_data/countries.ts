import type { CountryData } from "./types";

function computeLifeScore(c: Omit<CountryData, "lifeScore">): number {
  const score =
    c.qualityOfLife * 0.25 +
    c.safety * 0.15 +
    c.healthcareIndex * 0.15 +
    (c.avgTechSalary / 1500) * 0.15 +
    (200 - c.costOfLivingIndex) * 0.1 +
    (100 - c.taxRate) * 0.1 +
    (c.internetSpeed / 3) * 0.05 +
    (c.techJobCount / 10000) * 0.05;
  return Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;
}

function m(
  code: string, numericCode: string, name: string, continent: string,
  costOfLivingIndex: number, avgTechSalary: number, taxRate: number,
  qualityOfLife: number, safety: number, internetSpeed: number,
  techJobCount: number, healthcareIndex: number, hasDetailedData: boolean,
): CountryData {
  const base = { code, numericCode, name, continent, costOfLivingIndex, avgTechSalary, taxRate, qualityOfLife, safety, internetSpeed, techJobCount, healthcareIndex, hasDetailedData };
  return { ...base, lifeScore: computeLifeScore(base) };
}

export const countries: CountryData[] = [
  // North America
  m("US", "840", "United States", "North America", 100, 120000, 32, 72, 55, 220, 500000, 72, true),
  m("CA", "124", "Canada", "North America", 87, 90000, 33, 78, 75, 200, 120000, 80, true),
  m("MX", "484", "Mexico", "North America", 40, 35000, 30, 55, 38, 90, 40000, 58, true),
  m("GT", "320", "Guatemala", "Central America", 35, 15000, 25, 42, 30, 35, 3000, 40, false),
  m("HN", "340", "Honduras", "Central America", 33, 12000, 25, 38, 25, 30, 2000, 38, false),
  m("SV", "222", "El Salvador", "Central America", 36, 14000, 25, 40, 28, 32, 2500, 42, false),
  m("NI", "558", "Nicaragua", "Central America", 30, 10000, 25, 36, 35, 20, 1500, 36, false),
  m("CR", "188", "Costa Rica", "Central America", 52, 30000, 25, 65, 60, 70, 8000, 68, true),
  m("PA", "591", "Panama", "Central America", 50, 28000, 25, 60, 48, 65, 5000, 62, false),
  m("CU", "192", "Cuba", "Caribbean", 32, 8000, 20, 50, 65, 12, 500, 72, false),
  m("JM", "388", "Jamaica", "Caribbean", 48, 18000, 25, 52, 35, 40, 2000, 50, false),
  m("HT", "332", "Haiti", "Caribbean", 28, 5000, 20, 25, 18, 8, 500, 22, false),
  m("DO", "214", "Dominican Republic", "Caribbean", 38, 18000, 25, 52, 42, 55, 4000, 48, false),
  m("TT", "780", "Trinidad and Tobago", "Caribbean", 50, 25000, 25, 55, 38, 60, 3000, 55, false),
  m("BS", "044", "Bahamas", "Caribbean", 85, 30000, 0, 62, 45, 50, 1500, 58, false),
  // South America
  m("BR", "076", "Brazil", "South America", 42, 32000, 27, 58, 35, 110, 80000, 55, true),
  m("AR", "032", "Argentina", "South America", 35, 25000, 35, 60, 48, 80, 30000, 62, true),
  m("CL", "152", "Chile", "South America", 48, 35000, 35, 68, 58, 150, 20000, 65, true),
  m("CO", "170", "Colombia", "South America", 34, 22000, 33, 52, 38, 75, 25000, 55, true),
  m("PE", "604", "Peru", "South America", 36, 18000, 30, 50, 40, 60, 12000, 52, false),
  m("VE", "862", "Venezuela", "South America", 28, 8000, 34, 30, 20, 25, 3000, 40, false),
  m("EC", "218", "Ecuador", "South America", 38, 16000, 25, 50, 42, 45, 5000, 55, false),
  m("BO", "068", "Bolivia", "South America", 30, 12000, 25, 42, 40, 30, 3000, 42, false),
  m("PY", "600", "Paraguay", "South America", 32, 14000, 10, 45, 42, 35, 2500, 45, false),
  m("UY", "858", "Uruguay", "South America", 55, 30000, 36, 72, 68, 100, 8000, 70, true),
  m("GY", "328", "Guyana", "South America", 38, 12000, 28, 40, 35, 25, 1000, 40, false),
  m("SR", "740", "Suriname", "South America", 40, 10000, 28, 42, 38, 30, 800, 42, false),
  // Europe
  m("GB", "826", "United Kingdom", "Europe", 85, 85000, 40, 75, 65, 180, 200000, 78, true),
  m("DE", "276", "Germany", "Europe", 80, 82000, 42, 80, 78, 170, 180000, 82, true),
  m("FR", "250", "France", "Europe", 82, 65000, 45, 78, 60, 160, 120000, 82, true),
  m("NL", "528", "Netherlands", "Europe", 85, 78000, 40, 82, 75, 200, 80000, 80, true),
  m("SE", "752", "Sweden", "Europe", 82, 68000, 52, 85, 72, 190, 60000, 84, true),
  m("NO", "578", "Norway", "Europe", 95, 75000, 46, 88, 78, 180, 30000, 86, true),
  m("DK", "208", "Denmark", "Europe", 90, 72000, 55, 86, 80, 195, 35000, 84, true),
  m("FI", "246", "Finland", "Europe", 80, 62000, 44, 84, 82, 180, 25000, 82, true),
  m("CH", "756", "Switzerland", "Europe", 120, 110000, 22, 88, 82, 210, 50000, 86, true),
  m("AT", "040", "Austria", "Europe", 78, 62000, 42, 82, 78, 160, 25000, 82, true),
  m("BE", "056", "Belgium", "Europe", 78, 60000, 50, 75, 62, 170, 30000, 78, true),
  m("IE", "372", "Ireland", "Europe", 88, 82000, 40, 80, 72, 180, 45000, 78, true),
  m("ES", "724", "Spain", "Europe", 58, 48000, 37, 76, 65, 170, 50000, 78, true),
  m("PT", "620", "Portugal", "Europe", 52, 38000, 37, 74, 72, 160, 25000, 72, true),
  m("IT", "380", "Italy", "Europe", 72, 48000, 43, 70, 55, 130, 40000, 72, true),
  m("GR", "300", "Greece", "Europe", 55, 32000, 44, 68, 60, 100, 12000, 68, false),
  m("PL", "616", "Poland", "Europe", 48, 42000, 32, 70, 72, 150, 60000, 68, true),
  m("CZ", "203", "Czechia", "Europe", 50, 40000, 23, 72, 78, 140, 40000, 72, true),
  m("RO", "642", "Romania", "Europe", 42, 32000, 10, 62, 65, 170, 30000, 58, true),
  m("HU", "348", "Hungary", "Europe", 45, 32000, 33, 65, 68, 140, 20000, 62, false),
  m("BG", "100", "Bulgaria", "Europe", 38, 25000, 10, 58, 62, 120, 15000, 55, false),
  m("HR", "191", "Croatia", "Europe", 50, 28000, 36, 68, 72, 110, 8000, 65, false),
  m("SK", "703", "Slovakia", "Europe", 48, 30000, 25, 68, 72, 130, 12000, 62, false),
  m("SI", "705", "Slovenia", "Europe", 55, 35000, 36, 72, 78, 140, 8000, 68, false),
  m("LT", "440", "Lithuania", "Europe", 45, 32000, 20, 68, 72, 150, 12000, 62, false),
  m("LV", "428", "Latvia", "Europe", 45, 28000, 23, 65, 68, 140, 8000, 58, false),
  m("EE", "233", "Estonia", "Europe", 52, 38000, 20, 74, 78, 180, 10000, 68, true),
  m("IS", "352", "Iceland", "Europe", 95, 65000, 37, 88, 90, 190, 3000, 85, false),
  m("LU", "442", "Luxembourg", "Europe", 105, 80000, 42, 82, 82, 170, 5000, 80, false),
  m("MT", "470", "Malta", "Europe", 62, 38000, 35, 72, 72, 120, 4000, 68, false),
  m("CY", "196", "Cyprus", "Europe", 60, 35000, 35, 70, 68, 110, 5000, 65, false),
  m("RS", "688", "Serbia", "Europe", 38, 25000, 15, 58, 60, 100, 12000, 55, false),
  m("UA", "804", "Ukraine", "Europe", 30, 28000, 18, 48, 25, 80, 40000, 52, true),
  m("BY", "112", "Belarus", "Europe", 32, 18000, 13, 45, 55, 70, 8000, 50, false),
  m("MD", "498", "Moldova", "Europe", 30, 15000, 12, 42, 48, 60, 5000, 45, false),
  m("AL", "008", "Albania", "Europe", 35, 15000, 15, 50, 55, 50, 3000, 48, false),
  m("MK", "807", "North Macedonia", "Europe", 35, 18000, 18, 52, 58, 60, 4000, 50, false),
  m("BA", "070", "Bosnia and Herzegovina", "Europe", 35, 16000, 10, 50, 55, 50, 3000, 48, false),
  m("ME", "499", "Montenegro", "Europe", 42, 18000, 15, 55, 62, 60, 2000, 52, false),
  m("XK", "383", "Kosovo", "Europe", 32, 14000, 10, 45, 48, 40, 2000, 45, false),
  // Asia
  m("JP", "392", "Japan", "Asia", 82, 60000, 33, 80, 85, 200, 100000, 82, true),
  m("KR", "410", "South Korea", "Asia", 72, 55000, 35, 75, 80, 250, 80000, 78, true),
  m("CN", "156", "China", "Asia", 45, 40000, 45, 55, 65, 160, 200000, 62, true),
  m("IN", "356", "India", "Asia", 28, 18000, 30, 48, 40, 90, 300000, 48, true),
  m("SG", "702", "Singapore", "Asia", 92, 85000, 22, 85, 90, 260, 60000, 82, true),
  m("HK", "344", "Hong Kong", "Asia", 90, 75000, 17, 78, 82, 240, 40000, 78, true),
  m("TW", "158", "Taiwan", "Asia", 55, 45000, 20, 78, 82, 230, 50000, 78, true),
  m("TH", "764", "Thailand", "Asia", 42, 25000, 35, 60, 52, 130, 30000, 58, true),
  m("VN", "704", "Vietnam", "Asia", 32, 18000, 20, 52, 55, 100, 40000, 52, true),
  m("MY", "458", "Malaysia", "Asia", 42, 32000, 26, 65, 55, 120, 30000, 62, true),
  m("ID", "360", "Indonesia", "Asia", 35, 18000, 30, 50, 48, 80, 30000, 48, true),
  m("PH", "608", "Philippines", "Asia", 35, 16000, 32, 48, 38, 60, 40000, 48, true),
  m("BD", "050", "Bangladesh", "Asia", 25, 8000, 25, 35, 35, 40, 15000, 35, false),
  m("PK", "586", "Pakistan", "Asia", 25, 10000, 30, 32, 22, 30, 20000, 32, false),
  m("LK", "144", "Sri Lanka", "Asia", 32, 12000, 24, 52, 48, 50, 8000, 52, false),
  m("NP", "524", "Nepal", "Asia", 25, 8000, 25, 40, 42, 25, 3000, 38, false),
  m("KH", "116", "Cambodia", "Asia", 30, 10000, 20, 38, 42, 35, 3000, 35, false),
  m("MN", "496", "Mongolia", "Asia", 32, 12000, 25, 45, 55, 40, 3000, 45, false),
  m("KZ", "398", "Kazakhstan", "Asia", 35, 20000, 20, 55, 55, 70, 10000, 55, false),
  m("UZ", "860", "Uzbekistan", "Asia", 28, 10000, 22, 42, 50, 35, 5000, 45, false),
  m("GE", "268", "Georgia", "Asia", 35, 20000, 20, 62, 65, 80, 8000, 58, true),
  m("AM", "051", "Armenia", "Asia", 32, 18000, 20, 55, 58, 60, 6000, 52, false),
  m("AZ", "031", "Azerbaijan", "Asia", 35, 15000, 25, 50, 52, 50, 5000, 50, false),
  // Middle East
  m("AE", "784", "United Arab Emirates", "Middle East", 75, 70000, 0, 72, 82, 200, 30000, 68, true),
  m("SA", "682", "Saudi Arabia", "Middle East", 52, 55000, 0, 58, 68, 120, 20000, 62, true),
  m("IL", "376", "Israel", "Middle East", 82, 80000, 50, 72, 48, 180, 50000, 78, true),
  m("TR", "792", "Turkey", "Middle East", 38, 25000, 35, 55, 48, 80, 35000, 60, true),
  m("QA", "634", "Qatar", "Middle East", 72, 65000, 0, 70, 85, 180, 8000, 72, false),
  m("KW", "414", "Kuwait", "Middle East", 58, 50000, 0, 62, 72, 100, 5000, 62, false),
  m("BH", "048", "Bahrain", "Middle East", 55, 45000, 0, 65, 70, 120, 4000, 65, false),
  m("OM", "512", "Oman", "Middle East", 52, 40000, 0, 62, 78, 80, 3000, 62, false),
  m("JO", "400", "Jordan", "Middle East", 42, 20000, 20, 55, 58, 50, 5000, 55, false),
  m("LB", "422", "Lebanon", "Middle East", 45, 22000, 20, 45, 30, 40, 5000, 55, false),
  m("IQ", "368", "Iraq", "Middle East", 35, 15000, 15, 32, 18, 30, 3000, 35, false),
  m("IR", "364", "Iran", "Middle East", 30, 12000, 25, 42, 40, 40, 15000, 48, false),
  // Africa
  m("ZA", "710", "South Africa", "Africa", 38, 32000, 35, 48, 28, 60, 25000, 52, true),
  m("NG", "566", "Nigeria", "Africa", 28, 15000, 24, 32, 22, 30, 15000, 30, true),
  m("KE", "404", "Kenya", "Africa", 30, 18000, 30, 42, 32, 45, 10000, 38, true),
  m("EG", "818", "Egypt", "Africa", 28, 12000, 22, 45, 40, 50, 15000, 45, true),
  m("MA", "504", "Morocco", "Africa", 35, 15000, 38, 50, 52, 50, 8000, 48, false),
  m("TN", "788", "Tunisia", "Africa", 32, 12000, 25, 48, 48, 40, 5000, 50, false),
  m("GH", "288", "Ghana", "Africa", 30, 12000, 25, 45, 42, 35, 5000, 42, false),
  m("ET", "231", "Ethiopia", "Africa", 25, 6000, 30, 32, 28, 15, 3000, 28, false),
  m("TZ", "834", "Tanzania", "Africa", 28, 8000, 30, 38, 38, 20, 3000, 32, false),
  m("RW", "646", "Rwanda", "Africa", 28, 10000, 30, 45, 55, 30, 3000, 38, false),
  m("DZ", "012", "Algeria", "Africa", 32, 12000, 26, 42, 42, 30, 3000, 45, false),
  m("BW", "072", "Botswana", "Africa", 38, 15000, 25, 48, 52, 25, 2000, 48, false),
  m("MU", "480", "Mauritius", "Africa", 40, 18000, 15, 58, 60, 40, 3000, 55, false),
  // Oceania
  m("AU", "036", "Australia", "Oceania", 85, 90000, 34, 82, 75, 180, 100000, 80, true),
  m("NZ", "554", "New Zealand", "Oceania", 78, 72000, 33, 82, 82, 170, 25000, 80, true),
  m("FJ", "242", "Fiji", "Oceania", 42, 12000, 20, 52, 48, 30, 1000, 45, false),
  m("PG", "598", "Papua New Guinea", "Oceania", 38, 8000, 30, 30, 22, 10, 500, 28, false),
];

export const countriesByNumericCode: Record<string, CountryData> = {};
for (const c of countries) {
  countriesByNumericCode[c.numericCode] = c;
}
