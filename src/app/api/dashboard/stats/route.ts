import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '12-months';

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '24-hours':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7-days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30-days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '12-months':
      default:
        startDate.setMonth(now.getMonth() - 12);
        break;
    }

    // Fetch job applications count
    const applicationsCount = await prisma.jobApplication.count({
      where: {
        userId,
        appliedAt: {
          gte: startDate,
        },
      },
    });

    // Fetch previous period count for comparison
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()));

    const previousApplicationsCount = await prisma.jobApplication.count({
      where: {
        userId,
        appliedAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    // Calculate percentage change
    const applicationsChange = previousApplicationsCount > 0
      ? ((applicationsCount - previousApplicationsCount) / previousApplicationsCount) * 100
      : 0;

    // Fetch applications by status (for response rate)
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId,
        appliedAt: {
          gte: startDate,
        },
      },
      select: {
        status: true,
      },
    });

    const respondedCount = applications.filter(app =>
      ['screening', 'interviewing', 'offer', 'accepted', 'rejected'].includes(app.status)
    ).length;

    const responseRate = applicationsCount > 0
      ? (respondedCount / applicationsCount) * 100
      : 0;

    // Calculate previous period response rate
    const previousApplications = await prisma.jobApplication.findMany({
      where: {
        userId,
        appliedAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
      select: {
        status: true,
      },
    });

    const previousRespondedCount = previousApplications.filter(app =>
      ['screening', 'interviewing', 'offer', 'accepted', 'rejected'].includes(app.status)
    ).length;

    const previousResponseRate = previousApplications.length > 0
      ? (previousRespondedCount / previousApplications.length) * 100
      : 0;

    const responseRateChange = previousResponseRate > 0
      ? responseRate - previousResponseRate
      : 0;

    // Count interviews
    const interviewsCount = applications.filter(app =>
      app.status === 'interviewing'
    ).length;

    const previousInterviewsCount = previousApplications.filter(app =>
      app.status === 'interviewing'
    ).length;

    const interviewsChange = previousInterviewsCount > 0
      ? ((interviewsCount - previousInterviewsCount) / previousInterviewsCount) * 100
      : 0;

    // Count profile views (from resume analytics)
    const profileViews = await prisma.resumeAnalytics.count({
      where: {
        resume: {
          userId,
        },
        eventType: 'view',
        timestamp: {
          gte: startDate,
        },
      },
    });

    const previousProfileViews = await prisma.resumeAnalytics.count({
      where: {
        resume: {
          userId,
        },
        eventType: 'view',
        timestamp: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const profileViewsChange = previousProfileViews > 0
      ? ((profileViews - previousProfileViews) / previousProfileViews) * 100
      : 0;

    // Get user's skills/interests to match jobs
    const userResumes = await prisma.resume.findMany({
      where: { userId },
      include: {
        skills: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      take: 1,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Extract user's technical skills for matching
    const userSkills = userResumes[0]?.skills
      .filter(s => s.category === 'technical')
      .map(s => s.name.toLowerCase()) || [];

    // Get saved jobs categories/tags
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            tags: true,
            category: true,
          },
        },
      },
    });

    const userInterests = new Set<string>();
    savedJobs.forEach(saved => {
      if (saved.job.category) userInterests.add(saved.job.category.toLowerCase());
      saved.job.tags.forEach(tag => userInterests.add(tag.toLowerCase()));
    });

    // Combine skills and interests for job matching
    const matchKeywords = [...userSkills, ...Array.from(userInterests)];

    // Generate chart data (3 metrics over time)
    const chartData = [];
    const dataPoints = period === '12-months' ? 12 : period === '30-days' ? 30 : period === '7-days' ? 7 : 24;

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      if (period === '12-months') {
        date.setMonth(now.getMonth() - i);
        date.setDate(1);
      } else if (period === '30-days') {
        date.setDate(now.getDate() - i);
      } else if (period === '7-days') {
        date.setDate(now.getDate() - i);
      } else {
        date.setHours(now.getHours() - i);
      }

      const nextDate = new Date(date);
      if (period === '12-months') {
        nextDate.setMonth(date.getMonth() + 1);
      } else if (period === '24-hours') {
        nextDate.setHours(date.getHours() + 1);
      } else {
        nextDate.setDate(date.getDate() + 1);
      }

      // Count applications in this period
      const applicationsCount = await prisma.jobApplication.count({
        where: {
          userId,
          appliedAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      // Count saved jobs in this period
      const savedCount = await prisma.savedJob.count({
        where: {
          userId,
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      // Count available matching jobs in this period
      let matchingJobsCount = 0;
      if (matchKeywords.length > 0) {
        matchingJobsCount = await prisma.job.count({
          where: {
            fetchedAt: {
              gte: date,
              lt: nextDate,
            },
            OR: [
              {
                tags: {
                  hasSome: matchKeywords,
                },
              },
              {
                category: {
                  in: Array.from(userInterests),
                  mode: 'insensitive',
                },
              },
            ],
          },
        });
      } else {
        // If no user preferences, count all jobs
        matchingJobsCount = await prisma.job.count({
          where: {
            fetchedAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });
      }

      chartData.push({
        date: date.toISOString(),
        applied: applicationsCount,
        saved: savedCount,
        available: matchingJobsCount,
      });
    }

    // Total counts for the current period
    const totalSaved = await prisma.savedJob.count({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
    });

    const previousTotalSaved = await prisma.savedJob.count({
      where: {
        userId,
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const savedChange = previousTotalSaved > 0
      ? ((totalSaved - previousTotalSaved) / previousTotalSaved) * 100
      : 0;

    // Current total jobs available in the system (all jobs, not filtered)
    const currentAllJobs = await prisma.job.count();

    return NextResponse.json({
      stats: {
        applicationsCount,
        applicationsChange: Math.round(applicationsChange * 10) / 10,
        savedCount: totalSaved,
        savedChange: Math.round(savedChange * 10) / 10,
        availableCount: currentAllJobs,
        responseRate: Math.round(responseRate * 10) / 10,
        responseRateChange: Math.round(responseRateChange * 10) / 10,
        interviewsCount,
        interviewsChange: Math.round(interviewsChange * 10) / 10,
        profileViews,
        profileViewsChange: Math.round(profileViewsChange * 10) / 10,
      },
      chartData,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
