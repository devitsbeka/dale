import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function AcademicTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#374151';
    const fontFamily = getFontFamily(customization?.font || 'georgia');

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-12 text-gray-900" style={{ fontFamily }}>
            {/* Academic Header */}
            <header className="mb-6 text-center border-b-2 pb-4" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-3 space-y-0.5 text-sm text-gray-700">
                    {personalInfo?.email && <div>{personalInfo.email}</div>}
                    <div className="flex items-center justify-center gap-2">
                        {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo?.location && personalInfo?.phone && <span>•</span>}
                        {personalInfo?.location && <span>{personalInfo.location}</span>}
                    </div>
                    {(personalInfo?.linkedin || personalInfo?.website) && (
                        <div className="flex items-center justify-center gap-2">
                            {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
                            {personalInfo?.website && personalInfo?.linkedin && <span>•</span>}
                            {personalInfo?.website && <span>{personalInfo.website}</span>}
                        </div>
                    )}
                </div>
            </header>

            {/* Research Interests / Summary */}
            {personalInfo?.summary && (
                <section className="mb-6">
                    <h2 className="mb-2 border-b border-gray-400 text-base font-bold uppercase text-gray-900">
                        Research Interests
                    </h2>
                    <p className="text-justify text-sm leading-relaxed text-gray-800">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Education (Primary focus for academic) */}
            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-2 border-b text-sm font-bold uppercase" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <span className="text-xs text-gray-600">
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

            {/* Professional Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-2 border-b text-sm font-bold uppercase" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                        Professional Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                        <div className="text-sm italic text-gray-700">
                                            {exp.company}, {exp.location}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
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

            {/* Skills & Competencies */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-2 border-b border-gray-400 text-base font-bold uppercase text-gray-900">
                        Skills & Competencies
                    </h2>
                    <div className="text-sm text-gray-800">
                        {skills.map((skill, idx) => (
                            <span key={skill.id}>
                                {skill.name}
                                {idx < skills.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
