/**
 * Load Testing Script for 100k+ Scale
 * Tests performance of critical queries at scale
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const prisma = new PrismaClient();

interface TestResult {
  name: string;
  duration: number;
  success: boolean;
  error?: string;
}

async function measureQuery<T>(
  name: string,
  queryFn: () => Promise<T>
): Promise<TestResult> {
  const start = Date.now();
  try {
    await queryFn();
    const duration = Date.now() - start;
    console.log(`✓ ${name}: ${duration}ms`);
    return { name, duration, success: true };
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`✗ ${name}: Failed after ${duration}ms`);
    console.error(error);
    return {
      name,
      duration,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runTests() {
  console.log('🚀 Starting 100k+ Scale Performance Tests\n');
  console.log('=' .repeat(60));

  const results: TestResult[] = [];

  // Test 1: Full-text search performance
  console.log('\n📝 Test 1: Full-text Search (GIN Index)');
  results.push(
    await measureQuery('Full-text search: "engineer"', async () => {
      return prisma.$queryRaw`
        SELECT COUNT(*)
        FROM jobs
        WHERE to_tsvector('english',
          coalesce(title, '') || ' ' ||
          coalesce(company, '') || ' ' ||
          coalesce(description, '')
        ) @@ to_tsquery('english', 'engineer')
      `;
    })
  );

  // Test 2: Materialized view stats
  console.log('\n📊 Test 2: Filter Stats (Materialized View)');
  results.push(
    await measureQuery('Materialized view query', async () => {
      return prisma.$queryRaw`SELECT * FROM job_filter_stats LIMIT 1`;
    })
  );

  // Test 3: Complex filter combination
  console.log('\n🔍 Test 3: Complex Filter Combinations');
  results.push(
    await measureQuery('Multi-filter query', async () => {
      return prisma.job.findMany({
        where: {
          isActive: true,
          category: { in: ['engineering', 'design'] },
          locationType: 'remote',
          salaryMax: { gte: 100000 },
        },
        take: 20,
        orderBy: { publishedAt: 'desc' },
      });
    })
  );

  // Test 4: Pagination at page 500
  console.log('\n📄 Test 4: Deep Pagination (Page 500)');
  results.push(
    await measureQuery('Pagination at page 500', async () => {
      return prisma.job.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: 'desc' },
        skip: 500 * 20,
        take: 20,
      });
    })
  );

  // Test 5: Salary range query with index
  console.log('\n💰 Test 5: Salary Range Query (Composite Index)');
  results.push(
    await measureQuery('Salary range: 80k-150k', async () => {
      return prisma.job.count({
        where: {
          isActive: true,
          salaryMin: { lte: 150000 },
          salaryMax: { gte: 80000 },
          salaryCurrency: 'USD',
        },
      });
    })
  );

  // Test 6: Aggregate statistics
  console.log('\n📈 Test 6: Aggregate Statistics');
  results.push(
    await measureQuery('Category groupBy', async () => {
      return prisma.job.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: true,
      });
    })
  );

  // Test 7: Count active jobs
  console.log('\n🔢 Test 7: Count Active Jobs');
  results.push(
    await measureQuery('Count all active jobs', async () => {
      return prisma.job.count({ where: { isActive: true } });
    })
  );

  // Test 8: Recent jobs query
  console.log('\n🆕 Test 8: Recent Jobs Query');
  results.push(
    await measureQuery('Last 7 days jobs', async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return prisma.job.findMany({
        where: {
          isActive: true,
          publishedAt: { gte: cutoff },
        },
        take: 50,
        orderBy: { publishedAt: 'desc' },
      });
    })
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Performance Summary\n');

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✓ Passed: ${successCount}`);
  console.log(`✗ Failed: ${failCount}\n`);

  // Performance targets
  const targets = {
    'Full-text search: "engineer"': 100,
    'Materialized view query': 10,
    'Multi-filter query': 300,
    'Pagination at page 500': 300,
    'Salary range: 80k-150k': 300,
    'Category groupBy': 500,
    'Count all active jobs': 100,
    'Last 7 days jobs': 300,
  };

  console.log('Performance vs Targets:\n');
  results.forEach((result) => {
    if (result.success) {
      const target = targets[result.name as keyof typeof targets] || 1000;
      const status = result.duration <= target ? '✓' : '⚠️';
      const percentage = Math.round((result.duration / target) * 100);
      console.log(
        `${status} ${result.name.padEnd(35)} ${result.duration}ms / ${target}ms (${percentage}%)`
      );
    } else {
      console.log(`✗ ${result.name.padEnd(35)} FAILED: ${result.error}`);
    }
  });

  // Database stats
  console.log('\n' + '='.repeat(60));
  console.log('🗄️  Database Statistics\n');

  const stats = await prisma.job.aggregate({
    _count: true,
    where: { isActive: true },
  });

  const totalJobs = await prisma.job.count();
  const activeJobs = stats._count;
  const staleJobs = await prisma.job.count({ where: { syncStatus: 'stale' } });

  console.log(`Total Jobs: ${totalJobs.toLocaleString()}`);
  console.log(`Active Jobs: ${activeJobs.toLocaleString()}`);
  console.log(`Stale Jobs: ${staleJobs.toLocaleString()}`);

  // Index usage check
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Index Usage Check\n');

  const indexInfo = await prisma.$queryRaw`
    SELECT
      schemaname,
      tablename,
      indexname,
      pg_size_pretty(pg_relation_size(indexrelid)) as size
    FROM pg_stat_user_indexes
    WHERE tablename = 'jobs'
    ORDER BY pg_relation_size(indexrelid) DESC
  ` as Array<{
    schemaname: string;
    tablename: string;
    indexname: string;
    size: string;
  }>;

  console.log('Indexes on jobs table:');
  indexInfo.forEach((idx) => {
    console.log(`  - ${idx.indexname.padEnd(40)} ${idx.size}`);
  });

  console.log('\n✅ Load testing complete!');
}

runTests()
  .catch((error) => {
    console.error('Fatal error during testing:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
