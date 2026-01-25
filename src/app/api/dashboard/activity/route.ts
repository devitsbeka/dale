import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth/get-user-from-request';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);

    // Fetch recent job applications with job details
    const recentApplications = await prisma.jobApplication.findMany({
      where: {
        userId,
      },
      include: {
        job: {
          select: {
            title: true,
            company: true,
            companyLogo: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
      take: 10,
    });

    // Format activity feed
    const activity = recentApplications.map(app => {
      const timestamp = getRelativeTime(app.appliedAt);

      let action = 'Application submitted';
      if (app.status === 'interviewing') {
        action = 'Interview scheduled';
      } else if (app.status === 'screening') {
        action = 'Application viewed';
      } else if (app.status === 'offer') {
        action = 'Offer received';
      } else if (app.status === 'accepted') {
        action = 'Offer accepted';
      } else if (app.status === 'rejected') {
        action = 'Application rejected';
      }

      return {
        id: app.id,
        user: {
          name: app.job.company,
          avatarUrl: app.job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.job.company)}&background=random`,
        },
        action,
        timestamp,
        href: `/jobs/applications/${app.id}`,
      };
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Dashboard activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months}mo`;
  }
}
