import type { TemplateProps } from '../types';

export function ModernTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [] } = data;

    return (
        <div className="mx-auto max-w-[8.5in] bg-white p-12 font-sans text-gray-900">
            {/* Header */}
            <header className="border-b-2 border-blue-600 pb-6">
                <h1 className="text-4xl font-bold text-gray-900">
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.linkedin && (
                        <span className="text-blue-600">{personalInfo.linkedin}</span>
                    )}
                    {personalInfo?.website && (
                        <span className="text-blue-600">{personalInfo.website}</span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {personalInfo?.summary && (
                <section className="mt-8">
                    <h2 className="mb-3 text-xl font-semibold text-blue-600">Professional Summary</h2>
                    <p className="leading-relaxed text-gray-700">{personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold text-blue-600">Experience</h2>
                    <div className="space-y-6">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                                        <div className="text-base text-gray-700">{exp.company}</div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <div>{exp.location}</div>
                                        <div>
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
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
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold text-blue-600">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                                    <div className="text-base text-gray-700">
                                        {edu.school} - {edu.field}
                                    </div>
                                    {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
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

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold text-blue-600">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
