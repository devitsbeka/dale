/**
 * Job Applications API Route
 * GET /api/jobs/applications - Get user's job applications
 * POST /api/jobs/applications - Apply to a job
 * PATCH /api/jobs/applications - Update application status
 * DELETE /api/jobs/applications - Withdraw application
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import type { ApplicationStatus, ApplicationTimelineEntry } from '@/types/job';

const DEMO_USER_ID = 'demo-user';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const status = searchParams.get('status') as ApplicationStatus | null;
    const sortBy = searchParams.get('sortBy') || 'appliedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { userId: DEMO_USER_ID };
    if (status) {
      where.status = status;
    }

    // Fetch applications with job and resume data
    const [applications, total, stats] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          job: true,
          resume: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.jobApplication.count({ where }),
      // Get stats by status
      prisma.jobApplication.groupBy({
        by: ['status'],
        where: { userId: DEMO_USER_ID },
        _count: true,
      }),
    ]);

    // Calculate response rate
    const totalApps = stats.reduce(
      (sum: number, s: { status: string; _count: number }) => sum + s._count,
      0
    );
    const responded = stats
      .filter((s: { status: string; _count: number }) =>
        ['screening', 'interviewing', 'offer', 'rejected', 'accepted'].includes(s.status)
      )
      .reduce(
        (sum: number, s: { status: string; _count: number }) => sum + s._count,
        0
      );
    const responseRate = totalApps > 0 ? (responded / totalApps) * 100 : 0;

    return NextResponse.json({
      applications: applications.map((app: typeof applications[number]) => ({
        ...app,
        timeline: app.timeline ? JSON.parse(app.timeline) : [],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalApps,
        byStatus: Object.fromEntries(stats.map((s: { status: string; _count: number }) => [s.status, s._count])),
        responseRate: Math.round(responseRate),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    // Return empty data if database is not available
    return NextResponse.json({
      applications: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      stats: {
        total: 0,
        byStatus: {},
        responseRate: 0,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobId,
      jobData,
      resumeId,
      coverLetter,
      appliedVia = 'direct',
      notes,
    } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existing = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: DEMO_USER_ID,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Ensure the job exists in database
    if (jobData) {
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
    }

    // Initial timeline entry
    const timeline: ApplicationTimelineEntry[] = [
      {
        status: 'applied',
        date: new Date().toISOString(),
        notes: notes || 'Application submitted',
      },
    ];

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        userId: DEMO_USER_ID,
        jobId,
        resumeId: resumeId || null,
        status: 'applied',
        coverLetter,
        appliedVia,
        notes,
        timeline: JSON.stringify(timeline),
      },
      include: {
        job: true,
        resume: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Remove from saved jobs if exists
    await prisma.savedJob.deleteMany({
      where: {
        userId: DEMO_USER_ID,
        jobId,
      },
    });

    return NextResponse.json({
      application: {
        ...application,
        timeline,
      },
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicationId,
      status,
      interviewRounds,
      nextStepDate,
      nextStepNotes,
      offeredSalary,
      offeredCurrency,
      offerDeadline,
      notes,
    } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get existing application
    const existing = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update timeline if status changed
    let newTimeline = existing.timeline;
    if (status && status !== existing.status) {
      const currentTimeline: ApplicationTimelineEntry[] = existing.timeline
        ? JSON.parse(existing.timeline)
        : [];
      currentTimeline.push({
        status,
        date: new Date().toISOString(),
        notes: nextStepNotes || `Status updated to ${status}`,
      });
      newTimeline = JSON.stringify(currentTimeline);
    }

    // Update application
    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: status || undefined,
        interviewRounds: interviewRounds ?? undefined,
        nextStepDate: nextStepDate ? new Date(nextStepDate) : undefined,
        nextStepNotes: nextStepNotes ?? undefined,
        offeredSalary: offeredSalary ?? undefined,
        offeredCurrency: offeredCurrency ?? undefined,
        offerDeadline: offerDeadline ? new Date(offerDeadline) : undefined,
        notes: notes ?? undefined,
        timeline: newTimeline,
      },
      include: {
        job: true,
        resume: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      application: {
        ...updated,
        timeline: updated.timeline ? JSON.parse(updated.timeline) : [],
      },
      message: 'Application updated successfully',
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get the application first to update timeline
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Mark as withdrawn instead of deleting
    const timeline: ApplicationTimelineEntry[] = application.timeline
      ? JSON.parse(application.timeline)
      : [];
    timeline.push({
      status: 'withdrawn',
      date: new Date().toISOString(),
      notes: 'Application withdrawn',
    });

    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: 'withdrawn',
        timeline: JSON.stringify(timeline),
      },
    });

    return NextResponse.json({
      application: updated,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    );
  }
}
