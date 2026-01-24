import type { TemplateProps } from '../types';

export function TechTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [] } = data;

    return (
        <div className="mx-auto max-w-[8.5in] bg-slate-50 p-12 font-mono text-sm text-gray-900">
            {/* Terminal-Style Header */}
            <header className="mb-8 rounded-lg border border-emerald-500 bg-slate-900 p-6 text-emerald-400 shadow-lg">
                <div className="mb-3 flex items-center gap-2 text-xs text-emerald-500">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span className="ml-2">~/resume</span>
                </div>
                <div className="space-y-1">
                    <div>
                        <span className="text-emerald-500">$</span> cat name.txt
                    </div>
                    <h1 className="text-2xl font-bold">
                        {personalInfo?.firstName} {personalInfo?.lastName}
                    </h1>
                </div>
                <div className="mt-4 space-y-1 text-xs">
                    {personalInfo?.email && (
                        <div>
                            <span className="text-emerald-500">$</span> echo $EMAIL →{' '}
                            <span className="text-cyan-400">{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div>
                            <span className="text-emerald-500">$</span> echo $PHONE →{' '}
                            <span className="text-cyan-400">{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div>
                            <span className="text-emerald-500">$</span> echo $LOCATION →{' '}
                            <span className="text-cyan-400">{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div>
                            <span className="text-emerald-500">$</span> echo $LINKEDIN →{' '}
                            <span className="text-cyan-400">{personalInfo.linkedin}</span>
                        </div>
                    )}
                    {personalInfo?.website && (
                        <div>
                            <span className="text-emerald-500">$</span> echo $WEBSITE →{' '}
                            <span className="text-cyan-400">{personalInfo.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section className="mb-6">
                    <h2 className="mb-2 font-bold text-emerald-600">{'// About'}</h2>
                    <p className="rounded border border-gray-300 bg-white p-4 leading-relaxed text-gray-800">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="mb-3 font-bold text-emerald-600">{'// Experience'}</h2>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="rounded border border-gray-300 bg-white p-4">
                                <div className="mb-2 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                        <div className="text-emerald-700">
                                            {exp.company} @ {exp.location}
                                        </div>
                                    </div>
                                    <div className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
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
                    <h2 className="mb-3 font-bold text-emerald-600">{'// Education'}</h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="rounded border border-gray-300 bg-white p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <div className="text-emerald-700">
                                            {edu.school} — {edu.field}
                                        </div>
                                        {edu.gpa && (
                                            <div className="mt-1 text-xs text-gray-600">GPA: {edu.gpa}</div>
                                        )}
                                    </div>
                                    <div className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
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
                    <h2 className="mb-3 font-bold text-emerald-600">{'// Skills'}</h2>
                    <div className="rounded border border-gray-300 bg-white p-4">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="rounded border border-emerald-500 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
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
