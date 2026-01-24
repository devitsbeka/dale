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
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ borderColor: primaryColor }}>
                <h1>
                    {personalInfo?.firstName} {personalInfo?.lastName}
                </h1>
                <div>
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.linkedin && (
                        <a
                            href={`https://${personalInfo.linkedin}`}
                           
                        >
                            LinkedIn
                        </a>
                    )}
                    {personalInfo?.website && (
                        <a
                            href={`https://${personalInfo.website}`}
                           
                        >
                            Portfolio
                        </a>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {personalInfo?.summary && (
                <div>
                    <h2
                       
                        style={{ color: primaryColor }}
                    >
                        Professional Summary
                    </h2>
                    <p>{personalInfo.summary}</p>
                </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
                <div>
                    <h2
                       
                        style={{ color: primaryColor }}
                    >
                        Work Experience
                    </h2>
                    <div>
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div>
                                    <div>
                                        <h3>
                                            {exp.position}
                                        </h3>
                                        <p>{exp.company}</p>
                                    </div>
                                    <div>
                                        <p>
                                            {exp.startDate} - {exp.endDate}
                                        </p>
                                        <p>{exp.location}</p>
                                    </div>
                                </div>
                                {exp.achievements.length > 0 && (
                                    <ul>
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx}>
                                                <span>•</span>
                                                <span>{achievement}</span>
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
                <div>
                    <h2
                       
                        style={{ color: primaryColor }}
                    >
                        Education
                    </h2>
                    <div>
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div>
                                    <div>
                                        <h3>
                                            {edu.school}
                                        </h3>
                                        <p>
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                                        </p>
                                    </div>
                                    <div>
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
                <div>
                    <h2
                       
                        style={{ color: primaryColor }}
                    >
                        Skills
                    </h2>
                    <div>
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category}>
                                <h4>
                                    {category.replace('_', ' ')}:
                                </h4>
                                <p>
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
