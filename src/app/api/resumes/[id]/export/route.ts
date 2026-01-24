import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generatePDFResponse } from '@/lib/pdf-generator/puppeteer-service';
import { generateDOCX } from '@/lib/export/docx-generator';
import { generateTXT } from '@/lib/export/txt-generator';
import { generateJSON } from '@/lib/export/json-generator';
import type { ResumeData } from '@/types/resume';

type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json';

// POST /api/resumes/:id/export - Generate resume in specified format
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const format: ExportFormat = body.format || 'pdf';

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

        // Transform database model to ResumeData type
        const resumeData: Partial<ResumeData> = {
            personalInfo: resume.personalInfo
                ? {
                      firstName: resume.personalInfo.firstName,
                      lastName: resume.personalInfo.lastName,
                      email: resume.personalInfo.email,
                      phone: resume.personalInfo.phone,
                      location: resume.personalInfo.location || '',
                      linkedin: resume.personalInfo.linkedin || undefined,
                      website: resume.personalInfo.website || undefined,
                      summary: resume.personalInfo.summary || '',
                  }
                : undefined,
            experience: resume.experiences.map((exp) => ({
                id: exp.id,
                company: exp.company,
                position: exp.position,
                location: exp.location || '',
                startDate: exp.startDate,
                endDate: exp.endDate || '',
                current: exp.isCurrent,
                achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
            })),
            education: resume.education.map((edu) => ({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                field: edu.field || '',
                location: edu.location || '',
                startDate: edu.startDate,
                endDate: edu.endDate,
                gpa: edu.gpa || undefined,
            })),
            skills: resume.skills.map((skill) => ({
                id: skill.id,
                name: skill.name,
                category: skill.category as 'technical' | 'soft' | 'language' | 'tool',
            })),
            customization: resume.customization
                ? {
                      template: resume.customization.templateId,
                      primaryColor: resume.customization.primaryColor,
                      font: resume.customization.font,
                      sectionOrder: resume.customization.sectionOrder,
                  }
                : undefined,
        };

        // Generate filename from resume data
        const firstName = resume.personalInfo?.firstName || 'user';
        const lastName = resume.personalInfo?.lastName || 'resume';
        const baseFilename = `resume_${firstName}_${lastName}`;

        let buffer: Buffer;
        let filename: string;
        let contentType: string;

        // Generate based on format
        switch (format) {
            case 'pdf':
                const protocol = request.headers.get('x-forwarded-proto') || 'http';
                const host = request.headers.get('host') || 'localhost:3000';
                const baseUrl = `${protocol}://${host}`;

                const pdfResult = await generatePDFResponse(id, baseFilename, baseUrl);
                buffer = pdfResult.buffer;
                filename = pdfResult.filename;
                contentType = pdfResult.contentType;
                break;

            case 'docx':
                buffer = await generateDOCX(resumeData);
                filename = `${baseFilename}.docx`;
                contentType =
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;

            case 'txt':
                const txtContent = generateTXT(resumeData);
                buffer = Buffer.from(txtContent, 'utf-8');
                filename = `${baseFilename}.txt`;
                contentType = 'text/plain';
                break;

            case 'json':
                const jsonContent = generateJSON(resumeData);
                buffer = Buffer.from(jsonContent, 'utf-8');
                filename = `${baseFilename}.json`;
                contentType = 'application/json';
                break;

            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        // Create export snapshot
        await prisma.resumeSnapshot.create({
            data: {
                resumeId: id,
                data: JSON.stringify(resume),
                changeType: 'export',
            },
        });

        // Return file as downloadable
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
