/**
 * Admin Jobs API - Advanced filtering and management
 * GET /api/admin/jobs - List jobs with advanced filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '25', 10), 100);
    const skip = (page - 1) * pageSize;

    // Filters
    const query = searchParams.get('query');
    const categories = searchParams.get('categories')?.split(',').filter(Boolean);
    const sources = searchParams.get('sources')?.split(',').filter(Boolean);
    const locationTypes = searchParams.get('locationTypes')?.split(',').filter(Boolean);
    const experienceLevels = searchParams.get('experienceLevels')?.split(',').filter(Boolean);
    const isActive = searchParams.get('isActive');
    const syncStatus = searchParams.get('syncStatus');

    // Date range
    const publishedAfter = searchParams.get('publishedAfter');
    const publishedBefore = searchParams.get('publishedBefore');

    // Salary range
    const salaryMin = searchParams.get('salaryMin');
    const salaryMax = searchParams.get('salaryMax');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Build where clause
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categories?.length) {
      where.category = { in: categories };
    }

    if (sources?.length) {
      where.source = { in: sources };
    }

    if (locationTypes?.length) {
      where.locationType = { in: locationTypes };
    }

    if (experienceLevels?.length) {
      where.experienceLevel = { in: experienceLevels };
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (syncStatus) {
      where.syncStatus = syncStatus;
    }

    if (publishedAfter || publishedBefore) {
      where.publishedAt = {};
      if (publishedAfter) {
        where.publishedAt.gte = new Date(publishedAfter);
      }
      if (publishedBefore) {
        where.publishedAt.lte = new Date(publishedBefore);
      }
    }

    if (salaryMin || salaryMax) {
      where.AND = where.AND || [];
      if (salaryMin) {
        where.AND.push({ salaryMax: { gte: parseInt(salaryMin, 10) } });
      }
      if (salaryMax) {
        where.AND.push({ salaryMin: { lte: parseInt(salaryMax, 10) } });
      }
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              savedBy: true,
              applications: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs: jobs.map(formatJob),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function formatJob(job: any) {
  return {
    id: job.id,
    externalId: job.externalId,
    source: job.source,
    title: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    category: job.category,
    locationType: job.locationType,
    experienceLevel: job.experienceLevel,
    employmentType: job.employmentType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    publishedAt: job.publishedAt?.toISOString(),
    lastSyncedAt: job.lastSyncedAt?.toISOString(),
    syncStatus: job.syncStatus,
    isActive: job.isActive,
    savedCount: job._count?.savedBy || 0,
    applicationsCount: job._count?.applications || 0,
  };
}
