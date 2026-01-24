'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { Select } from '@/components/base/select/select';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, X } from '@untitledui/icons';
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
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [skillName, setSkillName] = useState('');
    const [skillCategory, setSkillCategory] = useState<Skill['category']>('technical');

    const handleAddCustomSkill = () => {
        if (skillName.trim()) {
            const newSkill: Skill = {
                id: Date.now().toString(),
                name: skillName.trim(),
                category: skillCategory,
            };
            addSkill(newSkill);
            setSkillName('');
            setIsAddingCustom(false);
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-primary">Skills</h3>
                <p className="mt-1 text-sm text-tertiary">
                    Add skills relevant to the positions you're applying for.
                </p>
            </div>

            {/* Added skills */}
            {Object.keys(groupedSkills).length > 0 && (
                <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category} className="space-y-2">
                            <h4 className="text-sm font-semibold text-secondary capitalize">
                                {category.replace('_', ' ')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="flex items-center gap-2 rounded-lg border border-secondary bg-secondary/30 px-3 py-1.5"
                                    >
                                        <span className="text-sm text-primary">{skill.name}</span>
                                        <Button
                                            color="tertiary-destructive"
                                            size="sm"
                                            onClick={() => removeSkill(skill.id)}
                                            iconLeading={X}
                                            aria-label="Remove skill"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add custom skill inline */}
            {!isAddingCustom ? (
                <Button
                    color="secondary"
                    onClick={() => setIsAddingCustom(true)}
                    iconLeading={Plus}
                >
                    Add Custom Skill
                </Button>
            ) : (
                <div className="space-y-4 rounded-lg border border-secondary bg-secondary/10 p-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-secondary">Add Custom Skill</h4>
                        <Button
                            color="link-gray"
                            size="sm"
                            onClick={() => {
                                setIsAddingCustom(false);
                                setSkillName('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup className="w-full">
                            <Label>Skill Name</Label>
                            <Input
                                type="text"
                                placeholder="e.g., React, Leadership, Spanish"
                                value={skillName}
                                onChange={(value) => setSkillName(value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCustomSkill();
                                    }
                                }}
                            />
                        </InputGroup>

                        <div className="w-full">
                            <Select
                                label="Category"
                                value={skillCategory}
                                onChange={(value) => setSkillCategory(value as Skill['category'])}
                            >
                                {SKILL_CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Button
                        color="secondary"
                        onClick={handleAddCustomSkill}
                        iconLeading={Plus}
                        isDisabled={!skillName.trim()}
                    >
                        Add Skill
                    </Button>
                </div>
            )}

            {/* Suggested skills */}
            <div className="space-y-6 rounded-lg border border-secondary bg-secondary/10 p-6">
                <h4 className="text-sm font-semibold text-secondary">Suggested Skills</h4>

                <div className="space-y-4">
                    {SKILL_CATEGORIES.map((category) => (
                        <div key={category.value} className="space-y-2">
                            <p className="text-sm font-medium text-secondary">{category.label}</p>
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
            </div>

            {/* Navigation */}
            <div className="flex justify-between border-t border-secondary pt-6">
                <Button
                    color="link-gray"
                    size="lg"
                    onClick={onPrevious}
                    iconLeading={ChevronLeft}
                >
                    Back
                </Button>
                <Button
                    color="primary"
                    size="lg"
                    onClick={handleNext}
                    iconTrailing={ChevronRight}
                >
                    Continue to Customize
                </Button>
            </div>
        </div>
    );
}
