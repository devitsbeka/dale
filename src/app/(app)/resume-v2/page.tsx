'use client';

import { useState } from 'react';
import { AVAILABLE_TEMPLATES } from '@/lib/template-engine/types';
import { TemplateRenderer } from '@/lib/template-engine/template-renderer';
import type { ResumeData } from '@/types/resume';
import { ExperienceTab } from '@/components/resume-v2/experience-tab';
import { EducationTab } from '@/components/resume-v2/education-tab';
import { SkillsTab } from '@/components/resume-v2/skills-tab';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    summary: string;

    experience: Array<{
        id: string;
        position: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        achievements: string[];
    }>;

    education: Array<{
        id: string;
        school: string;
        degree: string;
        field: string;
        location: string;
        startDate: string;
        endDate: string;
        gpa?: string;
    }>;

    skills: Array<{
        id: string;
        name: string;
        category: 'technical' | 'soft' | 'language' | 'tool';
    }>;

    template: string;
    color: string;
    font: string;
    isDummyData: boolean;
}

const COLORS = [
    { id: 'coral', name: 'Coral', value: '#E9684B' },
    { id: 'azure', name: 'Azure', value: '#3B82F6' },
    { id: 'emerald', name: 'Emerald', value: '#059669' },
    { id: 'indigo', name: 'Indigo', value: '#6366F1' },
    { id: 'purple', name: 'Purple', value: '#8B5CF6' },
    { id: 'slate', name: 'Slate', value: '#334155' },
];

