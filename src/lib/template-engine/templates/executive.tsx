import type { TemplateProps } from '../types';

export function ExecutiveTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [] } = data;

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-12 font-serif text-gray-900">
            {/* Refined Header */}
            <header className="mb-8 border-b-4 border-slate-900 pb-6">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Email:</span>
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Phone:</span>
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Location:</span>
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">LinkedIn:</span>
                            <span>{personalInfo.linkedin}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Executive Summary */}
            {personalInfo?.summary && (
                <section className="mb-8">
                    <h2 className="mb-3 border-l-4 border-slate-900 pl-4 text-xl font-bold uppercase tracking-wide text-slate-900">
                        Executive Summary
                    </h2>
                    <p className="text-justify text-base leading-relaxed text-gray-800">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="mb-4 border-l-4 border-slate-900 pl-4 text-xl font-bold uppercase tracking-wide text-slate-900">
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((exp) => (
                            <div key={exp.id} className="border-l-2 border-gray-200 pl-6">
                                <div className="mb-1 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                                        <div className="mt-0.5 text-base font-semibold text-gray-700">
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
                                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-gray-700">
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
                <section className="mb-8">
                    <h2 className="mb-4 border-l-4 border-slate-900 pl-4 text-xl font-bold uppercase tracking-wide text-slate-900">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex items-start justify-between border-l-2 border-gray-200 pl-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{edu.degree}</h3>
                                    <div className="mt-0.5 font-semibold text-gray-700">
                                        {edu.school} — {edu.field}
                                    </div>
                                    {edu.gpa && (
                                        <div className="mt-0.5 text-sm text-gray-600">GPA: {edu.gpa}</div>
                                    )}
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                    <div>{edu.location}</div>
                                    <div>
                                        {edu.startDate} - {edu.endDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Core Competencies */}
            {skills.length > 0 && (
                <section>
                    <h2 className="mb-4 border-l-4 border-slate-900 pl-4 text-xl font-bold uppercase tracking-wide text-slate-900">
                        Core Competencies
                    </h2>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm font-medium text-gray-800">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-2">
                                <span className="text-slate-900">▪</span>
                                {skill.name}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
