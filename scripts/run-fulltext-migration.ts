import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('Executing full-text search migration...\n')

  // 1. Create GIN index for full-text search
  console.log('[1/4] Creating GIN index for full-text search...')
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_jobs_fulltext ON jobs USING GIN (
      to_tsvector('english',
        coalesce(title, '') || ' ' ||
        coalesce(company, '') || ' ' ||
        coalesce(description, '')
      )
    )
  `)
  console.log('✓ Success\n')

  // 2. Create trigger function
  console.log('[2/4] Creating searchVector trigger function...')
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION jobs_search_vector_trigger()
    RETURNS trigger AS $$
    BEGIN
      NEW."searchVector" := to_tsvector('english',
        coalesce(NEW.title, '') || ' ' ||
        coalesce(NEW.company, '') || ' ' ||
        coalesce(NEW.description, '')
      )::text;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `)
  console.log('✓ Success\n')

  // 3. Create trigger
  console.log('[3/4] Creating trigger to auto-update searchVector...')
  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS jobs_search_vector_update ON jobs
  `)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER jobs_search_vector_update
      BEFORE INSERT OR UPDATE ON jobs
      FOR EACH ROW
      EXECUTE FUNCTION jobs_search_vector_trigger()
  `)
  console.log('✓ Success\n')

  // 4. Backfill existing jobs
  console.log('[4/4] Backfilling searchVector for existing jobs...')
  const result = await prisma.$executeRawUnsafe(`
    UPDATE jobs
    SET "updatedAt" = "updatedAt"
    WHERE "searchVector" IS NULL
  `)
  console.log(`✓ Success - Updated ${result} jobs\n`)

  console.log('✓ Full-text search migration completed successfully!')
}

main()
  .catch((error) => {
    console.error('Error running migration:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
