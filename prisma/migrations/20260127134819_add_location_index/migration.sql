-- Add index on location field for faster state-based queries
-- This speeds up queries that filter by location patterns (e.g., "%, CA")
CREATE INDEX IF NOT EXISTS idx_job_location ON "jobs"("location");

-- Add composite index for common query patterns
-- Speeds up queries that filter by locationType + isActive + location
CREATE INDEX IF NOT EXISTS idx_job_onsite_active_location
ON "jobs"("locationType", "isActive", "location")
WHERE "locationType" = 'onsite' AND "isActive" = true;
