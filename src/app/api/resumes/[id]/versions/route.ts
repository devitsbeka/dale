import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/resumes/:id/versions - Get version history
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');

        const snapshots = await prisma.resumeSnapshot.findMany({
            where: { resumeId: id },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return NextResponse.json(snapshots);
    } catch (error) {
        console.error('Error fetching versions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch versions' },
            { status: 500 }
        );
    }
}

// POST /api/resumes/:id/versions - Create manual snapshot
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
                experiences: true,
                education: true,
                skills: true,
                customization: true,
            },
        });

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        const snapshot = await prisma.resumeSnapshot.create({
            data: {
                resumeId: id,
                data: JSON.stringify(resume),
                changeType: 'manual_save',
            },
        });

        return NextResponse.json(snapshot, { status: 201 });
    } catch (error) {
        console.error('Error creating snapshot:', error);
        return NextResponse.json(
            { error: 'Failed to create snapshot' },
            { status: 500 }
        );
    }
}
