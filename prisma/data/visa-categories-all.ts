// COMPREHENSIVE GLOBAL VISA DATABASE
// Merges all regional visa data into single export
// Total Coverage: 105+ countries, 119 visa types

import { visaCategoriesData } from './visa-categories';
import { visaCategoriesExpandedData } from './visa-categories-expanded';
import { visaCategoriesAsiaPacific } from './visa-categories-asia-pacific';
import { visaCategoriesGlobal } from './visa-categories-global';
import { visaCategoriesTier2 } from './visa-categories-tier2';
import { visaCategoriesTier3 } from './visa-categories-tier3';
import { visaCategoriesTier4 } from './visa-categories-tier4';

// Merge all visa category data from all regions
export const allVisaCategoriesData = [
  ...visaCategoriesData,                 // USA, Canada, UK, Germany (6 visas)
  ...visaCategoriesExpandedData,         // Europe expanded (12 visas)
  ...visaCategoriesAsiaPacific,          // Asia-Pacific region (14 visas)
  ...visaCategoriesGlobal,               // Latin America, Africa, Middle East, Eastern Europe (12 visas)
  ...visaCategoriesTier2,                // Tier 2 emerging markets (20 visas)
  ...visaCategoriesTier3,                // Tier 3 global coverage (25 visas)
  ...visaCategoriesTier4,                // Tier 4 additional global coverage (30 visas)
];

// Export count for verification
export const visaCategoriesCount = {
  northAmerica: [...visaCategoriesData].filter(v => ['USA', 'CAN', 'MEX'].includes(v.countryCode)).length,
  europe: [
    ...visaCategoriesData,
    ...visaCategoriesExpandedData,
    ...visaCategoriesGlobal,
    ...visaCategoriesTier2,
    ...visaCategoriesTier3,
    ...visaCategoriesTier4
  ].filter(v => ['GBR', 'DEU', 'FRA', 'NLD', 'IRL', 'ESP', 'PRT', 'ITA', 'CHE', 'SWE', 'NOR', 'DNK', 'POL', 'CZE', 'EST', 'ROU', 'BGR', 'HUN', 'GRC', 'HRV', 'CYP', 'MKD', 'ALB', 'SRB', 'BIH'].includes(v.countryCode)).length,
  asiaPacific: [
    ...visaCategoriesAsiaPacific,
    ...visaCategoriesTier2,
    ...visaCategoriesTier3,
    ...visaCategoriesTier4
  ].filter(v => ['SGP', 'JPN', 'AUS', 'NZL', 'KOR', 'HKG', 'TWN', 'MYS', 'THA', 'VNM', 'PHL', 'IDN', 'IND', 'CHN', 'BGD', 'LKA', 'KHM', 'FJI', 'KAZ', 'UZB', 'NPL', 'MMR', 'MNG', 'PNG', 'VUT'].includes(v.countryCode)).length,
  middleEast: [
    ...visaCategoriesAsiaPacific,
    ...visaCategoriesGlobal,
    ...visaCategoriesTier2,
    ...visaCategoriesTier3,
    ...visaCategoriesTier4
  ].filter(v => ['ARE', 'ISR', 'QAT', 'TUR', 'SAU', 'JOR', 'OMN', 'BHR', 'KWT', 'LBN', 'YEM', 'IRQ'].includes(v.countryCode)).length,
  latinAmerica: [
    ...visaCategoriesGlobal,
    ...visaCategoriesTier2,
    ...visaCategoriesTier3,
    ...visaCategoriesTier4
  ].filter(v => ['BRA', 'CHL', 'ARG', 'CRI', 'COL', 'PER', 'URY', 'PAN', 'ECU', 'JAM', 'BRB', 'CYM', 'BOL', 'PRY', 'NIC', 'GTM', 'HND', 'TTO', 'BHS', 'GRD'].includes(v.countryCode)).length,
  africa: [
    ...visaCategoriesGlobal,
    ...visaCategoriesTier2,
    ...visaCategoriesTier3,
    ...visaCategoriesTier4
  ].filter(v => ['ZAF', 'KEN', 'MAR', 'MUS', 'GHA', 'EGY', 'NGA', 'BWA', 'TZA', 'SEN', 'TUN', 'UGA', 'ETH', 'ZWE', 'RWA', 'MOZ', 'NAM'].includes(v.countryCode)).length,
  total: allVisaCategoriesData.length
};

// Calculate unique countries
const uniqueCountries = new Set(allVisaCategoriesData.map(v => v.countryCode));

console.log('✨ Visa Categories Database Statistics:');
console.log(`📍 North America: ${visaCategoriesCount.northAmerica} visa types`);
console.log(`🇪🇺 Europe: ${visaCategoriesCount.europe} visa types`);
console.log(`🌏 Asia-Pacific: ${visaCategoriesCount.asiaPacific} visa types`);
console.log(`🕌 Middle East: ${visaCategoriesCount.middleEast} visa types`);
console.log(`🌎 Latin America: ${visaCategoriesCount.latinAmerica} visa types`);
console.log(`🌍 Africa: ${visaCategoriesCount.africa} visa types`);
console.log(`\n🎯 TOTAL: ${visaCategoriesCount.total} visa types across ${uniqueCountries.size} countries\n`);
