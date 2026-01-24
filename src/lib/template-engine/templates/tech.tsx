import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function TechTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#10B981';
    const fontFamily = getFontFamily(customization?.font || 'inter');

    return (
        <div className="mx-auto max-w-[8.5in] bg-gray-50 p-12 text-sm text-gray-900" style={{ fontFamily }}>
            {/* Terminal-Style Header */}
            <header className="mb-8 rounded-lg border shadow-lg bg-gray-900 text-gray-100" style={{ borderColor: accentColor }}>
                <div className="flex items-center gap-2 border-b px-4 py-2 text-xs" style={{ borderColor: `${accentColor}40` }}>
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <span className="ml-2" style={{ color: accentColor }}>~/resume.md</span>
                </div>
                <div className="p-6 font-mono">
                    <div className="space-y-1">
                        <div>
                            <span style={{ color: accentColor }}>$</span> cat personal_info.json
                        </div>
                        <h1 className="text-2xl font-bold">
                            {personalInfo?.firstName} {personalInfo?.lastName}
                        </h1>
                    </div>
                    <div className="mt-4 space-y-1 text-xs">
                        {personalInfo?.email && (
                            <div>
                                <span style={{ color: accentColor }}>$</span> echo $EMAIL → <span className="text-cyan-400">{personalInfo.email}</span>
                            </div>
                        )}
                        {personalInfo?.phone && (
                            <div>
                                <span style={{ color: accentColor }}>$</span> echo $PHONE → <span className="text-cyan-400">{personalInfo.phone}</span>
                            </div>
                        )}
                        {personalInfo?.location && (
                            <div>
                                <span style={{ color: accentColor }}>$</span> echo $LOCATION → <span className="text-cyan-400">{personalInfo.location}</span>
                            </div>
                        )}
                        {personalInfo?.linkedin && (
                            <div>
                                <span style={{ color: accentColor }}>$</span> echo $LINKEDIN → <span className="text-cyan-400 break-all">{personalInfo.linkedin}</span>
                            </div>
                        )}
                        {personalInfo?.website && (
                            <div>
                                <span style={{ color: accentColor }}>$</span> echo $WEBSITE → <span className="text-cyan-400 break-all">{personalInfo.website}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section className="mb-6">
                    <h2 className="mb-2 font-mono font-bold" style={{ color: accentColor }}>
                        {'// ABOUT'}
                    </h2>
                    <p className="rounded border border-gray-300 bg-white p-4 leading-relaxed text-gray-800 shadow-sm">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3 font-mono font-bold" style={{ color: accentColor }}>
                        {'// EXPERIENCE'}
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="rounded border border-gray-300 bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                        <div className="font-semibold" style={{ color: accentColor }}>
                                            {exp.company} @ {exp.location}
                                        </div>
                                    </div>
                                    <div className="rounded px-2 py-1 text-xs font-mono" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </div>
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-gray-700">
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
                <section className="mb-6">
                    <h2 className="mb-3 font-mono font-bold" style={{ color: accentColor }}>
                        {'// EDUCATION'}
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="rounded border border-gray-300 bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <div className="font-semibold" style={{ color: accentColor }}>
                                            {edu.school} — {edu.field}
                                        </div>
                                        {edu.gpa && <div className="mt-1 text-xs text-gray-600">GPA: {edu.gpa}</div>}
                                    </div>
                                    <div className="rounded px-2 py-1 text-xs font-mono" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                        {edu.startDate} - {edu.endDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h2 className="mb-3 font-mono font-bold" style={{ color: accentColor }}>
                        {'// SKILLS'}
                    </h2>
                    <div className="rounded border border-gray-300 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="rounded border px-3 py-1 text-xs font-mono font-medium"
                                    style={{
                                        borderColor: accentColor,
                                        backgroundColor: `${accentColor}15`,
                                        color: accentColor
                                    }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
