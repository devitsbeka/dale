import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('Executing materialized view migration...\n')

  // 1. Create materialized view for filter statistics
  console.log('[1/3] Creating materialized view for filter statistics...')
  await prisma.$executeRawUnsafe(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS job_filter_stats AS
    SELECT
      COUNT(*) FILTER (WHERE "isActive" = true) as total_active_jobs,

      -- Categories aggregation
      jsonb_object_agg(
        DISTINCT category,
        (SELECT COUNT(*)::int FROM jobs j2 WHERE j2.category = j1.category AND j2."isActive" = true)
      ) FILTER (WHERE category IS NOT NULL) as categories,

      -- Location types aggregation
      jsonb_object_agg(
        DISTINCT "locationType",
        (SELECT COUNT(*)::int FROM jobs j3 WHERE j3."locationType" = j1."locationType" AND j3."isActive" = true)
      ) as location_types,

      -- Experience levels aggregation
      jsonb_object_agg(
        DISTINCT "experienceLevel",
        (SELECT COUNT(*)::int FROM jobs j4 WHERE j4."experienceLevel" = j1."experienceLevel" AND j4."isActive" = true)
      ) FILTER (WHERE "experienceLevel" IS NOT NULL) as experience_levels,

      -- Salary statistics
      COUNT(*) FILTER (WHERE "salaryMin" IS NOT NULL OR "salaryMax" IS NOT NULL) as jobs_with_salary,
      AVG("salaryMax") FILTER (WHERE "salaryMax" IS NOT NULL) as avg_max_salary,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "salaryMax") FILTER (WHERE "salaryMax" IS NOT NULL) as median_max_salary
    FROM jobs j1
    WHERE "isActive" = true
  `)
  console.log('✓ Success\n')

  // 2. Create unique index for concurrent refresh
  console.log('[2/3] Creating unique index for concurrent refresh...')
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_job_filter_stats_refresh ON job_filter_stats ((1))
  `)
  console.log('✓ Success\n')

  // 3. Create refresh function
  console.log('[3/3] Creating refresh function...')
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_job_filter_stats()
    RETURNS void AS $$
    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY job_filter_stats;
    END;
    $$ LANGUAGE plpgsql
  `)
  console.log('✓ Success\n')

  console.log('✓ Materialized view migration completed successfully!')
}

main()
  .catch((error) => {
    console.error('Error running migration:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
