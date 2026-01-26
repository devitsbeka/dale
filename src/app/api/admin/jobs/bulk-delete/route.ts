/**
 * Bulk Delete API - Delete multiple jobs at once
 * POST /api/admin/jobs/bulk-delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { jobIds } = await request.json();

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid job IDs' },
        { status: 400 }
      );
    }

    // Check for jobs with relations (saved jobs or applications)
    const jobsWithRelations = await prisma.job.findMany({
      where: {
        id: { in: jobIds },
        OR: [
          { savedBy: { some: {} } },
          { applications: { some: {} } },
        ],
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            savedBy: true,
            applications: true,
          },
        },
      },
    });

    // Delete jobs without relations
    const jobsToDelete = jobIds.filter(
      (id) => !jobsWithRelations.find((j) => j.id === id)
    );

    const result = await prisma.job.deleteMany({
      where: {
        id: { in: jobsToDelete },
      },
    });

    return NextResponse.json({
      deleted: result.count,
      skipped: jobsWithRelations.length,
      skippedJobs: jobsWithRelations.map((j) => ({
        id: j.id,
        title: j.title,
        reason: `Has ${j._count.savedBy} saved and ${j._count.applications} applications`,
      })),
    });
  } catch (error) {
    console.error('Error bulk deleting jobs:', error);
    return NextResponse.json(
      { error: 'Failed to delete jobs' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
