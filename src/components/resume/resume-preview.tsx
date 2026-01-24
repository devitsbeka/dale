'use client';

import React from 'react';
import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
    data: Partial<ResumeData>;
}

export function ResumePreview({ data }: ResumePreviewProps) {
    const { personalInfo, experience = [], education = [], skills = [], customization } = data;

    const primaryColor = customization?.primaryColor || '#E9684B';
    const groupedSkills = skills.reduce(
        (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        },
        {} as Record<string, typeof skills>
    );

    return (
        <div className="bg-white p-12 shadow-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div className="mb-8 border-b-2 pb-6" style={{ borderColor: primaryColor }}>
                <h1 className="text-3xl font-bold text-gray-900">
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.linkedin && (
                        <a
                            href={`https://${personalInfo.linkedin}`}
                            className="text-blue-600 hover:underline"
                        >
                            LinkedIn
                        </a>
                    )}
                    {personalInfo?.website && (
                        <a
                            href={`https://${personalInfo.website}`}
                            className="text-blue-600 hover:underline"
                        >
                            Portfolio
                        </a>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {personalInfo?.summary && (
                <div className="mb-8">
                    <h2
                        className="mb-3 text-lg font-bold uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
                </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
                <div className="mb-8">
                    <h2
                        className="mb-4 text-lg font-bold uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Work Experience
                    </h2>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {exp.position}
                                        </h3>
                                        <p className="text-sm text-gray-700">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>
                                            {exp.startDate} - {exp.endDate}
                                        </p>
                                        <p>{exp.location}</p>
                                    </div>
                                </div>
                                {exp.achievements.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-gray-400">•</span>
                                                <span className="flex-1">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-8">
                    <h2
                        className="mb-4 text-lg font-bold uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Education
                    </h2>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {edu.school}
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>
                                            {edu.startDate} - {edu.endDate}
                                        </p>
                                        <p>{edu.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-8">
                    <h2
                        className="mb-4 text-lg font-bold uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Skills
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category}>
                                <h4 className="mb-1.5 text-sm font-semibold capitalize text-gray-700">
                                    {category.replace('_', ' ')}:
                                </h4>
                                <p className="text-sm text-gray-700">
                                    {categorySkills.map((s) => s.name).join(' • ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
