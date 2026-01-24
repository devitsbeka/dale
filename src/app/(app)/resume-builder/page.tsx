'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { ChevronRight, ChevronLeft, Plus, Trash01 } from '@untitledui/icons';

// Simple, safe types
interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
}

interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
}

interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

interface ResumeData {
    personal: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: string[];
}

const INITIAL_DATA: ResumeData = {
    personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        title: ''
    },
    experience: [],
    education: [],
    skills: []
};

export default function ResumeBuilderPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);

    const updatePersonal = (field: keyof PersonalInfo, value: string) => {
        setData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const addExperience = () => {
        const newExp: Experience = {
            id: Date.now().toString(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: ['']
        };
        setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const removeExperience = (id: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const addAchievement = (expId: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? { ...exp, achievements: [...exp.achievements, ''] }
                    : exp
            )
        }));
    };

    const updateAchievement = (expId: string, index: number, value: string) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? {
                        ...exp,
                        achievements: exp.achievements.map((ach, i) =>
                            i === index ? value : ach
                        )
                    }
                    : exp
            )
        }));
    };

    const removeAchievement = (expId: string, index: number) => {
        setData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === expId
                    ? {
                        ...exp,
                        achievements: exp.achievements.filter((_, i) => i !== index)
                    }
                    : exp
            )
        }));
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: ''
        };
        setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const removeEducation = (id: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const addSkill = () => {
        setData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };

    const updateSkill = (index: number, value: string) => {
        setData(prev => ({
            ...prev,
            skills: prev.skills.map((skill, i) => (i === index ? value : skill))
        }));
    };

    const removeSkill = (index: number) => {
        setData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="flex h-screen overflow-hidden bg-primary">
            {/* Left Panel - Form */}
            <div className="flex w-[700px] flex-col border-r border-secondary">
                {/* Header */}
                <div className="border-b border-secondary bg-primary px-8 py-6">
                    <h1 className="text-2xl font-semibold text-primary">Resume Builder</h1>
                    <p className="mt-1 text-sm text-tertiary">Create your professional resume</p>
                </div>

                {/* Step Indicator */}
                <div className="border-b border-secondary bg-secondary/10 px-8 py-4">
                    <div className="flex gap-4">
                        {['Personal Info', 'Experience', 'Education', 'Skills'].map((label, idx) => (
                            <button
                                key={idx}
                                onClick={() => setStep(idx + 1)}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                                    step === idx + 1
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-secondary/50 text-secondary hover:bg-secondary'
                                }`}
                            >
                                <span className="text-sm font-medium">{idx + 1}</span>
                                <span className="text-sm">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-primary">Personal Information</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup>
                                    <Label>First Name</Label>
                                    <Input
                                        type="text"
                                        value={data.personal.firstName}
                                        onChange={(val) => updatePersonal('firstName', val)}
                                        placeholder="John"
                                    />
                                </InputGroup>

                                <InputGroup>
                                    <Label>Last Name</Label>
                                    <Input
                                        type="text"
                                        value={data.personal.lastName}
                                        onChange={(val) => updatePersonal('lastName', val)}
                                        placeholder="Doe"
                                    />
                                </InputGroup>
                            </div>

                            <InputGroup>
                                <Label>Professional Title</Label>
                                <Input
                                    type="text"
                                    value={data.personal.title}
                                    onChange={(val) => updatePersonal('title', val)}
                                    placeholder="Senior Software Engineer"
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.personal.email}
                                    onChange={(val) => updatePersonal('email', val)}
                                    placeholder="john@example.com"
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Phone</Label>
                                <Input
                                    type="tel"
                                    value={data.personal.phone}
                                    onChange={(val) => updatePersonal('phone', val)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Location</Label>
                                <Input
                                    type="text"
                                    value={data.personal.location}
                                    onChange={(val) => updatePersonal('location', val)}
                                    placeholder="San Francisco, CA"
                                />
                            </InputGroup>
                        </div>
                    )}

                    {/* Step 2: Experience */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primary">Work Experience</h2>
                                <Button color="primary" size="sm" onClick={addExperience} iconLeading={Plus}>
                                    Add Experience
                                </Button>
                            </div>

                            {data.experience.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-secondary bg-secondary/10 p-8 text-center">
                                    <p className="text-sm text-tertiary">No experience added yet</p>
                                    <Button className="mt-4" color="secondary" onClick={addExperience}>
                                        Add Your First Experience
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="rounded-lg border border-secondary bg-secondary/10 p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-primary">Experience Entry</h3>
                                                <Button
                                                    color="tertiary-destructive"
                                                    size="sm"
                                                    onClick={() => removeExperience(exp.id)}
                                                    iconLeading={Trash01}
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup>
                                                        <Label>Job Title</Label>
                                                        <Input
                                                            type="text"
                                                            value={exp.position}
                                                            onChange={(val) => updateExperience(exp.id, 'position', val)}
                                                            placeholder="Software Engineer"
                                                        />
                                                    </InputGroup>

                                                    <InputGroup>
                                                        <Label>Company</Label>
                                                        <Input
                                                            type="text"
                                                            value={exp.company}
                                                            onChange={(val) => updateExperience(exp.id, 'company', val)}
                                                            placeholder="Acme Corp"
                                                        />
                                                    </InputGroup>
                                                </div>

                                                <InputGroup>
                                                    <Label>Location</Label>
                                                    <Input
                                                        type="text"
                                                        value={exp.location}
                                                        onChange={(val) => updateExperience(exp.id, 'location', val)}
                                                        placeholder="San Francisco, CA"
                                                    />
                                                </InputGroup>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup>
                                                        <Label>Start Date</Label>
                                                        <Input
                                                            type="month"
                                                            value={exp.startDate}
                                                            onChange={(val) => updateExperience(exp.id, 'startDate', val)}
                                                        />
                                                    </InputGroup>

                                                    <InputGroup>
                                                        <Label>End Date</Label>
                                                        <Input
                                                            type="month"
                                                            value={exp.endDate}
                                                            onChange={(val) => updateExperience(exp.id, 'endDate', val)}
                                                            isDisabled={exp.current}
                                                        />
                                                    </InputGroup>
                                                </div>

                                                {/* Achievements */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Key Achievements</Label>
                                                        <Button
                                                            color="link-gray"
                                                            size="sm"
                                                            onClick={() => addAchievement(exp.id)}
                                                            iconLeading={Plus}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>

                                                    {exp.achievements.map((achievement, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <textarea
                                                                value={achievement}
                                                                onChange={(e) => updateAchievement(exp.id, idx, e.target.value)}
                                                                placeholder="Led a team of 5 developers..."
                                                                className="flex-1 rounded-lg border border-secondary bg-primary p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                                rows={2}
                                                            />
                                                            {exp.achievements.length > 1 && (
                                                                <Button
                                                                    color="tertiary-destructive"
                                                                    size="sm"
                                                                    onClick={() => removeAchievement(exp.id, idx)}
                                                                    iconLeading={Trash01}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Education */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primary">Education</h2>
                                <Button color="primary" size="sm" onClick={addEducation} iconLeading={Plus}>
                                    Add Education
                                </Button>
                            </div>

                            {data.education.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-secondary bg-secondary/10 p-8 text-center">
                                    <p className="text-sm text-tertiary">No education added yet</p>
                                    <Button className="mt-4" color="secondary" onClick={addEducation}>
                                        Add Your First Education
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {data.education.map((edu) => (
                                        <div key={edu.id} className="rounded-lg border border-secondary bg-secondary/10 p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-primary">Education Entry</h3>
                                                <Button
                                                    color="tertiary-destructive"
                                                    size="sm"
                                                    onClick={() => removeEducation(edu.id)}
                                                    iconLeading={Trash01}
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <InputGroup>
                                                    <Label>School</Label>
                                                    <Input
                                                        type="text"
                                                        value={edu.school}
                                                        onChange={(val) => updateEducation(edu.id, 'school', val)}
                                                        placeholder="University of California"
                                                    />
                                                </InputGroup>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup>
                                                        <Label>Degree</Label>
                                                        <Input
                                                            type="text"
                                                            value={edu.degree}
                                                            onChange={(val) => updateEducation(edu.id, 'degree', val)}
                                                            placeholder="Bachelor of Science"
                                                        />
                                                    </InputGroup>

                                                    <InputGroup>
                                                        <Label>Field of Study</Label>
                                                        <Input
                                                            type="text"
                                                            value={edu.field}
                                                            onChange={(val) => updateEducation(edu.id, 'field', val)}
                                                            placeholder="Computer Science"
                                                        />
                                                    </InputGroup>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputGroup>
                                                        <Label>Start Date</Label>
                                                        <Input
                                                            type="month"
                                                            value={edu.startDate}
                                                            onChange={(val) => updateEducation(edu.id, 'startDate', val)}
                                                        />
                                                    </InputGroup>

                                                    <InputGroup>
                                                        <Label>End Date</Label>
                                                        <Input
                                                            type="month"
                                                            value={edu.endDate}
                                                            onChange={(val) => updateEducation(edu.id, 'endDate', val)}
                                                        />
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Skills */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primary">Skills</h2>
                                <Button color="primary" size="sm" onClick={addSkill} iconLeading={Plus}>
                                    Add Skill
                                </Button>
                            </div>

                            {data.skills.length === 0 ? (
                                <div className="rounded-lg border-2 border-dashed border-secondary bg-secondary/10 p-8 text-center">
                                    <p className="text-sm text-tertiary">No skills added yet</p>
                                    <Button className="mt-4" color="secondary" onClick={addSkill}>
                                        Add Your First Skill
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.skills.map((skill, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={skill}
                                                onChange={(val) => updateSkill(idx, val)}
                                                placeholder="e.g. React, TypeScript, Node.js"
                                                className="flex-1"
                                            />
                                            <Button
                                                color="tertiary-destructive"
                                                size="sm"
                                                onClick={() => removeSkill(idx)}
                                                iconLeading={Trash01}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between border-t border-secondary bg-primary px-8 py-6">
                    <Button
                        color="secondary"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        isDisabled={step === 1}
                        iconLeading={ChevronLeft}
                    >
                        Previous
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => setStep(Math.min(4, step + 1))}
                        isDisabled={step === 4}
                        iconTrailing={ChevronRight}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex flex-1 flex-col bg-secondary/30">
                <div className="border-b border-secondary bg-primary px-8 py-4">
                    <h2 className="text-sm font-semibold text-primary">Preview</h2>
                    <p className="text-xs text-tertiary">See your resume in real-time</p>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto max-w-[800px] rounded-lg bg-white p-12 shadow-lg">
                        {/* Header */}
                        <div className="border-b border-gray-200 pb-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {data.personal.firstName} {data.personal.lastName}
                            </h1>
                            {data.personal.title && (
                                <p className="mt-2 text-lg text-gray-600">{data.personal.title}</p>
                            )}
                            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                                {data.personal.email && <span>{data.personal.email}</span>}
                                {data.personal.phone && <span>{data.personal.phone}</span>}
                                {data.personal.location && <span>{data.personal.location}</span>}
                            </div>
                        </div>

                        {/* Experience */}
                        {data.experience.length > 0 && (
                            <div className="mt-8">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Experience</h2>
                                <div className="space-y-6">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                                </div>
                                                <div className="text-right text-sm text-gray-600">
                                                    <p>{exp.location}</p>
                                                    <p>
                                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                    </p>
                                                </div>
                                            </div>
                                            {exp.achievements.filter(a => a.trim()).length > 0 && (
                                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                                    {exp.achievements
                                                        .filter(a => a.trim())
                                                        .map((achievement, idx) => (
                                                            <li key={idx}>{achievement}</li>
                                                        ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {data.education.length > 0 && (
                            <div className="mt-8">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu) => (
                                        <div key={edu.id} className="flex justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-gray-600">
                                                <p>
                                                    {edu.startDate} - {edu.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {data.skills.filter(s => s.trim()).length > 0 && (
                            <div className="mt-8">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills
                                        .filter(s => s.trim())
                                        .map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
