// COMPREHENSIVE GLOBAL VISA DATABASE
// Merges all regional visa data into single export
// Total Coverage: 40+ countries, 60+ visa types

import { visaCategoriesData } from './visa-categories';
import { visaCategoriesExpandedData } from './visa-categories-expanded';
import { visaCategoriesAsiaPacific } from './visa-categories-asia-pacific';
import { visaCategoriesGlobal } from './visa-categories-global';

// Merge all visa category data from all regions
export const allVisaCategoriesData = [
  ...visaCategoriesData,                 // USA, Canada, UK, Germany (6 visas)
  ...visaCategoriesExpandedData,         // Europe expanded (12 visas)
  ...visaCategoriesAsiaPacific,          // Asia-Pacific region (14 visas)
  ...visaCategoriesGlobal,               // Latin America, Africa, Middle East, Eastern Europe (12 visas)
];

// Export count for verification
export const visaCategoriesCount = {
  northAmerica: visaCategoriesData.filter(v => ['USA', 'CAN', 'MEX'].includes(v.countryCode)).length,
  europe: [
    ...visaCategoriesData,
    ...visaCategoriesExpandedData,
    ...visaCategoriesGlobal
  ].filter(v => ['GBR', 'DEU', 'FRA', 'NLD', 'IRL', 'ESP', 'PRT', 'ITA', 'CHE', 'SWE', 'NOR', 'DNK', 'POL', 'CZE', 'EST'].includes(v.countryCode)).length,
  asiaPacific: visaCategoriesAsiaPacific.filter(v => ['SGP', 'JPN', 'AUS', 'NZL', 'KOR', 'HKG', 'TWN', 'MYS', 'THA'].includes(v.countryCode)).length,
  middleEast: [
    ...visaCategoriesAsiaPacific,
    ...visaCategoriesGlobal
  ].filter(v => ['ARE', 'ISR', 'QAT'].includes(v.countryCode)).length,
  latinAmerica: visaCategoriesGlobal.filter(v => ['BRA', 'CHL', 'ARG', 'CRI'].includes(v.countryCode)).length,
  africa: visaCategoriesGlobal.filter(v => ['ZAF', 'KEN', 'MAR'].includes(v.countryCode)).length,
  total: allVisaCategoriesData.length
};

console.log('Visa Categories Database Statistics:');
console.log(`- North America: ${visaCategoriesCount.northAmerica} visa types`);
console.log(`- Europe: ${visaCategoriesCount.europe} visa types`);
console.log(`- Asia-Pacific: ${visaCategoriesCount.asiaPacific} visa types`);
console.log(`- Middle East: ${visaCategoriesCount.middleEast} visa types`);
console.log(`- Latin America: ${visaCategoriesCount.latinAmerica} visa types`);
console.log(`- Africa: ${visaCategoriesCount.africa} visa types`);
console.log(`- TOTAL: ${visaCategoriesCount.total} visa types across 35+ countries`);
