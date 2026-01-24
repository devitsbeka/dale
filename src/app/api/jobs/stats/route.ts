/**
 * Jobs Stats API Route
 * GET /api/jobs/stats - Get job statistics and application analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const DEMO_USER_ID = 'demo-user';

export async function GET(request: NextRequest) {
  try {
    // Get application stats
    const [applicationsByStatus, weeklyApplications, savedJobsCount, recentApplications] =
      await Promise.all([
        // Applications by status
        prisma.jobApplication.groupBy({
          by: ['status'],
          where: { userId: DEMO_USER_ID },
          _count: true,
        }),
        // Weekly applications (last 12 weeks)
        prisma.$queryRaw`
          SELECT
            DATE_TRUNC('week', "appliedAt") as week,
            COUNT(*) as count
          FROM job_applications
          WHERE "userId" = ${DEMO_USER_ID}
            AND "appliedAt" >= NOW() - INTERVAL '12 weeks'
          GROUP BY DATE_TRUNC('week', "appliedAt")
          ORDER BY week DESC
        ` as Promise<{ week: Date; count: bigint }[]>,
        // Saved jobs count
        prisma.savedJob.count({
          where: { userId: DEMO_USER_ID },
        }),
        // Recent applications
        prisma.jobApplication.findMany({
          where: { userId: DEMO_USER_ID },
          include: {
            job: {
              select: {
                title: true,
                company: true,
                companyLogo: true,
              },
            },
          },
          orderBy: { appliedAt: 'desc' },
          take: 5,
        }),
      ]);

    // Define type for status group
    type StatusGroup = { status: string; _count: number };

    // Calculate stats
    const totalApplications = applicationsByStatus.reduce(
      (sum: number, s: StatusGroup) => sum + s._count,
      0
    );
    const responded = applicationsByStatus
      .filter((s: StatusGroup) =>
        ['screening', 'interviewing', 'offer', 'rejected', 'accepted'].includes(
          s.status
        )
      )
      .reduce((sum: number, s: StatusGroup) => sum + s._count, 0);
    const responseRate = totalApplications > 0 ? (responded / totalApplications) * 100 : 0;

    // Interviews
    const interviewing = applicationsByStatus.find(
      (s: StatusGroup) => s.status === 'interviewing'
    )?._count || 0;
    const offers = applicationsByStatus.find((s: StatusGroup) => s.status === 'offer')?._count || 0;
    const accepted = applicationsByStatus.find((s: StatusGroup) => s.status === 'accepted')?._count || 0;

    return NextResponse.json({
      overview: {
        totalApplications,
        savedJobs: savedJobsCount,
        responseRate: Math.round(responseRate),
        activeInterviews: interviewing,
        pendingOffers: offers,
        acceptedOffers: accepted,
      },
      byStatus: Object.fromEntries(
        applicationsByStatus.map((s: StatusGroup) => [s.status, s._count])
      ),
      weeklyApplications: weeklyApplications.map((w: { week: Date; count: bigint }) => ({
        week: w.week.toISOString(),
        count: Number(w.count),
      })),
      recentActivity: recentApplications.map((app: typeof recentApplications[number]) => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        job: app.job,
      })),
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);

    // Return default stats if database is not available
    return NextResponse.json({
      overview: {
        totalApplications: 0,
        savedJobs: 0,
        responseRate: 0,
        activeInterviews: 0,
        pendingOffers: 0,
        acceptedOffers: 0,
      },
      byStatus: {},
      weeklyApplications: [],
      recentActivity: [],
    });
  }
}
