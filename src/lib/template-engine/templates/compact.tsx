import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function CompactTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#1E40AF';
    const fontFamily = getFontFamily(customization?.font);

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-8 text-xs text-gray-900" style={{ fontFamily }}>
            {/* Compact Header */}
            <header className="mb-4 border-b-2 pb-2" style={{ borderColor: accentColor }}>
                <h1 className="text-2xl font-bold" style={{ color: accentColor }}>
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-gray-700">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
                    {personalInfo?.website && <span>• {personalInfo.website}</span>}
                </div>
            </header>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-[2fr_1fr] gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section>
                            <h2 className="mb-1 text-sm font-bold uppercase tracking-wide" style={{ color: accentColor }}>Summary</h2>
                            <p className="leading-tight text-gray-800">{personalInfo.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section>
                            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide" style={{ color: accentColor }}>Experience</h2>
                            <div className="space-y-3">
                                {experience.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                                            <span className="text-xs text-gray-600">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-xs font-semibold text-gray-700">
                                            {exp.company} | {exp.location}
                                        </div>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul className="mt-0.5 space-y-0.5 text-gray-700">
                                                {exp.achievements.map((achievement, idx) => (
                                                    <li key={idx} className="ml-3 list-disc leading-tight">
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
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide" style={{ color: accentColor }}>Skills</h2>
                            <div className="space-y-1">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="flex items-start gap-1.5">
                                        <div className="h-1 w-1 mt-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                        <span className="leading-tight text-gray-800">{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide" style={{ color: accentColor }}>Education</h2>
                            <div className="space-y-2">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                                        <div className="text-xs text-gray-700">{edu.school}</div>
                                        <div className="text-xs text-gray-600">{edu.field}</div>
                                        <div className="text-xs text-gray-600">
                                            {edu.startDate} - {edu.endDate}
                                            {edu.gpa && ` • ${edu.gpa}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
