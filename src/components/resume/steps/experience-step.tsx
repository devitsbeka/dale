'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/button';
import { Input, InputGroup } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';
import { Checkbox } from '@/components/base/checkbox';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, Trash01 } from '@untitledui/icons/react';
import type { WorkExperience } from '@/types/resume';

interface ExperienceStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function ExperienceStep({ onNext, onPrevious }: ExperienceStepProps) {
    const { resumeData, addExperience, updateExperience, removeExperience, markStepComplete } =
        useResume();
    const experiences = resumeData.experience || [];
    const [editingId, setEditingId] = useState<string | null>(null);
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
        <div className="grid gap-8 p-6 lg:grid-cols-2">
            {/* Form Section */}
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-md font-semibold text-primary">Work Experience</h3>
                    <p className="text-sm text-tertiary">
                        Add your work history, starting with your most recent position.
                    </p>
                </div>

                {/* Existing experiences */}
                {experiences.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="flex items-start gap-3 rounded-lg border border-secondary bg-secondary/30 p-4"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-primary">{exp.position}</p>
                                    <p className="text-sm text-secondary">{exp.company}</p>
                                    <p className="text-sm text-tertiary">
                                        {exp.startDate} -{' '}
                                        {exp.current ? 'Present' : exp.endDate}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="rounded p-1.5 text-error-500 outline-focus-ring transition hover:bg-error-50 focus-visible:outline-2"
                                >
                                    <Trash01 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add new experience form */}
                <div className="flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5">
                    <h4 className="text-sm font-semibold text-secondary">Add Experience</h4>

                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>Job Title</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="Software Engineer"
                                value={formData.position || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, position: e.target.value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>Company</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="Acme Corp"
                                value={formData.company || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, company: e.target.value })
                                }
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <InputGroup.Label>Location</InputGroup.Label>
                        <Input
                            type="text"
                            placeholder="San Francisco, CA"
                            value={formData.location || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                        />
                    </InputGroup>

                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>Start Date</InputGroup.Label>
                            <Input
                                type="month"
                                value={formData.startDate || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: e.target.value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>End Date</InputGroup.Label>
                            <Input
                                type="month"
                                value={formData.endDate || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: e.target.value })
                                }
                                disabled={formData.current}
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
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <InputGroup.Label>Key Achievements</InputGroup.Label>
                            <Button
                                variant="link"
                                size="sm"
                                iconLeading={Plus}
                                onClick={handleAddAchievement}
                            >
                                Add Achievement
                            </Button>
                        </div>

                        {(formData.achievements || ['']).map((achievement, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Led a team of 5 developers to ship feature X..."
                                    value={achievement}
                                    onChange={(e) =>
                                        handleUpdateAchievement(index, e.target.value)
                                    }
                                />
                                {formData.achievements && formData.achievements.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveAchievement(index)}
                                        className="rounded p-2 text-error-500 outline-focus-ring transition hover:bg-error-50"
                                    >
                                        <Trash01 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <p className="text-xs text-tertiary">
                            Start with action verbs. Focus on measurable impact.
                        </p>
                    </div>

                    <Button variant="secondary" onClick={handleAddExperience}>
                        Add This Experience
                    </Button>
                </div>

                {/* Navigation */}
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
                        Continue to Education
                    </Button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="rounded-xl border border-secondary bg-secondary/30 p-6">
                <h4 className="mb-4 text-sm font-semibold text-secondary">Preview</h4>
                <div className="rounded-lg bg-white p-6 shadow-xs">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Work Experience</h3>
                    {experiences.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No experience added yet. Add your work history above.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="border-l-2 border-gray-300 pl-4">
                                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                    <p className="text-sm text-gray-700">{exp.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {exp.startDate} - {exp.endDate} • {exp.location}
                                    </p>
                                    {exp.achievements.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                            {exp.achievements.map((achievement, idx) => (
                                                <li key={idx} className="flex gap-2">
                                                    <span className="text-gray-400">•</span>
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
