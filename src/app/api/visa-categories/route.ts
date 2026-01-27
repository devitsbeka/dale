import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/visa-categories?country=USA&type=work
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('country');
    const type = searchParams.get('type');

    const where: any = {};
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    if (type) where.type = type;

    const visaCategories = await prisma.visaCategory.findMany({
      where,
      orderBy: [
        { countryCode: 'asc' },
        { type: 'asc' },
        { approvalRate: 'desc' }
      ]
    });

    return NextResponse.json({ visaCategories }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error fetching visa categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visa categories' },
      { status: 500 }
    );
  }
}