const FONTS = [
    { id: 'inter', name: 'Inter', value: 'Inter, sans-serif' },
    { id: 'roboto', name: 'Roboto', value: 'Roboto, sans-serif' },
    { id: 'lato', name: 'Lato', value: 'Lato, sans-serif' },
    { id: 'opensans', name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
    { id: 'merriweather', name: 'Merriweather', value: 'Merriweather, serif' },
];

const RONALD_DUMP_DATA: FormData = {
    firstName: 'Ronald',
    lastName: 'Dump',
    email: 'ronald.dump@gmail.com',
    phone: '+1 (415) 555-DUMP',
    summary: '10x unicorn software engineer from San Francisco with FAANG pedigree. Built systems serving billions of users. Expert in distributed systems, microservices, and making things go brrrr.',

    experience: [
        {
            id: '1',
            position: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            startDate: '2021-06',
            endDate: '',
            current: true,
            achievements: [
                'Led migration of critical search infrastructure to Kubernetes, reducing costs by $2M annually',
                'Built real-time ML pipeline processing 100M+ events/day with 99.99% uptime',
                'Mentored 5 junior engineers, 3 promoted to mid-level within 1 year',
            ]
        },
        {
            id: '2',
            position: 'Software Engineer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            startDate: '2019-03',
            endDate: '2021-05',
            current: false,
            achievements: [
                'Designed and shipped messaging features used by 500M+ monthly active users',
                'Optimized React Native performance, improving app launch time by 40%',
                'On-call hero: resolved 15 SEV-1 incidents with average mitigation time of 12 minutes',
            ]
        },
        {
            id: '3',
            position: 'Software Engineer',
            company: 'Netflix',
            location: 'Los Gatos, CA',
            startDate: '2017-01',
            endDate: '2019-02',
            current: false,
            achievements: [
                'Built content recommendation microservice handling 1B+ requests/day',
                'Implemented A/B testing framework used by 50+ product teams',
                'Reduced video streaming latency by 25% through CDN optimization',
            ]
        }
    ],

    education: [
        {
            id: '1',
            school: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            location: 'Stanford, CA',
            startDate: '2015',
            endDate: '2017',
            gpa: '3.9'
        },
        {
            id: '2',
            school: 'UC Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2011',
            endDate: '2015',
            gpa: '3.8'
        }
    ],

    skills: [
        { id: '1', name: 'Distributed Systems', category: 'technical' },
        { id: '2', name: 'React/TypeScript', category: 'technical' },
        { id: '3', name: 'Kubernetes/Docker', category: 'technical' },
        { id: '4', name: 'Python/Go/Java', category: 'technical' },
        { id: '5', name: 'System Design', category: 'technical' },
        { id: '6', name: 'Leadership', category: 'soft' },
        { id: '7', name: 'Communication', category: 'soft' },
        { id: '8', name: 'PostgreSQL/Redis', category: 'tool' },
    ],

    template: 'modern',
    color: '#3B82F6',
    font: 'inter',
    isDummyData: true
};

export default function ResumeV2Page() {
    const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'customize'>('info');
    const [data, setData] = useState<FormData>(RONALD_DUMP_DATA);

    const handleFormInteraction = () => {
        if (data.isDummyData) {
            setData(prev => ({
                ...prev,
                isDummyData: false,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                summary: '',
                experience: [],
                education: [],
                skills: []
            }));
        }
    };

    const updateField = (field: keyof FormData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // Convert form data to ResumeData format for templates
    const resumeData: Partial<ResumeData> = {
        personalInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            location: '',
            linkedin: '',
            website: '',
            summary: data.summary,
        },
        customization: {
            template: data.template,
            primaryColor: data.color,
            font: data.font,
            sectionOrder: ['experience', 'education', 'skills'],
        },
        experience: data.experience.map(exp => ({
            id: exp.id,
            position: exp.position,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            achievements: exp.achievements,
        })),
        education: data.education.map(edu => ({
            id: edu.id,
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            location: edu.location,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa,
        })),
        skills: data.skills,
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Panel - Form */}
            <div className="w-[500px] bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Resume Builder v2</h1>
                    <p className="text-sm text-gray-600 mt-1">Clean, working implementation</p>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'info'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('experience')}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'experience'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Experience
                    </button>
                    <button
                        onClick={() => setActiveTab('education')}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'education'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Education
                    </button>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'skills'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Skills
                    </button>
                    <button
                        onClick={() => setActiveTab('customize')}
                        className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                            activeTab === 'customize'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Customize
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={data.firstName}
                                    onChange={(e) => {
                                        handleFormInteraction();
                                        updateField('firstName', e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={data.lastName}
                                    onChange={(e) => {
                                        handleFormInteraction();
                                        updateField('lastName', e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => {
                                        handleFormInteraction();
                                        updateField('email', e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => {
                                        handleFormInteraction();
                                        updateField('phone', e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="555-1234"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Summary
                                </label>
                                <textarea
                                    value={data.summary}
                                    onChange={(e) => {
                                        handleFormInteraction();
                                        updateField('summary', e.target.value);
                                    }}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="Brief professional summary..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <ExperienceTab
                            data={data.experience}
                            onChange={(experience) => setData(prev => ({ ...prev, experience }))}
                            onInteraction={handleFormInteraction}
                        />
                    )}

                    {activeTab === 'education' && (
                        <EducationTab
                            data={data.education}
                            onChange={(education) => setData(prev => ({ ...prev, education }))}
                            onInteraction={handleFormInteraction}
                        />
                    )}

                    {activeTab === 'skills' && (
                        <SkillsTab
                            data={data.skills}
                            onChange={(skills) => setData(prev => ({ ...prev, skills }))}
                            onInteraction={handleFormInteraction}
                        />
                    )}

                    {activeTab === 'customize' && (
                        <div className="space-y-6">
                            {/* Templates */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Choose Template
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {AVAILABLE_TEMPLATES.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => {
                                                updateField('template', template.id);
                                                updateField('color', template.accentColor);
                                            }}
                                            className={`p-3 border-2 rounded-lg text-left transition-all ${
                                                data.template === template.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-semibold text-gray-900 text-sm">
                                                {template.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {template.description.substring(0, 30)}...
                                            </div>
                                            <div
                                                className="mt-2 h-1 rounded"
                                                style={{ backgroundColor: template.accentColor }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Accent Color
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => updateField('color', color.value)}
                                            className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                                                data.color === color.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: color.value }}
                                            />
                                            <span className="font-medium text-gray-900">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fonts */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Font</h3>
                                <div className="space-y-2">
                                    {FONTS.map((font) => (
                                        <button
                                            key={font.id}
                                            onClick={() => updateField('font', font.id)}
                                            className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                                                data.font === font.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div
                                                className="font-semibold text-gray-900"
                                                style={{ fontFamily: font.value }}
                                            >
                                                {font.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Live Template Preview */}
                        <TemplateRenderer templateId={data.template} data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
