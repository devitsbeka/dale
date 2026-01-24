import type { TemplateProps } from '../types';

export function CreativeTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [] } = data;

    return (
        <div className="mx-auto max-w-[8.5in] bg-white font-sans">
            {/* Asymmetric Header with Bold Color */}
            <header className="relative bg-gradient-to-br from-purple-600 to-pink-500 px-12 pb-16 pt-12 text-white">
                <div className="relative z-10">
                    <h1 className="text-5xl font-black tracking-tight">
                        {personalInfo?.firstName}
                        <br />
                        {personalInfo?.lastName}
                    </h1>
                    <div className="mt-6 space-y-1.5 text-sm font-medium text-purple-100">
                        {personalInfo?.email && <div>✉ {personalInfo.email}</div>}
                        {personalInfo?.phone && <div>☎ {personalInfo.phone}</div>}
                        {personalInfo?.location && <div>📍 {personalInfo.location}</div>}
                        {personalInfo?.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
                        {personalInfo?.website && <div>🌐 {personalInfo.website}</div>}
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-white/10"></div>
            </header>

            <div className="p-12">
                {/* Summary */}
                {personalInfo?.summary && (
                    <section className="mb-10">
                        <h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-purple-600">
                            <span className="h-1.5 w-8 bg-gradient-to-r from-purple-600 to-pink-500"></span>
                            About Me
                        </h2>
                        <p className="text-base leading-relaxed text-gray-700">{personalInfo.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section className="mb-10">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-purple-600">
                            <span className="h-1.5 w-8 bg-gradient-to-r from-purple-600 to-pink-500"></span>
                            Experience
                        </h2>
                        <div className="space-y-8">
                            {experience.map((exp, idx) => (
                                <div key={exp.id} className="relative pl-6">
                                    <div
                                        className="absolute left-0 top-2 h-3 w-3 rounded-full"
                                        style={{
                                            background: `linear-gradient(135deg, rgb(147, 51, 234) ${idx * 20}%, rgb(236, 72, 153) 100%)`,
                                        }}
                                    ></div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                        <div className="mt-1 font-semibold text-purple-600">
                                            {exp.company} — {exp.location}
                                        </div>
                                        <div className="mt-0.5 text-sm font-medium text-gray-500">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                    </div>
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="mt-3 space-y-1.5 text-gray-700">
                                            {exp.achievements.map((achievement, achIdx) => (
                                                <li key={achIdx} className="ml-4 list-disc">
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
                    <section className="mb-10">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-purple-600">
                            <span className="h-1.5 w-8 bg-gradient-to-r from-purple-600 to-pink-500"></span>
                            Education
                        </h2>
                        <div className="space-y-6">
                            {education.map((edu) => (
                                <div key={edu.id} className="pl-6">
                                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                    <div className="mt-1 font-semibold text-purple-600">
                                        {edu.school} — {edu.field}
                                    </div>
                                    <div className="mt-0.5 text-sm font-medium text-gray-500">
                                        {edu.startDate} - {edu.endDate}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section>
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-purple-600">
                            <span className="h-1.5 w-8 bg-gradient-to-r from-purple-600 to-pink-500"></span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, idx) => (
                                <span
                                    key={skill.id}
                                    className="rounded-lg px-4 py-2 text-sm font-bold text-white"
                                    style={{
                                        background: `linear-gradient(135deg, rgb(147, 51, 234) ${idx * 10}%, rgb(236, 72, 153) 100%)`,
                                    }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
