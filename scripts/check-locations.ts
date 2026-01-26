import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';

async function checkLocations() {
  const onsiteJobs = await prisma.job.findMany({
    where: {
      locationType: 'onsite',
      isActive: true
    },
    select: { location: true },
    take: 100
  });

  console.log('Sample onsite job locations:');
  const locations = onsiteJobs.map(j => j.location).filter(l => l);
  console.log(JSON.stringify(locations.slice(0, 30), null, 2));
  console.log(`\nTotal onsite jobs: ${locations.length}`);

  await prisma.$disconnect();
}

checkLocations();
