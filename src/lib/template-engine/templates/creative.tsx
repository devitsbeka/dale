import type { TemplateProps } from '../types';
import { getFontFamily } from '../template-utils';

export function CreativeTemplate({ data }: TemplateProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;
    const accentColor = customization?.primaryColor || '#8B5CF6';
    const fontFamily = getFontFamily(customization?.font);

    return (
        <div className="mx-auto max-w-[8.5in] bg-white" style={{ fontFamily }}>
            {/* Bold Gradient Side Panel */}
            <div className="flex">
                {/* Left Sidebar - 35% width */}
                <div
                    className="w-[35%] px-8 py-12 text-white"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`
                    }}
                >
                    <h1 className="text-4xl font-black leading-tight">
                        {personalInfo?.firstName}
                        <br />
                        {personalInfo?.lastName}
                    </h1>

                    <div className="mt-8 space-y-3 text-sm opacity-95">
                        {personalInfo?.email && <div className="break-all">✉ {personalInfo.email}</div>}
                        {personalInfo?.phone && <div>☎ {personalInfo.phone}</div>}
                        {personalInfo?.location && <div>📍 {personalInfo.location}</div>}
                        {personalInfo?.linkedin && <div className="break-all">🔗 {personalInfo.linkedin}</div>}
                        {personalInfo?.website && <div className="break-all">🌐 {personalInfo.website}</div>}
                    </div>

                    {/* Skills in Sidebar */}
                    {skills.length > 0 && (
                        <div className="mt-10">
                            <h2 className="mb-4 text-xl font-black">SKILLS</h2>
                            <div className="space-y-2">
                                {skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold backdrop-blur-sm"
                                    >
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content - 65% width */}
                <div className="w-[65%] px-10 py-12">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section className="mb-8">
                            <h2
                                className="mb-3 text-2xl font-black uppercase"
                                style={{ color: accentColor }}
                            >
                                About
                            </h2>
                            <p className="text-base leading-relaxed text-gray-700">
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section className="mb-8">
                            <h2
                                className="mb-5 text-2xl font-black uppercase"
                                style={{ color: accentColor }}
                            >
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-4 border-l-4" style={{ borderColor: `${accentColor}40` }}>
                                        <div
                                            className="absolute -left-[7px] top-1 h-3 w-3 rounded-full"
                                            style={{ backgroundColor: accentColor }}
                                        ></div>
                                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                        <div className="mt-1 font-semibold" style={{ color: accentColor }}>
                                            {exp.company} • {exp.location}
                                        </div>
                                        <div className="mt-0.5 text-sm text-gray-500">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
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
                        <section>
                            <h2
                                className="mb-5 text-2xl font-black uppercase"
                                style={{ color: accentColor }}
                            >
                                Education
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                                        <div className="mt-1 font-semibold" style={{ color: accentColor }}>
                                            {edu.school} • {edu.field}
                                        </div>
                                        <div className="mt-0.5 text-sm text-gray-500">
                                            {edu.startDate} - {edu.endDate}
                                            {edu.gpa && ` • GPA: ${edu.gpa}`}
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
