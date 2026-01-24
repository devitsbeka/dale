import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword, isShareLinkValid } from '@/lib/sharing/share-link-generator';

// POST /api/share/:token - Access a shared resume (POST to support password)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        const body = await request.json();
        const { password } = body;

        // Find share link
        const shareLink = await prisma.shareLink.findUnique({
            where: { token },
            include: {
                resume: {
                    include: {
                        personalInfo: true,
                        experiences: { orderBy: { order: 'asc' } },
                        education: { orderBy: { order: 'asc' } },
                        skills: { orderBy: { order: 'asc' } },
                        customization: true,
                    },
                },
            },
        });

        if (!shareLink) {
            return NextResponse.json(
                { error: 'Share link not found' },
                { status: 404 }
            );
        }

        // Check if link is still valid
        if (!isShareLinkValid(shareLink)) {
            return NextResponse.json(
                { error: 'This share link has expired or reached its view limit' },
                { status: 410 } // 410 Gone
            );
        }

        // Check password if required
        if (shareLink.password) {
            if (!password) {
                return NextResponse.json(
                    { error: 'Password required' },
                    { status: 401 }
                );
            }

            const isValidPassword = await verifyPassword(password, shareLink.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Incorrect password' },
                    { status: 401 }
                );
            }
        }

        // Increment view count
        await prisma.shareLink.update({
            where: { id: shareLink.id },
            data: { viewCount: { increment: 1 } },
        });

        // Track analytics event
        await prisma.resumeAnalytics.create({
            data: {
                resumeId: shareLink.resume.id,
                eventType: 'view',
                metadata: JSON.stringify({ token, via: 'share_link' }),
            },
        });

        // Transform resume data to match ResumeData interface
        const resumeData = {
            id: shareLink.resume.id,
            personalInfo: shareLink.resume.personalInfo || undefined,
            experience: shareLink.resume.experiences.map((exp) => ({
                id: exp.id,
                company: exp.company,
                position: exp.position,
                location: exp.location || '',
                startDate: exp.startDate,
                endDate: exp.endDate || '',
                current: exp.isCurrent,
                achievements: exp.achievements,
            })),
            education: shareLink.resume.education.map((edu) => ({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                field: edu.field || '',
                location: edu.location || '',
                startDate: edu.startDate,
                endDate: edu.endDate,
                gpa: edu.gpa || '',
            })),
            skills: shareLink.resume.skills.map((skill) => ({
                id: skill.id,
                name: skill.name,
                category: skill.category as 'technical' | 'soft' | 'language' | 'tool',
            })),
            customization: shareLink.resume.customization
                ? {
                    template: shareLink.resume.customization.templateId,
                    primaryColor: shareLink.resume.customization.primaryColor,
                    font: shareLink.resume.customization.font,
                    sectionOrder: shareLink.resume.customization.sectionOrder as any,
                }
                : undefined,
        };

        return NextResponse.json({
            resumeData,
            viewCount: shareLink.viewCount + 1,
        });
    } catch (error) {
        console.error('Error accessing share link:', error);
        return NextResponse.json(
            { error: 'Failed to access shared resume' },
            { status: 500 }
        );
    }
}
