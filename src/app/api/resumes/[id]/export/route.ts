import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// POST /api/resumes/:id/export - Generate PDF (placeholder)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resume = await prisma.resume.findUnique({
            where: { id },
            include: {
                personalInfo: true,
                experiences: { orderBy: { order: 'asc' } },
                education: { orderBy: { order: 'asc' } },
                skills: { orderBy: { order: 'asc' } },
                customization: true,
            },
        });

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        // TODO: Implement Puppeteer PDF generation in Phase 3
        // For now, return resume data for client-side export

        // Create export snapshot
        await prisma.resumeSnapshot.create({
            data: {
                resumeId: id,
                data: JSON.stringify(resume),
                changeType: 'export',
            },
        });

        return NextResponse.json({
            success: true,
            message: 'PDF export will be implemented in Phase 3',
            resume,
        });
    } catch (error) {
        console.error('Error exporting resume:', error);
        return NextResponse.json(
            { error: 'Failed to export resume' },
            { status: 500 }
        );
    }
}
