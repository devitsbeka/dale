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
        <div className="mx-auto aspect-[8.5/11] w-full overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-gray-200">
            <div className="h-full overflow-y-auto p-12">
                {/* Header */}
                <div className="mb-8 border-b-2 pb-6" style={{ borderColor: primaryColor }}>
                    <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
                        {personalInfo?.firstName || 'First'} {personalInfo?.lastName || 'Last'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                        {personalInfo?.email && (
                            <span className="flex items-center gap-1.5">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {personalInfo.email}
                            </span>
                        )}
                        {personalInfo?.phone && (
                            <>
                                {personalInfo?.email && <span className="text-gray-400">•</span>}
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {personalInfo.phone}
                                </span>
                            </>
                        )}
                        {personalInfo?.location && (
                            <>
                                {(personalInfo?.email || personalInfo?.phone) && <span className="text-gray-400">•</span>}
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {personalInfo.location}
                                </span>
                            </>
                        )}
                    </div>

                    {(personalInfo?.linkedin || personalInfo?.website) && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            {personalInfo?.linkedin && (
                                <a
                                    href={`https://${personalInfo.linkedin}`}
                                    className="flex items-center gap-1.5 font-medium transition hover:opacity-70"
                                    style={{ color: primaryColor }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                    LinkedIn
                                </a>
                            )}
                            {personalInfo?.website && (
                                <>
                                    {personalInfo?.linkedin && <span className="text-gray-400">•</span>}
                                    <a
                                        href={`https://${personalInfo.website}`}
                                        className="flex items-center gap-1.5 font-medium transition hover:opacity-70"
                                        style={{ color: primaryColor }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        {personalInfo.website}
                                    </a>
                                </>
                            )}
                        </div>
                    )}
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
                        <p className="leading-relaxed text-gray-700">
                            {personalInfo.summary}
                        </p>
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
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-gray-900">
                                                {exp.position}
                                            </h3>
                                            <p className="text-sm font-semibold text-gray-700">
                                                {exp.company}
                                                {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
                                            </p>
                                        </div>
                                        <div className="ml-4 shrink-0 text-right">
                                            <p className="text-sm font-medium text-gray-600">
                                                {exp.startDate} - {exp.endDate}
                                            </p>
                                        </div>
                                    </div>
                                    {exp.achievements.length > 0 && (
                                        <ul className="ml-4 space-y-1.5">
                                            {exp.achievements.map((achievement, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
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
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-gray-900">
                                                {edu.school}
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">{edu.degree}</span>
                                                {edu.field && <span> in {edu.field}</span>}
                                                {edu.gpa && <span className="text-gray-600"> • GPA: {edu.gpa}</span>}
                                            </p>
                                            {edu.location && (
                                                <p className="text-sm text-gray-600">{edu.location}</p>
                                            )}
                                        </div>
                                        <div className="ml-4 shrink-0 text-right">
                                            <p className="text-sm font-medium text-gray-600">
                                                {edu.startDate} - {edu.endDate}
                                            </p>
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
                            className="mb-4 text-lg font-bold uppercase tracking-wide"
                            style={{ color: primaryColor }}
                        >
                            Skills
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                                <div key={category} className="flex gap-3">
                                    <h4 className="w-32 shrink-0 text-sm font-bold capitalize text-gray-900">
                                        {category.replace('_', ' ')}:
                                    </h4>
                                    <p className="text-sm leading-relaxed text-gray-700">
                                        {categorySkills.map((s) => s.name).join(' • ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!personalInfo?.firstName && !personalInfo?.lastName && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                Your resume will appear here
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Start filling out the form to see your resume take shape
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
