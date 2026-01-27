import { PrismaClient } from '@prisma/client';
import { allVisaCategoriesData, visaCategoriesCount } from './data/visa-categories-all';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting comprehensive global visa categories seed...');
  console.log(`📊 Total visa categories to process: ${allVisaCategoriesData.length}`);
  console.log('');

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const visaData of allVisaCategoriesData) {
    try {
      const existing = await prisma.visaCategory.findUnique({
        where: {
          countryCode_shortName: {
            countryCode: visaData.countryCode,
            shortName: visaData.shortName
          }
        }
      });

      if (existing) {
        await prisma.visaCategory.update({
          where: { id: existing.id },
          data: visaData
        });
        updated++;
        console.log(`  ✓ Updated ${visaData.countryCode} - ${visaData.shortName}`);
      } else {
        await prisma.visaCategory.create({
          data: visaData
        });
        created++;
        console.log(`  + Created ${visaData.countryCode} - ${visaData.shortName}`);
      }
    } catch (error) {
      console.error(`  ✗ Error with ${visaData.countryCode} - ${visaData.shortName}:`, error);
      errors++;
    }
  }

  console.log('\n✅ Seed complete:');
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${allVisaCategoriesData.length} visa categories processed`);
  console.log('');
  console.log('📊 Regional Coverage:');
  console.log(`   North America: ${visaCategoriesCount.northAmerica} visa types`);
  console.log(`   Europe: ${visaCategoriesCount.europe} visa types`);
  console.log(`   Asia-Pacific: ${visaCategoriesCount.asiaPacific} visa types`);
  console.log(`   Middle East: ${visaCategoriesCount.middleEast} visa types`);
  console.log(`   Latin America: ${visaCategoriesCount.latinAmerica} visa types`);
  console.log(`   Africa: ${visaCategoriesCount.africa} visa types`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
