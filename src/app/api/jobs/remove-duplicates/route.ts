/**
 * Remove Duplicate Jobs API
 * POST /api/jobs/remove-duplicates - Detect and remove duplicate jobs from database
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST() {
  try {
    let totalRemoved = 0;

    // Strategy 1: Remove duplicates by source + externalId
    // Keep the most recently updated one
    const duplicatesByExternalId = await prisma.$queryRaw<
      Array<{ source: string; externalId: string; count: bigint }>
    >`
      SELECT source, "externalId", COUNT(*) as count
      FROM "Job"
      GROUP BY source, "externalId"
      HAVING COUNT(*) > 1
    `;

    for (const dup of duplicatesByExternalId) {
      // Get all jobs with this source + externalId
      const jobs = await prisma.job.findMany({
        where: {
          source: dup.source,
          externalId: dup.externalId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      // Keep the first (most recent), delete the rest
      const toDelete = jobs.slice(1).map((job) => job.id);

      if (toDelete.length > 0) {
        await prisma.job.deleteMany({
          where: {
            id: {
              in: toDelete,
            },
          },
        });

        totalRemoved += toDelete.length;
        console.log(
          `Removed ${toDelete.length} duplicates for ${dup.source}:${dup.externalId}`
        );
      }
    }

    // Strategy 2: Remove near-duplicates by normalized title + company
    // (case-insensitive, trimmed)
    const allJobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    // Group by normalized title + company
    const groupedByContent = new Map<string, typeof allJobs>();

    for (const job of allJobs) {
      const key = `${job.title.toLowerCase().trim()}|${job.company.toLowerCase().trim()}`;
      const existing = groupedByContent.get(key) || [];
      existing.push(job);
      groupedByContent.set(key, existing);
    }

    // Find and remove duplicates
    for (const [key, jobs] of groupedByContent.entries()) {
      if (jobs.length > 1) {
        // Sort by publishedAt (prefer newer), then updatedAt
        jobs.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

          if (dateA !== dateB) {
            return dateB - dateA; // Newer first
          }

          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        // Keep the first (most recent), delete the rest
        const toDelete = jobs.slice(1).map((job) => job.id);

        if (toDelete.length > 0) {
          await prisma.job.deleteMany({
            where: {
              id: {
                in: toDelete,
              },
            },
          });

          totalRemoved += toDelete.length;
          console.log(
            `Removed ${toDelete.length} content duplicates for "${jobs[0].title}" at "${jobs[0].company}"`
          );
        }
      }
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      removed: totalRemoved,
      message: `Successfully removed ${totalRemoved} duplicate jobs`,
    });
  } catch (error) {
    console.error('Error removing duplicates:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove duplicates',
      },
      { status: 500 }
    );
  }
}
