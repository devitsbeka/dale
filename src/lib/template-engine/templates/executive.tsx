import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function ExecutiveTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#0F172A';
    const fontFamily = getFontFamily(customization?.font || 'georgia');

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-12 text-gray-900" style={{ fontFamily }}>
            {/* Executive Header with Bold Top Bar */}
            <div className="mb-8">
                <div className="h-2 w-full mb-6" style={{ backgroundColor: accentColor }}></div>
                <h1 className="text-5xl font-bold tracking-tight" style={{ color: accentColor }}>
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 border-b pb-6 text-sm text-gray-700" style={{ borderColor: `${accentColor}30` }}>
                    {personalInfo?.email && (
                        <div className="flex gap-2">
                            <span className="font-bold" style={{ color: accentColor }}>Email:</span>
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex gap-2">
                            <span className="font-bold" style={{ color: accentColor }}>Phone:</span>
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex gap-2">
                            <span className="font-bold" style={{ color: accentColor }}>Location:</span>
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="flex gap-2">
                            <span className="font-bold" style={{ color: accentColor }}>LinkedIn:</span>
                            <span className="truncate">{personalInfo.linkedin}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Executive Summary */}
            {personalInfo?.summary && (
                <section className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                            Executive Summary
                        </h2>
                    </div>
                    <p className="text-justify text-base leading-relaxed text-gray-800">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-1 w-12" style={{ backgroundColor: accentColor }}></div>
                        <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                            Professional Experience
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {experience.map((exp) => (
                            <div key={exp.id} className="border-l-4 pl-6" style={{ borderColor: `${accentColor}20` }}>
                                <div className="mb-1 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                                            {exp.position}
                                        </h3>
                                        <div className="mt-1 text-base font-semibold text-gray-700">
                                            {exp.company}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <div className="font-medium">{exp.location}</div>
                                        <div>
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-700">
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

            {/* Education & Skills Side by Side */}
            <div className="grid grid-cols-5 gap-8">
                {/* Education - 3 columns */}
                {education.length > 0 && (
                    <section className="col-span-3">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-12" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                                Education
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="text-base font-bold" style={{ color: accentColor }}>
                                        {edu.degree}
                                    </h3>
                                    <div className="mt-1 font-semibold text-gray-700">
                                        {edu.school}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {edu.field} • {edu.startDate} - {edu.endDate}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills - 2 columns */}
                {skills.length > 0 && (
                    <section className="col-span-2">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-1 w-8" style={{ backgroundColor: accentColor }}></div>
                            <h2 className="text-lg font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                                Core Skills
                            </h2>
                        </div>
                        <div className="space-y-2">
                            {skills.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                    <span className="font-medium text-gray-800">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
