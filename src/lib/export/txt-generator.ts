import type { ResumeData } from '@/types/resume';

export function generateTXT(data: Partial<ResumeData>): string {
    const lines: string[] = [];

    // Header
    if (data.personalInfo) {
        const { firstName, lastName, email, phone, location, linkedin, website, summary } =
            data.personalInfo;

        lines.push(`${firstName} ${lastName}`.toUpperCase());
        lines.push('='.repeat(`${firstName} ${lastName}`.length));
        lines.push('');

        if (email) lines.push(`Email: ${email}`);
        if (phone) lines.push(`Phone: ${phone}`);
        if (location) lines.push(`Location: ${location}`);
        if (linkedin) lines.push(`LinkedIn: ${linkedin}`);
        if (website) lines.push(`Website: ${website}`);
        lines.push('');

        if (summary) {
            lines.push('SUMMARY');
            lines.push('-'.repeat(60));
            lines.push(summary);
            lines.push('');
        }
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
        lines.push('EXPERIENCE');
        lines.push('-'.repeat(60));
        lines.push('');

        data.experience.forEach((exp, index) => {
            lines.push(exp.position);
            lines.push(`${exp.company} | ${exp.location}`);
            lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
            lines.push('');

            if (exp.achievements && exp.achievements.length > 0) {
                exp.achievements
                    .filter((a) => a.trim())
                    .forEach((achievement) => {
                        lines.push(`  • ${achievement}`);
                    });
                lines.push('');
            }

            if (data.experience && index < data.experience.length - 1) {
                lines.push('');
            }
        });
    }

    // Education
    if (data.education && data.education.length > 0) {
        lines.push('EDUCATION');
        lines.push('-'.repeat(60));
        lines.push('');

        data.education.forEach((edu, index) => {
            lines.push(edu.school);
            lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
            lines.push(`${edu.startDate} - ${edu.endDate}`);
            if (edu.gpa) {
                lines.push(`GPA: ${edu.gpa}`);
            }

            if (data.education && index < data.education.length - 1) {
                lines.push('');
            }
        });
        lines.push('');
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
        lines.push('SKILLS');
        lines.push('-'.repeat(60));
        const skillNames = data.skills.map((s) => s.name).join(', ');
        lines.push(skillNames);
        lines.push('');
    }

    return lines.join('\n');
}
