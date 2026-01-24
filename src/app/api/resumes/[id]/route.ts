import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/resumes/:id - Fetch single resume
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resume = await prisma.resume.findUnique({
            where: { id },
            include: {
                personalInfo: true,
                experiences: {
                    orderBy: { order: 'asc' },
                },
                education: {
                    orderBy: { order: 'asc' },
                },
                skills: {
                    orderBy: { order: 'asc' },
                },
                customization: true,
            },
        });

        if (!resume) {
            return NextResponse.json(
                { error: 'Resume not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume' },
            { status: 500 }
        );
    }
}

// PATCH /api/resumes/:id - Update resume
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { personalInfo, experiences, education, skills, customization, ...resumeData } = body;

        // Start a transaction to update all related data
        const resume = await prisma.$transaction(async (tx) => {
            // Update main resume data
            const updatedResume = await tx.resume.update({
                where: { id },
                data: resumeData,
            });

            // Update personal info
            if (personalInfo) {
                await tx.personalInfo.upsert({
                    where: { resumeId: id },
                    update: personalInfo,
                    create: {
                        resumeId: id,
                        ...personalInfo,
                    },
                });
            }

            // Update experiences
            if (experiences) {
                // Delete all existing experiences
                await tx.workExperience.deleteMany({
                    where: { resumeId: id },
                });
                // Create new experiences
                if (experiences.length > 0) {
                    await tx.workExperience.createMany({
                        data: experiences.map((exp: any, index: number) => ({
                            resumeId: id,
                            ...exp,
                            order: index,
                        })),
                    });
                }
            }

            // Update education
            if (education) {
                await tx.education.deleteMany({
                    where: { resumeId: id },
                });
                if (education.length > 0) {
                    await tx.education.createMany({
                        data: education.map((edu: any, index: number) => ({
                            resumeId: id,
                            ...edu,
                            order: index,
                        })),
                    });
                }
            }

            // Update skills
            if (skills) {
                await tx.skill.deleteMany({
                    where: { resumeId: id },
                });
                if (skills.length > 0) {
                    await tx.skill.createMany({
                        data: skills.map((skill: any, index: number) => ({
                            resumeId: id,
                            ...skill,
                            order: index,
                        })),
                    });
                }
            }

            // Update customization
            if (customization) {
                await tx.resumeCustomization.upsert({
                    where: { resumeId: id },
                    update: customization,
                    create: {
                        resumeId: id,
                        ...customization,
                    },
                });
            }

            // Create snapshot for auto-save
            await tx.resumeSnapshot.create({
                data: {
                    resumeId: id,
                    data: JSON.stringify(body),
                    changeType: 'auto_save',
                },
            });

            return updatedResume;
        });

        // Fetch complete resume data
        const completeResume = await prisma.resume.findUnique({
            where: { id },
            include: {
                personalInfo: true,
                experiences: { orderBy: { order: 'asc' } },
                education: { orderBy: { order: 'asc' } },
                skills: { orderBy: { order: 'asc' } },
                customization: true,
            },
        });

        return NextResponse.json(completeResume);
    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json(
            { error: 'Failed to update resume' },
            { status: 500 }
        );
    }
}

// DELETE /api/resumes/:id - Archive/delete resume
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.resume.update({
            where: { id },
            data: { status: 'archived' },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume' },
            { status: 500 }
        );
    }
}
