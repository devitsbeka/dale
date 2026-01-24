import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import type { ResumeData } from '@/types/resume';

export async function generateDOCX(data: Partial<ResumeData>): Promise<Buffer> {
    const sections: Paragraph[] = [];

    // Header - Name and Contact
    if (data.personalInfo) {
        const { firstName, lastName, email, phone, location, linkedin, website } = data.personalInfo;

        sections.push(
            new Paragraph({
                text: `${firstName} ${lastName}`,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            })
        );

        const contactInfo: string[] = [];
        if (email) contactInfo.push(email);
        if (phone) contactInfo.push(phone);
        if (location) contactInfo.push(location);

        if (contactInfo.length > 0) {
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: contactInfo.join(' | '), size: 20 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                })
            );
        }

        if (linkedin || website) {
            const links: string[] = [];
            if (linkedin) links.push(linkedin);
            if (website) links.push(website);

            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: links.join(' | '), size: 20 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                })
            );
        }

        // Summary
        if (data.personalInfo.summary) {
            sections.push(
                new Paragraph({
                    text: 'Summary',
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 100 },
                })
            );
            sections.push(
                new Paragraph({
                    text: data.personalInfo.summary,
                    spacing: { after: 300 },
                })
            );
        }
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
        sections.push(
            new Paragraph({
                text: 'Experience',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );

        data.experience.forEach((exp) => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.position, bold: true, size: 24 }),
                    ],
                    spacing: { before: 150 },
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${exp.company}`, italics: true }),
                        new TextRun({ text: ` | ${exp.location}` }),
                    ],
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                            size: 20,
                        }),
                    ],
                    spacing: { after: 100 },
                })
            );

            if (exp.achievements && exp.achievements.length > 0) {
                exp.achievements
                    .filter((a) => a.trim())
                    .forEach((achievement) => {
                        sections.push(
                            new Paragraph({
                                text: achievement,
                                bullet: { level: 0 },
                                spacing: { after: 50 },
                            })
                        );
                    });
            }
        });
    }

    // Education
    if (data.education && data.education.length > 0) {
        sections.push(
            new Paragraph({
                text: 'Education',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );

        data.education.forEach((edu) => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.school, bold: true, size: 24 }),
                    ],
                    spacing: { before: 150 },
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                            italics: true,
                        }),
                    ],
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${edu.startDate} - ${edu.endDate}`,
                            size: 20,
                        }),
                    ],
                    spacing: { after: 100 },
                })
            );

            if (edu.gpa) {
                sections.push(
                    new Paragraph({
                        text: `GPA: ${edu.gpa}`,
                        spacing: { after: 100 },
                    })
                );
            }
        });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
        sections.push(
            new Paragraph({
                text: 'Skills',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 },
            })
        );

        const skillNames = data.skills.map((s) => s.name).join(', ');
        sections.push(
            new Paragraph({
                text: skillNames,
                spacing: { after: 100 },
            })
        );
    }

    // Create document
    const doc = new Document({
        sections: [
            {
                children: sections,
            },
        ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
}
