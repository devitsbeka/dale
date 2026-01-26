/**
 * Wake up the Neon database from suspension
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const prisma = new PrismaClient();

async function wakeDatabase() {
  console.log('🌅 Waking up database...\n');

  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries}...`);

      const count = await prisma.job.count();
      console.log(`✅ Database is awake! Found ${count.toLocaleString()} jobs\n`);

      // Get active jobs count
      const activeCount = await prisma.job.count({ where: { isActive: true } });
      console.log(`Active jobs: ${activeCount.toLocaleString()}`);

      // Test if searchVector exists
      const withSearch = await prisma.job.count({
        where: { searchVector: { not: null } }
      });
      console.log(`Jobs with searchVector: ${withSearch.toLocaleString()}`);

      return;
    } catch (error: any) {
      attempt++;
      if (error.code === 'P1001') {
        console.log('Database still sleeping, retrying in 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw error;
      }
    }
  }

  console.error('❌ Failed to wake database after', maxRetries, 'attempts');
  process.exit(1);
}

wakeDatabase()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
