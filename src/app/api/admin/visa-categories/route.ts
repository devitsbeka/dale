import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/visa-categories - Create visa category
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const visaCategory = await prisma.visaCategory.create({
      data: {
        ...data,
        lastUpdated: new Date()
      }
    });

    return NextResponse.json({ visaCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating visa category:', error);
    return NextResponse.json(
      { error: 'Failed to create visa category' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/visa-categories/:id - Update visa category
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const visaCategory = await prisma.visaCategory.update({
      where: { id },
      data: {
        ...data,
        lastUpdated: new Date()
      }
    });

    return NextResponse.json({ visaCategory });
  } catch (error) {
    console.error('Error updating visa category:', error);
    return NextResponse.json(
      { error: 'Failed to update visa category' },
      { status: 500 }
    );
  }
}
