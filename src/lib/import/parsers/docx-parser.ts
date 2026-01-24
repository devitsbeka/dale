import mammoth from 'mammoth';
import type { ResumeData } from '@/types/resume';

export async function parseDOCX(buffer: Buffer): Promise<Partial<ResumeData>> {
    try {
        // Extract text from DOCX
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        // Use the same parsing logic as PDF
        return parseDocumentText(text);
    } catch (error) {
        console.error('DOCX parsing error:', error);
        throw new Error('Failed to parse DOCX file');
    }
}

function parseDocumentText(text: string): Partial<ResumeData> {
    const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

    return {
        personalInfo: extractPersonalInfo(lines, text) as any,
        experience: extractExperience(text),
        education: extractEducation(text),
        skills: extractSkills(text),
    };
}

function extractPersonalInfo(
    lines: string[],
    fullText: string
): ResumeData['personalInfo'] {
    const personal: ResumeData['personalInfo'] = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
    };

    // Extract email
    const emailMatch = fullText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
        personal.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = fullText.match(
        /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
    );
    if (phoneMatch) {
        personal.phone = phoneMatch[0];
    }

    // Extract name
    const nameLines = lines.slice(0, 3);
    for (const line of nameLines) {
        if (
            line.length > 3 &&
            line.length < 50 &&
            !line.includes('@') &&
            !line.match(/\d{3}/) &&
            (line === line.toUpperCase() || /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line))
        ) {
            const nameParts = line.split(/\s+/);
            if (nameParts.length >= 2) {
                personal.firstName = nameParts[0];
                personal.lastName = nameParts.slice(1).join(' ');
                break;
            }
        }
    }

    // Extract location
    const locationMatch = fullText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/);
    if (locationMatch) {
        personal.location = `${locationMatch[1]}, ${locationMatch[2]}`;
    }

    // Extract LinkedIn
    const linkedinMatch = fullText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
    if (linkedinMatch) {
        personal.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Extract website
    const websiteMatch = fullText.match(
        /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-z]{2,})(?:\/[^\s]*)?/
    );
    if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('@')) {
        personal.website = websiteMatch[0];
    }

    // Extract summary
    const summaryMatch = fullText.match(
        /(?:SUMMARY|OBJECTIVE|PROFILE|ABOUT)[:\s]+((?:.|\n)*?)(?=\n\n[A-Z]|EXPERIENCE|EDUCATION|SKILLS|$)/i
    );
    if (summaryMatch) {
        personal.summary = summaryMatch[1].trim().replace(/\s+/g, ' ').slice(0, 500);
    }

    return personal;
}

function extractExperience(text: string): ResumeData['experience'] {
    const experiences: ResumeData['experience'] = [];

    const experienceMatch = text.match(
        /(?:EXPERIENCE|WORK HISTORY|EMPLOYMENT)[:\s]+((?:.|\n)*?)(?=\n\n[A-Z]{2,}|EDUCATION|SKILLS|$)/i
    );

    if (!experienceMatch) return experiences;

    const experienceText = experienceMatch[1];
    const entries = experienceText.split(/\n(?=[A-Z][a-z]+.*(?:January|February|March|April|May|June|July|August|September|October|November|December|\d{4}))/);

    entries.forEach((entry, index) => {
        const lines = entry.split('\n').filter((l) => l.trim());
        if (lines.length < 2) return;

        const position = lines[0].trim();

        let company = '';
        let location = '';
        const companyLine = lines[1];
        const parts = companyLine.split(/[,|]/);
        if (parts.length >= 1) {
            company = parts[0].trim();
        }
        if (parts.length >= 2) {
            location = parts[1].trim();
        }

        const dateMatch = entry.match(
            /(January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/)\s*\d{4}\s*[-–—]\s*(January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\/|Present)\s*\d{0,4}/i
        );

        let startDate = '';
        let endDate = '';
        let current = false;

        if (dateMatch) {
            const dateParts = dateMatch[0].split(/[-–—]/);
            if (dateParts.length === 2) {
                startDate = dateParts[0].trim();
                endDate = dateParts[1].trim();
                current = /present|current/i.test(endDate);
            }
        }

        const achievements: string[] = [];
        const achievementLines = lines.slice(2);
        achievementLines.forEach((line) => {
            const cleaned = line.replace(/^[•\-*\d+.)\s]+/, '').trim();
            if (cleaned.length > 10) {
                achievements.push(cleaned);
            }
        });

        if (position && company) {
            experiences.push({
                id: `exp-${index}`,
                company,
                position,
                location,
                startDate,
                endDate,
                current,
                achievements: achievements.length > 0 ? achievements : [''],
            });
        }
    });

    return experiences;
}

function extractEducation(text: string): ResumeData['education'] {
    const education: ResumeData['education'] = [];

    const educationMatch = text.match(
        /(?:EDUCATION|ACADEMIC)[:\s]+((?:.|\n)*?)(?=\n\n[A-Z]{2,}|EXPERIENCE|SKILLS|$)/i
    );

    if (!educationMatch) return education;

    const educationText = educationMatch[1];
    const entries = educationText.split(/\n(?=[A-Z][a-z]+.*(?:University|College|Institute|School))/);

    entries.forEach((entry, index) => {
        const lines = entry.split('\n').filter((l) => l.trim());
        if (lines.length < 1) return;

        const school = lines[0].trim();

        let degree = '';
        let field = '';
        const degreeLine = lines[1] || '';
        if (degreeLine.includes(' in ')) {
            const parts = degreeLine.split(' in ');
            degree = parts[0].trim();
            field = parts[1].trim();
        } else {
            degree = degreeLine;
        }

        let location = '';
        const locationMatch = entry.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/);
        if (locationMatch) {
            location = `${locationMatch[1]}, ${locationMatch[2]}`;
        }

        const dateMatch = entry.match(/\d{4}\s*[-–—]\s*(?:\d{4}|Present)/i);
        let startDate = '';
        let endDate = '';

        if (dateMatch) {
            const dateParts = dateMatch[0].split(/[-–—]/);
            if (dateParts.length === 2) {
                startDate = dateParts[0].trim();
                endDate = dateParts[1].trim();
            }
        }

        let gpa;
        const gpaMatch = entry.match(/GPA[:\s]*(\d\.\d+)/i);
        if (gpaMatch) {
            gpa = gpaMatch[1];
        }

        if (school && degree) {
            education.push({
                id: `edu-${index}`,
                school,
                degree,
                field,
                location,
                startDate,
                endDate,
                gpa,
            });
        }
    });

    return education;
}

function extractSkills(text: string): ResumeData['skills'] {
    const skills: ResumeData['skills'] = [];

    const skillsMatch = text.match(
        /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[:\s]+((?:.|\n)*?)(?=\n\n[A-Z]{2,}|EXPERIENCE|EDUCATION|$)/i
    );

    if (!skillsMatch) return skills;

    const skillsText = skillsMatch[1];
    const skillItems = skillsText
        .split(/[,•\-\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 50);

    skillItems.forEach((skillName, index) => {
        skills.push({
            id: `skill-${index}`,
            name: skillName,
            category: 'technical',
        });
    });

    return skills;
}
