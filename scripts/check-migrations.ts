/**
 * Check if migrations have already been applied
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkMigrations() {
  try {
    console.log('🔍 Checking migration status...\n');

    // Check if GIN index exists
    console.log('1. Checking full-text search GIN index...');
    const ginIndex = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'jobs' AND indexname = 'idx_jobs_fulltext'
    ` as Array<any>;

    if (ginIndex.length > 0) {
      console.log('✓ GIN index exists');
    } else {
      console.log('✗ GIN index NOT found - migration needed');
    }

    // Check if trigger exists
    console.log('\n2. Checking searchVector trigger...');
    const trigger = await prisma.$queryRaw`
      SELECT tgname
      FROM pg_trigger
      WHERE tgname = 'jobs_search_vector_update'
    ` as Array<any>;

    if (trigger.length > 0) {
      console.log('✓ Trigger exists');
    } else {
      console.log('✗ Trigger NOT found - migration needed');
    }

    // Check if materialized view exists
    console.log('\n3. Checking materialized view...');
    const matView = await prisma.$queryRaw`
      SELECT matviewname
      FROM pg_matviews
      WHERE matviewname = 'job_filter_stats'
    ` as Array<any>;

    if (matView.length > 0) {
      console.log('✓ Materialized view exists');
    } else {
      console.log('✗ Materialized view NOT found - migration needed');
    }

    // Check if refresh function exists
    console.log('\n4. Checking refresh function...');
    const refreshFunc = await prisma.$queryRaw`
      SELECT proname
      FROM pg_proc
      WHERE proname = 'refresh_job_filter_stats'
    ` as Array<any>;

    if (refreshFunc.length > 0) {
      console.log('✓ Refresh function exists');
    } else {
      console.log('✗ Refresh function NOT found - migration needed');
    }

    // Check database size and job count
    console.log('\n📊 Database Statistics:');
    const jobCount = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { isActive: true } });

    console.log(`Total jobs: ${jobCount.toLocaleString()}`);
    console.log(`Active jobs: ${activeJobs.toLocaleString()}`);

    // Check if searchVector is populated
    const populatedCount = await prisma.job.count({
      where: { searchVector: { not: null } },
    });
    console.log(`Jobs with searchVector: ${populatedCount.toLocaleString()}`);

    console.log('\n✅ Migration check complete!');
  } catch (error) {
    console.error('Error checking migrations:', error);
    throw error;
  }
}

checkMigrations()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
