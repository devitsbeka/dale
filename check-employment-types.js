const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEmploymentTypes() {
  try {
    // Get all unique employment types
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { employmentType: true }
    });
    
    const typeCounts = {};
    jobs.forEach(job => {
      const type = job.employmentType;
      if (type) {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      } else {
        typeCounts['NULL'] = (typeCounts['NULL'] || 0) + 1;
      }
    });
    
    console.log('Employment Type Counts:');
    console.log(JSON.stringify(typeCounts, null, 2));
    
    // Also check lowercase versions
    console.log('\nLowercase comparison:');
    const lowerCounts = {};
    jobs.forEach(job => {
      const type = job.employmentType?.toLowerCase();
      if (type) {
        lowerCounts[type] = (lowerCounts[type] || 0) + 1;
      }
    });
    console.log(JSON.stringify(lowerCounts, null, 2));
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkEmploymentTypes();
