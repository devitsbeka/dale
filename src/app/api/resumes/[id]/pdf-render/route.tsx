import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { TemplateRenderer } from '@/lib/template-engine/template-renderer';
import type { ResumeData } from '@/types/resume';

// GET /api/resumes/:id/pdf-render - Render resume for PDF generation
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
                experiences: { orderBy: { order: 'asc' } },
                education: { orderBy: { order: 'asc' } },
                skills: { orderBy: { order: 'asc' } },
                customization: true,
            },
        });

        if (!resume) {
            return new NextResponse('Resume not found', { status: 404 });
        }

        // Transform to ResumeData format with type safety
        const resumeData: Partial<ResumeData> = {
            id: resume.id,
            name: resume.name,
            personalInfo: resume.personalInfo ? {
                firstName: resume.personalInfo.firstName,
                lastName: resume.personalInfo.lastName,
                email: resume.personalInfo.email,
                phone: resume.personalInfo.phone,
                location: resume.personalInfo.location || '',
                linkedin: resume.personalInfo.linkedin || undefined,
                website: resume.personalInfo.website || undefined,
                summary: resume.personalInfo.summary || '',
            } : undefined,
            experience: resume.experiences.map((exp: typeof resume.experiences[number]) => ({
                id: exp.id,
                company: exp.company,
                position: exp.position,
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                current: exp.isCurrent,
                achievements: exp.achievements as string[],
            })),
            education: resume.education.map((edu: typeof resume.education[number]) => ({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                field: edu.field || '',
                location: edu.location || '',
                startDate: edu.startDate || '',
                endDate: edu.endDate || '',
                gpa: edu.gpa || undefined,
            })),
            skills: resume.skills.map((skill: typeof resume.skills[number]) => ({
                id: skill.id,
                name: skill.name,
                category: skill.category as 'technical' | 'soft' | 'language' | 'tool',
            })),
            customization: resume.customization ? {
                template: resume.customization.templateId,
                primaryColor: resume.customization.primaryColor,
                font: resume.customization.font,
                sectionOrder: resume.customization.sectionOrder as string[],
            } : {
                template: 'modern',
                primaryColor: '#E9684B',
                font: 'inter',
                sectionOrder: [],
            },
        };

        const templateId = resume.customization?.templateId || 'modern';

        // Return HTML page for Puppeteer to render
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${resumeData.personalInfo?.firstName} ${resumeData.personalInfo?.lastName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
            size: letter;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
        }
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    </style>
</head>
<body>
    <div id="resume-container"></div>
    <script type="module">
        const resumeData = ${JSON.stringify(resumeData)};
        const templateId = ${JSON.stringify(templateId)};

        // This will be rendered by the actual page load
        console.log('Resume data loaded for PDF generation');
    </script>
</body>
</html>
        `.trim();

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error) {
        console.error('Error rendering resume for PDF:', error);
        return new NextResponse('Failed to render resume', { status: 500 });
    }
}
