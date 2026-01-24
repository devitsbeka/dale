import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function MinimalTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#000000';
    const fontFamily = getFontFamily(customization?.font);

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-16 text-gray-900" style={{ fontFamily }}>
            {/* Header */}
            <header className="mb-16">
                <h1 className="text-5xl font-light tracking-tight" style={{ color: accentColor }}>
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-6 space-y-1 text-sm font-light text-gray-600">
                    {personalInfo?.email && <div>{personalInfo.email}</div>}
                    {personalInfo?.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo?.location && <div>{personalInfo.location}</div>}
                    {personalInfo?.linkedin && <div>{personalInfo.linkedin}</div>}
                    {personalInfo?.website && <div>{personalInfo.website}</div>}
                </div>
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section className="mb-16">
                    <p className="text-base font-light leading-relaxed text-gray-800">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-16">
                    <h2 className="mb-8 text-xs font-medium uppercase tracking-widest" style={{ color: accentColor }}>
                        Experience
                    </h2>
                    <div className="space-y-12">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="mb-2">
                                    <h3 className="text-lg font-medium" style={{ color: accentColor }}>{exp.position}</h3>
                                    <div className="mt-1 text-sm font-light text-gray-600">
                                        {exp.company} • {exp.location}
                                    </div>
                                    <div className="mt-0.5 text-xs font-light text-gray-500">
                                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                                    </div>
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="mt-4 space-y-2 text-sm font-light text-gray-700">
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx} className="ml-4 list-disc">
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-16">
                    <h2 className="mb-8 text-xs font-medium uppercase tracking-widest" style={{ color: accentColor }}>
                        Education
                    </h2>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <h3 className="text-lg font-medium" style={{ color: accentColor }}>{edu.degree}</h3>
                                <div className="mt-1 text-sm font-light text-gray-600">
                                    {edu.school} • {edu.field}
                                </div>
                                <div className="mt-0.5 text-xs font-light text-gray-500">
                                    {edu.startDate} – {edu.endDate}
                                    {edu.gpa && ` • ${edu.gpa}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h2 className="mb-8 text-xs font-medium uppercase tracking-widest text-black">Skills</h2>
                    <div className="space-y-1 text-sm font-light text-gray-700">
                        {skills.map((skill) => (
                            <div key={skill.id}>{skill.name}</div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
