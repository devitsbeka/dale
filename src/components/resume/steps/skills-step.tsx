'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { HintText } from '@/components/base/input/hint-text';
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
        <div>
            <div>
                <div>
                    <h3>Skills</h3>
                    <p>
                        Add skills relevant to the positions you're applying for.
                    </p>
                </div>

                {/* Added skills */}
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category}>
                        <h4>
                            {category.replace('_', ' ')}
                        </h4>
                        <div>
                            {categorySkills.map((skill) => (
                                <div
                                    key={skill.id}
                                   
                                >
                                    <span>{skill.name}</span>
                                    <button
                                        onClick={() => removeSkill(skill.id)}
                                       
                                    >
                                        <X />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Add skill form */}
                <div>
                    <h4>Add Skill</h4>

                    <div>
                        <div>
                            <InputGroup>
                                <Label>Skill Name</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., React, Leadership, Spanish"
                                    value={skillName}
                                    onChange={(value) => setSkillName(value)}
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
                            <Label>Category</Label>
                            <Select
                                value={skillCategory}
                                onChange={(value) => setSkillCategory(value as Skill['category'])
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

                    <Button color="secondary" onClick={handleAddSkill} iconLeading={Plus}>
                        Add Skill
                    </Button>
                </div>

                {/* Suggested skills */}
                <div>
                    <h4>Suggested Skills</h4>

                    {SKILL_CATEGORIES.map((category) => (
                        <div key={category.value}>
                            <p>{category.label}</p>
                            <div>
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

                <div>
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

            <div>
                <h4>Preview</h4>
                <div>
                    <h3>Skills</h3>
                    {skills.length === 0 ? (
                        <p>No skills added yet.</p>
                    ) : (
                        <div>
                            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                                <div key={category}>
                                    <h4>
                                        {category.replace('_', ' ')}
                                    </h4>
                                    <div>
                                        {categorySkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                               
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
