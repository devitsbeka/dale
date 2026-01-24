import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { nanoid } from 'nanoid';

// GET /api/resumes - List user's resumes
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // TODO: Get userId from session/auth
        const userId = 'demo-user'; // Placeholder until auth is implemented

        const [resumes, total] = await Promise.all([
            prisma.resume.findMany({
                where: { userId },
                include: {
                    personalInfo: true,
                    _count: {
                        select: {
                            experiences: true,
                            education: true,
                            skills: true,
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.resume.count({ where: { userId } }),
        ]);

        return NextResponse.json({
            resumes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        );
    }
}

// POST /api/resumes - Create new resume
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // TODO: Get userId from session/auth
        const userId = 'demo-user'; // Placeholder until auth is implemented

        // Generate unique slug
        const slug = nanoid(10);

        const resume = await prisma.resume.create({
            data: {
                userId,
                name: body.name || 'Untitled Resume',
                slug,
                status: 'draft',
            },
            include: {
                personalInfo: true,
                experiences: true,
                education: true,
                skills: true,
                customization: true,
            },
        });

        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        console.error('Error creating resume:', error);
        return NextResponse.json(
            { error: 'Failed to create resume' },
            { status: 500 }
        );
    }
}
