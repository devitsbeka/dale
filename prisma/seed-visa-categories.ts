import { PrismaClient } from '@prisma/client';
import { visaCategoriesData } from './data/visa-categories';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting visa categories seed...');

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const visaData of visaCategoriesData) {
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
  console.log(`   Total: ${visaCategoriesData.length} visa categories processed`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
