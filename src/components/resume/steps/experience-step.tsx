'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { HintText } from '@/components/base/input/hint-text';
import { TextArea } from '@/components/base/textarea/textarea';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, Trash01 } from '@untitledui/icons';
import type { WorkExperience } from '@/types/resume';

interface ExperienceStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function ExperienceStep({ onNext, onPrevious }: ExperienceStepProps) {
    const { resumeData, addExperience, removeExperience, markStepComplete } = useResume();
    const experiences = resumeData.experience || [];
    const [formData, setFormData] = useState<Partial<WorkExperience>>({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        achievements: [''],
    });

    const handleAddExperience = () => {
        if (formData.company && formData.position) {
            const newExp: WorkExperience = {
                id: Date.now().toString(),
                company: formData.company,
                position: formData.position,
                location: formData.location || '',
                startDate: formData.startDate || '',
                endDate: formData.current ? 'Present' : formData.endDate || '',
                current: formData.current || false,
                achievements: formData.achievements?.filter((a) => a.trim() !== '') || [],
            };
            addExperience(newExp);
            setFormData({
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                achievements: [''],
            });
        }
    };

    const handleAddAchievement = () => {
        setFormData({
            ...formData,
            achievements: [...(formData.achievements || []), ''],
        });
    };

    const handleUpdateAchievement = (index: number, value: string) => {
        const newAchievements = [...(formData.achievements || [])];
        newAchievements[index] = value;
        setFormData({ ...formData, achievements: newAchievements });
    };

    const handleRemoveAchievement = (index: number) => {
        const newAchievements = (formData.achievements || []).filter((_, i) => i !== index);
        setFormData({ ...formData, achievements: newAchievements });
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
                        <div
                            key={exp.id}
                            className="flex items-start justify-between rounded-lg border border-secondary bg-secondary/30 p-4"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-primary">{exp.position}</p>
                                <p className="text-sm text-secondary">{exp.company}</p>
                                <p className="text-xs text-tertiary">
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                            </div>
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="ml-4 rounded-lg p-2 text-tertiary outline-focus-ring transition hover:bg-error-50 hover:text-error-600 focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <Trash01 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add new experience form */}
            <div className="space-y-6 rounded-lg border border-secondary bg-secondary/10 p-6">
                <h4 className="text-sm font-semibold text-secondary">Add Experience</h4>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup className="w-full max-w-[300px]">
                        <Label>Job Title</Label>
                        <Input
                            type="text"
                            placeholder="Software Engineer"
                            value={formData.position || ''}
                            onChange={(value) => setFormData({ ...formData, position: value })}
                            isRequired
                        />
                    </InputGroup>

                    <InputGroup className="w-full max-w-[300px]">
                        <Label>Company</Label>
                        <Input
                            type="text"
                            placeholder="Acme Corp"
                            value={formData.company || ''}
                            onChange={(value) => setFormData({ ...formData, company: value })}
                            isRequired
                        />
                    </InputGroup>
                </div>

                <InputGroup className="w-full max-w-[300px]">
                    <Label>Location</Label>
                    <Input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={formData.location || ''}
                        onChange={(value) => setFormData({ ...formData, location: value })}
                    />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup className="w-full max-w-[300px]">
                        <Label>Start Date</Label>
                        <Input
                            type="month"
                            value={formData.startDate || ''}
                            onChange={(value) => setFormData({ ...formData, startDate: value })}
                        />
                    </InputGroup>

                    <InputGroup className="w-full max-w-[300px]">
                        <Label>End Date</Label>
                        <Input
                            type="month"
                            value={formData.endDate || ''}
                            onChange={(value) => setFormData({ ...formData, endDate: value })}
                            isDisabled={formData.current}
                        />
                    </InputGroup>
                </div>

                <Checkbox
                    isSelected={formData.current || false}
                    onChange={(checked) => setFormData({ ...formData, current: checked })}
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
                        {(formData.achievements || ['']).map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <Input
                                    type="text"
                                    placeholder="Led a team of 5 developers to ship feature X..."
                                    value={achievement}
                                    onChange={(value) => handleUpdateAchievement(index, value)}
                                    className="flex-1"
                                />
                                {formData.achievements && formData.achievements.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveAchievement(index)}
                                        className="mt-1 rounded-lg p-2 text-tertiary outline-focus-ring transition hover:text-error-600 focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        <Trash01 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <HintText>
                        Start with action verbs. Focus on measurable impact.
                    </HintText>
                </div>

                <Button
                    color="secondary"
                    onClick={handleAddExperience}
                    isDisabled={!formData.company || !formData.position}
                >
                    Add This Experience
                </Button>
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
                    Continue to Education
                </Button>
            </div>
        </div>
    );
}
