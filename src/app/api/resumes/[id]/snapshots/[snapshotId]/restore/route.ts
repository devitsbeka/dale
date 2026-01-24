import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; snapshotId: string }> }
) {
    try {
        const { id, snapshotId } = await params;

        // Get the snapshot
        const snapshot = await prisma.resumeSnapshot.findUnique({
            where: { id: snapshotId },
        });

        if (!snapshot || snapshot.resumeId !== id) {
            return NextResponse.json({ error: 'Snapshot not found' }, { status: 404 });
        }

        // Parse snapshot data
        const snapshotData = JSON.parse(snapshot.data);

        // Update the resume with snapshot data
        // This will restore all related data
        await prisma.$transaction(async (tx) => {
            // Update personal info if exists
            if (snapshotData.personalInfo) {
                await tx.personalInfo.upsert({
                    where: { resumeId: id },
                    create: {
                        resumeId: id,
                        ...snapshotData.personalInfo,
                    },
                    update: snapshotData.personalInfo,
                });
            }

            // Delete and recreate experiences
            await tx.workExperience.deleteMany({ where: { resumeId: id } });
            if (snapshotData.experiences && snapshotData.experiences.length > 0) {
                await tx.workExperience.createMany({
                    data: snapshotData.experiences.map((exp: any, index: number) => ({
                        resumeId: id,
                        company: exp.company,
                        position: exp.position,
                        location: exp.location,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        isCurrent: exp.isCurrent,
                        achievements: exp.achievements,
                        order: index,
                    })),
                });
            }

            // Delete and recreate education
            await tx.education.deleteMany({ where: { resumeId: id } });
            if (snapshotData.education && snapshotData.education.length > 0) {
                await tx.education.createMany({
                    data: snapshotData.education.map((edu: any, index: number) => ({
                        resumeId: id,
                        school: edu.school,
                        degree: edu.degree,
                        field: edu.field,
                        location: edu.location,
                        startDate: edu.startDate,
                        endDate: edu.endDate,
                        gpa: edu.gpa,
                        order: index,
                    })),
                });
            }

            // Delete and recreate skills
            await tx.skill.deleteMany({ where: { resumeId: id } });
            if (snapshotData.skills && snapshotData.skills.length > 0) {
                await tx.skill.createMany({
                    data: snapshotData.skills.map((skill: any, index: number) => ({
                        resumeId: id,
                        name: skill.name,
                        category: skill.category,
                        order: index,
                    })),
                });
            }

            // Update customization if exists
            if (snapshotData.customization) {
                await tx.resumeCustomization.upsert({
                    where: { resumeId: id },
                    create: {
                        resumeId: id,
                        ...snapshotData.customization,
                    },
                    update: snapshotData.customization,
                });
            }

            // Create a new snapshot for this restore action
            await tx.resumeSnapshot.create({
                data: {
                    resumeId: id,
                    data: snapshot.data,
                    changeType: 'restore',
                },
            });

            // Track analytics event
            await tx.resumeAnalytics.create({
                data: {
                    resumeId: id,
                    eventType: 'restore',
                    metadata: JSON.stringify({ snapshotId }),
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Resume restored successfully',
        });
    } catch (error) {
        console.error('Error restoring snapshot:', error);
        return NextResponse.json({ error: 'Failed to restore snapshot' }, { status: 500 });
    }
}
