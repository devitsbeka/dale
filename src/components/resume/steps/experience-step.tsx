'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { HintText } from '@/components/base/input/hint-text';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, Trash01, Edit05 } from '@untitledui/icons';
import type { WorkExperience } from '@/types/resume';

interface ExperienceStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function ExperienceStep({ onNext, onPrevious }: ExperienceStepProps) {
    const { resumeData, addExperience, updateExperience, removeExperience, markStepComplete } = useResume();
    const experiences = resumeData.experience || [];
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAddNew = () => {
        const newExp: WorkExperience = {
            id: Date.now().toString(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: [],
        };
        addExperience(newExp);
        setEditingId(newExp.id);
    };

    const handleNext = () => {
        markStepComplete('experience');
        onNext();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-primary">Work Experience</h3>
                <p className="mt-1 text-sm text-tertiary">
                    Add your work history, starting with your most recent position.
                </p>
            </div>

            {/* Existing experiences */}
            {experiences.length > 0 && (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            experience={exp}
                            isEditing={editingId === exp.id}
                            onEdit={() => setEditingId(exp.id)}
                            onSave={() => setEditingId(null)}
                            onDelete={() => removeExperience(exp.id)}
                            onUpdate={(updates) => updateExperience(exp.id, updates)}
                        />
                    ))}
                </div>
            )}

            {/* Add new experience button */}
            <Button
                color="secondary"
                onClick={handleAddNew}
                iconLeading={Plus}
            >
                Add Experience
            </Button>

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
                    Continue to Education
                </Button>
            </div>
        </div>
    );
}

interface ExperienceCardProps {
    experience: WorkExperience;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDelete: () => void;
    onUpdate: (updates: Partial<WorkExperience>) => void;
}

function ExperienceCard({ experience, isEditing, onEdit, onSave, onDelete, onUpdate }: ExperienceCardProps) {
    const [localExp, setLocalExp] = useState(experience);

    const handleBlur = (field: keyof WorkExperience, value: any) => {
        onUpdate({ [field]: value });
    };

    const handleAddAchievement = () => {
        const newAchievements = [...localExp.achievements, ''];
        setLocalExp({ ...localExp, achievements: newAchievements });
        onUpdate({ achievements: newAchievements });
    };

    const handleUpdateAchievement = (index: number, value: string) => {
        const newAchievements = [...localExp.achievements];
        newAchievements[index] = value;
        setLocalExp({ ...localExp, achievements: newAchievements });
    };

    const handleAchievementBlur = (index: number, value: string) => {
        const newAchievements = [...localExp.achievements];
        newAchievements[index] = value;
        onUpdate({ achievements: newAchievements.filter(a => a.trim() !== '') });
    };

    const handleRemoveAchievement = (index: number) => {
        const newAchievements = localExp.achievements.filter((_, i) => i !== index);
        setLocalExp({ ...localExp, achievements: newAchievements });
        onUpdate({ achievements: newAchievements });
    };

    if (!isEditing) {
        return (
            <div className="flex items-start justify-between rounded-lg border border-secondary bg-secondary/30 p-4">
                <div className="flex-1">
                    <p className="font-semibold text-primary">{experience.position || 'Untitled Position'}</p>
                    <p className="text-sm text-secondary">{experience.company || 'Company'}</p>
                    {experience.location && (
                        <p className="text-xs text-tertiary">{experience.location}</p>
                    )}
                    <p className="text-xs text-tertiary">
                        {experience.startDate || 'Start'} - {experience.current ? 'Present' : experience.endDate || 'End'}
                    </p>
                    {experience.achievements.length > 0 && (
                        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-secondary">
                            {experience.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="ml-4 flex gap-2">
                    <Button
                        color="tertiary"
                        size="sm"
                        onClick={onEdit}
                        iconLeading={Edit05}
                        aria-label="Edit"
                    />
                    <Button
                        color="tertiary-destructive"
                        size="sm"
                        onClick={onDelete}
                        iconLeading={Trash01}
                        aria-label="Delete"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 rounded-lg border border-secondary bg-secondary/10 p-6">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-secondary">Edit Experience</h4>
                <Button
                    color="link-gray"
                    size="sm"
                    onClick={onSave}
                >
                    Done
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup className="w-full">
                    <Label>Job Title</Label>
                    <Input
                        type="text"
                        placeholder="Software Engineer"
                        value={localExp.position}
                        onChange={(value) => setLocalExp({ ...localExp, position: value })}
                        onBlur={() => handleBlur('position', localExp.position)}
                        isRequired
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>Company</Label>
                    <Input
                        type="text"
                        placeholder="Acme Corp"
                        value={localExp.company}
                        onChange={(value) => setLocalExp({ ...localExp, company: value })}
                        onBlur={() => handleBlur('company', localExp.company)}
                        isRequired
                    />
                </InputGroup>
            </div>

            <InputGroup className="w-full">
                <Label>Location</Label>
                <Input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={localExp.location}
                    onChange={(value) => setLocalExp({ ...localExp, location: value })}
                    onBlur={() => handleBlur('location', localExp.location)}
                />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup className="w-full">
                    <Label>Start Date</Label>
                    <Input
                        type="month"
                        value={localExp.startDate}
                        onChange={(value) => setLocalExp({ ...localExp, startDate: value })}
                        onBlur={() => handleBlur('startDate', localExp.startDate)}
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>End Date</Label>
                    <Input
                        type="month"
                        value={localExp.endDate}
                        onChange={(value) => setLocalExp({ ...localExp, endDate: value })}
                        onBlur={() => handleBlur('endDate', localExp.endDate)}
                        isDisabled={localExp.current}
                    />
                </InputGroup>
            </div>

            <Checkbox
                isSelected={localExp.current}
                onChange={(checked) => {
                    setLocalExp({ ...localExp, current: checked });
                    onUpdate({ current: checked, endDate: checked ? 'Present' : localExp.endDate });
                }}
            >
                I currently work here
            </Checkbox>

            {/* Achievements */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
                    <Button
                        color="link-gray"
                        size="sm"
                        iconLeading={Plus}
                        onClick={handleAddAchievement}
                    >
                        Add Achievement
                    </Button>
                </div>

                <div className="space-y-3">
                    {localExp.achievements.length === 0 ? (
                        <InputGroup>
                            <Input
                                type="text"
                                placeholder="Led a team of 5 developers to ship feature X..."
                                value=""
                                onChange={(value) => {
                                    setLocalExp({ ...localExp, achievements: [value] });
                                }}
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value.trim()) {
                                        onUpdate({ achievements: [value] });
                                    }
                                }}
                            />
                        </InputGroup>
                    ) : (
                        localExp.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <InputGroup className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Led a team of 5 developers to ship feature X..."
                                        value={achievement}
                                        onChange={(value) => handleUpdateAchievement(index, value)}
                                        onBlur={() => handleAchievementBlur(index, achievement)}
                                    />
                                </InputGroup>
                                {localExp.achievements.length > 1 && (
                                    <Button
                                        color="tertiary-destructive"
                                        size="sm"
                                        onClick={() => handleRemoveAchievement(index)}
                                        iconLeading={Trash01}
                                        aria-label="Remove achievement"
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
                <HintText>
                    Start with action verbs. Focus on measurable impact.
                </HintText>
            </div>
        </div>
    );
}
