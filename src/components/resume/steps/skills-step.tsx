'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/button';
import { Input, InputGroup } from '@/components/base/input';
import { Select } from '@/components/base/select';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, X } from '@untitledui/icons/react';
import type { Skill } from '@/types/resume';

interface SkillsStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

const SKILL_CATEGORIES = [
    { value: 'technical', label: 'Technical' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'language', label: 'Language' },
    { value: 'tool', label: 'Tools & Software' },
];

const SUGGESTED_SKILLS = {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'],
    soft: [
        'Leadership',
        'Communication',
        'Problem Solving',
        'Teamwork',
        'Project Management',
    ],
    language: ['English', 'Spanish', 'Mandarin', 'French', 'German'],
    tool: ['Figma', 'Jira', 'Slack', 'VS Code', 'Photoshop', 'Excel'],
};

export function SkillsStep({ onNext, onPrevious }: SkillsStepProps) {
    const { resumeData, addSkill, removeSkill, markStepComplete } = useResume();
    const skills = resumeData.skills || [];
    const [skillName, setSkillName] = useState('');
    const [skillCategory, setSkillCategory] = useState<Skill['category']>('technical');

    const handleAddSkill = () => {
        if (skillName.trim()) {
            const newSkill: Skill = {
                id: Date.now().toString(),
                name: skillName.trim(),
                category: skillCategory,
            };
            addSkill(newSkill);
            setSkillName('');
        }
    };

    const handleAddSuggested = (name: string, category: Skill['category']) => {
        if (!skills.find((s) => s.name === name)) {
            addSkill({
                id: Date.now().toString(),
                name,
                category,
            });
        }
    };

    const handleNext = () => {
        markStepComplete('skills');
        onNext();
    };

    const groupedSkills = skills.reduce(
        (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        },
        {} as Record<string, Skill[]>
    );

    return (
        <div className="grid gap-8 p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-md font-semibold text-primary">Skills</h3>
                    <p className="text-sm text-tertiary">
                        Add skills relevant to the positions you're applying for.
                    </p>
                </div>

                {/* Added skills */}
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category} className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium text-secondary capitalize">
                            {category.replace('_', ' ')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200"
                                >
                                    <span>{skill.name}</span>
                                    <button
                                        onClick={() => removeSkill(skill.id)}
                                        className="rounded outline-focus-ring transition hover:text-brand-900"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Add skill form */}
                <div className="flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5">
                    <h4 className="text-sm font-semibold text-secondary">Add Skill</h4>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <InputGroup>
                                <InputGroup.Label>Skill Name</InputGroup.Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., React, Leadership, Spanish"
                                    value={skillName}
                                    onChange={(e) => setSkillName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                />
                            </InputGroup>
                        </div>

                        <InputGroup>
                            <InputGroup.Label>Category</InputGroup.Label>
                            <Select
                                value={skillCategory}
                                onChange={(e) =>
                                    setSkillCategory(e.target.value as Skill['category'])
                                }
                            >
                                {SKILL_CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </Select>
                        </InputGroup>
                    </div>

                    <Button variant="secondary" onClick={handleAddSkill} iconLeading={Plus}>
                        Add Skill
                    </Button>
                </div>

                {/* Suggested skills */}
                <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-secondary/30 p-5">
                    <h4 className="text-sm font-semibold text-secondary">Suggested Skills</h4>

                    {SKILL_CATEGORIES.map((category) => (
                        <div key={category.value} className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-tertiary">{category.label}</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_SKILLS[
                                    category.value as keyof typeof SUGGESTED_SKILLS
                                ].map((skillName) => {
                                    const alreadyAdded = skills.find((s) => s.name === skillName);
                                    return (
                                        <button
                                            key={skillName}
                                            onClick={() =>
                                                handleAddSuggested(
                                                    skillName,
                                                    category.value as Skill['category']
                                                )
                                            }
                                            disabled={!!alreadyAdded}
                                            className={`rounded-lg px-3 py-1.5 text-sm outline-focus-ring transition ${
                                                alreadyAdded
                                                    ? 'cursor-not-allowed bg-secondary text-quaternary opacity-50'
                                                    : 'cursor-pointer bg-primary text-secondary ring-1 ring-secondary hover:bg-secondary'
                                            }`}
                                        >
                                            {skillName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between gap-3 border-t border-secondary pt-5">
                    <Button
                        variant="link"
                        size="lg"
                        onClick={onPrevious}
                        iconLeading={ChevronLeft}
                    >
                        Back
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleNext}
                        iconTrailing={ChevronRight}
                    >
                        Continue to Customize
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-secondary bg-secondary/30 p-6">
                <h4 className="mb-4 text-sm font-semibold text-secondary">Preview</h4>
                <div className="rounded-lg bg-white p-6 shadow-xs">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Skills</h3>
                    {skills.length === 0 ? (
                        <p className="text-sm text-gray-500">No skills added yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                                <div key={category}>
                                    <h4 className="mb-2 text-sm font-semibold capitalize text-gray-700">
                                        {category.replace('_', ' ')}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded bg-gray-100 px-2.5 py-1 text-sm text-gray-700"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
