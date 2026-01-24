import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generatePDFResponse } from '@/lib/pdf-generator/puppeteer-service';
import type { ResumeData } from '@/types/resume';

// POST /api/resumes/:id/export - Generate PDF
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

        // Generate filename from resume data
        const baseFilename = `resume_${resume.personalInfo?.firstName || 'user'}_${resume.personalInfo?.lastName || 'resume'}`;

        // Get base URL from request
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host') || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        // Generate PDF using Puppeteer
        const { buffer, filename, contentType } = await generatePDFResponse(
            id,
            baseFilename,
            baseUrl
        );

        // Create export snapshot
        await prisma.resumeSnapshot.create({
            data: {
                resumeId: id,
                data: JSON.stringify(resume),
                changeType: 'export',
            },
        });

        // Return PDF as downloadable file
        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Error exporting resume:', error);
        return NextResponse.json(
            { error: 'Failed to export resume' },
            { status: 500 }
        );
    }
}
