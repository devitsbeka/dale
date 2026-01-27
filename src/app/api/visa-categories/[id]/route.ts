import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/visa-categories/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visaCategory = await prisma.visaCategory.findUnique({
      where: { id },
      include: {
        jobsEligible: {
          include: {
            job: {
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
                publishedAt: true
              }
            }
          },
          take: 20,
          orderBy: { job: { publishedAt: 'desc' } }
        }
      }
    });

    if (!visaCategory) {
      return NextResponse.json(
        { error: 'Visa category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ visaCategory }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching visa category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visa category' },
      { status: 500 }
    );
  }
}
