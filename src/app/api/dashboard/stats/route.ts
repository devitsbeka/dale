import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '12-months';

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

    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()));

    // INSTANT PARALLEL QUERIES
    const [
      applications,
      previousApplications,
      savedJobs,
      previousSavedJobs,
      allApplications,
      allSavedJobs,
      allJobs,
      totalJobsCount,
      profileViews,
      previousProfileViews,
    ] = await Promise.all([
      prisma.jobApplication.findMany({
        where: { userId, appliedAt: { gte: startDate } },
        select: { status: true, appliedAt: true },
      }),
      prisma.jobApplication.findMany({
        where: { userId, appliedAt: { gte: previousPeriodStart, lt: startDate } },
        select: { status: true },
      }),
      prisma.savedJob.findMany({
        where: { userId, createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.savedJob.findMany({
        where: { userId, createdAt: { gte: previousPeriodStart, lt: startDate } },
      }),
      prisma.jobApplication.findMany({
        where: { userId },
        select: { appliedAt: true },
      }),
      prisma.savedJob.findMany({
        where: { userId },
        select: { createdAt: true },
      }),
      prisma.job.findMany({
        select: { fetchedAt: true },
      }),
      // DIRECT COUNT - FASTEST WAY
      prisma.job.count(),
      prisma.resumeAnalytics.count({
        where: { resume: { userId }, eventType: 'view', timestamp: { gte: startDate } },
      }),
      prisma.resumeAnalytics.count({
        where: { resume: { userId }, eventType: 'view', timestamp: { gte: previousPeriodStart, lt: startDate } },
      }),
    ]);

    console.log('TOTAL JOBS IN DATABASE:', totalJobsCount);

    const applicationsCount = applications.length;
    const previousApplicationsCount = previousApplications.length;
    const applicationsChange = previousApplicationsCount > 0
      ? ((applicationsCount - previousApplicationsCount) / previousApplicationsCount) * 100
      : 0;

    const respondedCount = applications.filter(app =>
      ['screening', 'interviewing', 'offer', 'accepted', 'rejected'].includes(app.status)
    ).length;
    const responseRate = applicationsCount > 0 ? (respondedCount / applicationsCount) * 100 : 0;

    const previousRespondedCount = previousApplications.filter(app =>
      ['screening', 'interviewing', 'offer', 'accepted', 'rejected'].includes(app.status)
    ).length;
    const previousResponseRate = previousApplications.length > 0
      ? (previousRespondedCount / previousApplications.length) * 100
      : 0;
    const responseRateChange = previousResponseRate > 0 ? responseRate - previousResponseRate : 0;

    const interviewsCount = applications.filter(app => app.status === 'interviewing').length;
    const previousInterviewsCount = previousApplications.filter(app => app.status === 'interviewing').length;
    const interviewsChange = previousInterviewsCount > 0
      ? ((interviewsCount - previousInterviewsCount) / previousInterviewsCount) * 100
      : 0;

    const profileViewsChange = previousProfileViews > 0
      ? ((profileViews - previousProfileViews) / previousProfileViews) * 100
      : 0;

    const totalSaved = savedJobs.length;
    const previousTotalSaved = previousSavedJobs.length;
    const savedChange = previousTotalSaved > 0
      ? ((totalSaved - previousTotalSaved) / previousTotalSaved) * 100
      : 0;

    // Chart data - in-memory processing
    const dataPoints = period === '12-months' ? 12 : period === '30-days' ? 30 : period === '7-days' ? 7 : 24;
    const chartData = [];

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

      const applied = allApplications.filter(app => {
        const appDate = new Date(app.appliedAt);
        return appDate >= date && appDate < nextDate;
      }).length;

      const saved = allSavedJobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        return jobDate >= date && jobDate < nextDate;
      }).length;

      const available = allJobs.filter(job => {
        const jobDate = new Date(job.fetchedAt);
        return jobDate >= date && jobDate < nextDate;
      }).length;

      chartData.push({
        date: date.toISOString(),
        applied,
        saved,
        available,
      });
    }

    return NextResponse.json({
      stats: {
        applicationsCount,
        applicationsChange: Math.round(applicationsChange * 10) / 10,
        savedCount: totalSaved,
        savedChange: Math.round(savedChange * 10) / 10,
        availableCount: totalJobsCount,
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
