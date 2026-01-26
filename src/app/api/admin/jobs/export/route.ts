/**
 * Streaming Export API - Export jobs in CSV or JSON format
 * GET /api/admin/jobs/export?format=csv|json
 * Supports filtered export and streaming for 100k+ jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    // Build where clause from filters (same as jobs list API)
    const where = buildWhereClause(searchParams);

    if (format === 'csv') {
      return await exportCSV(where);
    } else if (format === 'json') {
      return await exportJSON(where);
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use csv or json' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error exporting jobs:', error);
    return NextResponse.json(
      { error: 'Failed to export jobs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function exportCSV(where: any) {
  // Create streaming response
  const encoder = new TextEncoder();

  // CSV header
  const header =
    'ID,External ID,Source,Title,Company,Category,Location Type,Experience Level,Employment Type,Salary Min,Salary Max,Currency,Published At,Status,Active\n';

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(header));

      // Stream jobs in batches
      const BATCH_SIZE = 1000;
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const jobs = await prisma.job.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip,
          take: BATCH_SIZE,
        });

        if (jobs.length === 0) {
          hasMore = false;
          break;
        }

        // Convert batch to CSV
        const csvBatch = jobs
          .map((job) => {
            const row = [
              job.id,
              job.externalId,
              job.source,
              `"${(job.title || '').replace(/"/g, '""')}"`,
              `"${(job.company || '').replace(/"/g, '""')}"`,
              job.category || '',
              job.locationType || '',
              job.experienceLevel || '',
              job.employmentType || '',
              job.salaryMin || '',
              job.salaryMax || '',
              job.salaryCurrency || '',
              job.publishedAt?.toISOString() || '',
              job.syncStatus,
              job.isActive,
            ];
            return row.join(',');
          })
          .join('\n');

        controller.enqueue(encoder.encode(csvBatch + '\n'));

        skip += BATCH_SIZE;

        if (jobs.length < BATCH_SIZE) {
          hasMore = false;
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="jobs-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

async function exportJSON(where: any) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('{"jobs":['));

      // Stream jobs in batches
      const BATCH_SIZE = 1000;
      let skip = 0;
      let hasMore = true;
      let isFirst = true;

      while (hasMore) {
        const jobs = await prisma.job.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip,
          take: BATCH_SIZE,
        });

        if (jobs.length === 0) {
          hasMore = false;
          break;
        }

        // Convert batch to JSON
        const jsonBatch = jobs
          .map((job) => {
            const comma = isFirst ? '' : ',';
            isFirst = false;
            return comma + JSON.stringify(formatJobForExport(job));
          })
          .join('');

        controller.enqueue(encoder.encode(jsonBatch));

        skip += BATCH_SIZE;

        if (jobs.length < BATCH_SIZE) {
          hasMore = false;
        }
      }

      controller.enqueue(encoder.encode(']}'));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="jobs-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}

function buildWhereClause(searchParams: URLSearchParams): any {
  const where: any = {};

  const query = searchParams.get('query');
  const categories = searchParams.get('categories')?.split(',').filter(Boolean);
  const sources = searchParams.get('sources')?.split(',').filter(Boolean);
  const isActive = searchParams.get('isActive');

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { company: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (categories?.length) {
    where.category = { in: categories };
  }

  if (sources?.length) {
    where.source = { in: sources };
  }

  if (isActive !== null && isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  return where;
}

function formatJobForExport(job: any) {
  return {
    id: job.id,
    externalId: job.externalId,
    source: job.source,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    companyUrl: job.companyUrl,
    location: job.location,
    locationType: job.locationType,
    description: job.description,
    category: job.category,
    tags: job.tags,
    experienceLevel: job.experienceLevel,
    employmentType: job.employmentType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    salaryPeriod: job.salaryPeriod,
    applyUrl: job.applyUrl,
    publishedAt: job.publishedAt?.toISOString(),
    syncStatus: job.syncStatus,
    isActive: job.isActive,
  };
}
