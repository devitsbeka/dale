/**
 * Saved Jobs API Route
 * GET /api/jobs/saved - Get user's saved jobs
 * POST /api/jobs/saved - Save a job
 * DELETE /api/jobs/saved - Remove a saved job
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getUserIdFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getUserIdFromRequest(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Fetch saved jobs with job data
    const [savedJobs, total] = await Promise.all([
      prisma.savedJob.findMany({
        where: { userId },
        include: {
          job: true,
        },
        orderBy: {
          [sortBy === 'priority' ? 'priority' : 'createdAt']: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.savedJob.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      savedJobs: savedJobs.map((saved: typeof savedJobs[number]) => ({
        id: saved.id,
        jobId: saved.jobId,
        notes: saved.notes,
        priority: saved.priority,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        job: saved.job,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    // Return empty data if database is not available
    return NextResponse.json({
      savedJobs: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getUserIdFromRequest(request);

    const body = await request.json();
    const { jobId, jobData, notes, priority = 0 } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // First, ensure the job exists in our database
    // If jobData is provided, upsert the job
    if (jobData) {
      try {
        await prisma.job.upsert({
        where: {
          source_externalId: {
            source: jobData.source,
            externalId: jobData.externalId,
          },
        },
        update: {
          title: jobData.title,
          company: jobData.company,
          companyLogo: jobData.companyLogo,
          companyUrl: jobData.companyUrl,
          location: jobData.location,
          locationType: jobData.locationType,
          description: jobData.description,
          descriptionHtml: jobData.descriptionHtml,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          category: jobData.category,
          tags: jobData.tags || [],
          experienceLevel: jobData.experienceLevel,
          employmentType: jobData.employmentType,
          salaryMin: jobData.salaryMin,
          salaryMax: jobData.salaryMax,
          salaryCurrency: jobData.salaryCurrency,
          salaryPeriod: jobData.salaryPeriod,
          applyUrl: jobData.applyUrl,
          applicationEmail: jobData.applicationEmail,
          publishedAt: jobData.publishedAt ? new Date(jobData.publishedAt) : null,
          expiresAt: jobData.expiresAt ? new Date(jobData.expiresAt) : null,
          updatedAt: new Date(),
        },
        create: {
          id: jobData.id,
          externalId: jobData.externalId,
          source: jobData.source,
          title: jobData.title,
          company: jobData.company,
          companyLogo: jobData.companyLogo,
          companyUrl: jobData.companyUrl,
          location: jobData.location,
          locationType: jobData.locationType,
          description: jobData.description,
          descriptionHtml: jobData.descriptionHtml,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          category: jobData.category,
          tags: jobData.tags || [],
          experienceLevel: jobData.experienceLevel,
          employmentType: jobData.employmentType,
          salaryMin: jobData.salaryMin,
          salaryMax: jobData.salaryMax,
          salaryCurrency: jobData.salaryCurrency,
          salaryPeriod: jobData.salaryPeriod,
          applyUrl: jobData.applyUrl,
          applicationEmail: jobData.applicationEmail,
          publishedAt: jobData.publishedAt ? new Date(jobData.publishedAt) : null,
          expiresAt: jobData.expiresAt ? new Date(jobData.expiresAt) : null,
        },
      });
      } catch (upsertError) {
        console.error('Error upserting job:', upsertError);
        throw new Error(`Failed to upsert job: ${upsertError instanceof Error ? upsertError.message : 'Unknown error'}`);
      }
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existing) {
      // Update existing saved job
      const updated = await prisma.savedJob.update({
        where: { id: existing.id },
        data: {
          notes,
          priority,
        },
        include: { job: true },
      });

      return NextResponse.json({
        savedJob: updated,
        message: 'Job updated',
      });
    }

    // Create new saved job
    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
        notes,
        priority,
      },
      include: { job: true },
    });

    return NextResponse.json({
      savedJob,
      message: 'Job saved successfully',
    });
  } catch (error) {
    console.error('Error saving job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save job';
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getUserIdFromRequest(request);

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Delete saved job
    await prisma.savedJob.deleteMany({
      where: {
        userId,
        jobId,
      },
    });

    return NextResponse.json({
      message: 'Job unsaved successfully',
    });
  } catch (error) {
    console.error('Error unsaving job:', error);
    return NextResponse.json(
      { error: 'Failed to unsave job' },
      { status: 500 }
    );
  }
}
