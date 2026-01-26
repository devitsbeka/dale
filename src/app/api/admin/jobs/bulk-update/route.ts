/**
 * Bulk Update API - Update multiple jobs at once
 * POST /api/admin/jobs/bulk-update
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { jobIds, updates } = await request.json();

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid job IDs' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid updates object' },
        { status: 400 }
      );
    }

    // Allowed fields for bulk update
    const allowedFields = ['category', 'isActive', 'syncStatus', 'experienceLevel', 'employmentType'];
    const sanitizedUpdates: any = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add updatedAt timestamp
    sanitizedUpdates.updatedAt = new Date();

    // Perform bulk update
    const result = await prisma.job.updateMany({
      where: {
        id: { in: jobIds },
      },
      data: sanitizedUpdates,
    });

    return NextResponse.json({
      updated: result.count,
      fields: Object.keys(sanitizedUpdates).filter(k => k !== 'updatedAt'),
    });
  } catch (error) {
    console.error('Error bulk updating jobs:', error);
    return NextResponse.json(
      { error: 'Failed to update jobs' },
      { status: 500 }
    );
  }
}
