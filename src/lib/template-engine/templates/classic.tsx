import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function ClassicTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#1F2937';
    const fontFamily = getFontFamily(customization?.font || 'georgia');

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-12 text-gray-900" style={{ fontFamily }}>
            {/* Header */}
            <header className="border-b border-gray-400 pb-4 text-center">
                <h1 className="text-4xl font-bold tracking-wide text-gray-900">
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-3 space-x-3 text-sm text-gray-700">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>•</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>•</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                </div>
                {(personalInfo?.linkedin || personalInfo?.website) && (
                    <div className="mt-1 space-x-3 text-sm text-gray-600">
                        {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
                        {personalInfo?.website && personalInfo?.linkedin && <span>•</span>}
                        {personalInfo?.website && <span>{personalInfo.website}</span>}
                    </div>
                )}
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section className="mt-6">
                    <h2 className="border-b pb-1 text-sm font-bold uppercase tracking-wider" style={{ borderColor: accentColor, color: accentColor }}>
                        Professional Summary
                    </h2>
                    <p className="mt-2 text-justify leading-relaxed text-gray-800">{personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mt-6">
                    <h2 className="border-b pb-1 text-sm font-bold uppercase tracking-wider" style={{ borderColor: accentColor, color: accentColor }}>
                        Professional Experience
                    </h2>
                    <div className="mt-3 space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                                    <span className="text-sm italic text-gray-600">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm italic text-gray-700">
                                    {exp.company}, {exp.location}
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="mt-1 space-y-0.5 text-sm text-gray-800">
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx} className="ml-5 list-disc">
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
                <section className="mt-6">
                    <h2 className="border-b pb-1 text-sm font-bold uppercase tracking-wider" style={{ borderColor: accentColor, color: accentColor }}>
                        Education
                    </h2>
                    <div className="mt-3 space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                                    <span className="text-sm italic text-gray-600">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                                <div className="text-sm italic text-gray-700">
                                    {edu.school}, {edu.location}
                                </div>
                                <div className="text-sm text-gray-700">
                                    {edu.field}
                                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mt-6">
                    <h2 className="border-b pb-1 text-sm font-bold uppercase tracking-wider" style={{ borderColor: accentColor, color: accentColor }}>
                        Skills & Competencies
                    </h2>
                    <p className="mt-2 text-sm text-gray-800">
                        {skills.map((skill, idx) => (
                            <span key={skill.id}>
                                {skill.name}
                                {idx < skills.length - 1 && ' • '}
                            </span>
                        ))}
                    </p>
                </section>
            )}
        </div>
    );
}
