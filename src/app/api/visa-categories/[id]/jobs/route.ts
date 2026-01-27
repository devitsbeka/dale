import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/visa-categories/:id/jobs?cursor=...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = 20;

    const where: any = {
      visaEligibility: {
        some: { visaCategoryId: id }
      },
      isActive: true
    };

    const jobs = await prisma.job.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        companyLogo: true,
        location: true,
        locationType: true,
        salaryMin: true,
        salaryMax: true,
        category: true,
        experienceLevel: true,
        publishedAt: true,
        visaEligibility: {
          where: { visaCategoryId: id },
          select: {
            sponsorConfirmed: true,
            notes: true
          }
        }
      }
    });

    const hasMore = jobs.length > limit;
    const results = hasMore ? jobs.slice(0, -1) : jobs;
    const nextCursor = hasMore ? results[results.length - 1].id : null;

    return NextResponse.json({
      jobs: results,
      nextCursor,
      hasMore
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching visa-eligible jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
