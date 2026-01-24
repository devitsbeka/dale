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
        <div>
            {/* Form Section */}
            <div>
                <div>
                    <h3>Work Experience</h3>
                    <p>
                        Add your work history, starting with your most recent position.
                    </p>
                </div>

                {/* Existing experiences */}
                {experiences.length > 0 && (
                    <div>
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                               
                            >
                                <div>
                                    <p>{exp.position}</p>
                                    <p>{exp.company}</p>
                                    <p>
                                        {exp.startDate} -{' '}
                                        {exp.current ? 'Present' : exp.endDate}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                   
                                >
                                    <Trash01 />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add new experience form */}
                <div>
                    <h4>Add Experience</h4>

                    <div>
                        <InputGroup>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                placeholder="Software Engineer"
                                value={formData.position || ''}
                                onChange={(value) => setFormData({ ...formData, position: value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Company</Label>
                            <Input
                                type="text"
                                placeholder="Acme Corp"
                                value={formData.company || ''}
                                onChange={(value) => setFormData({ ...formData, company: value })
                                }
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            placeholder="San Francisco, CA"
                            value={formData.location || ''}
                            onChange={(value) => setFormData({ ...formData, location: value })
                            }
                        />
                    </InputGroup>

                    <div>
                        <InputGroup>
                            <Label>Start Date</Label>
                            <Input
                                type="month"
                                value={formData.startDate || ''}
                                onChange={(value) => setFormData({ ...formData, startDate: value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>End Date</Label>
                            <Input
                                type="month"
                                value={formData.endDate || ''}
                                onChange={(value) => setFormData({ ...formData, endDate: value })
                                }
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
                    <div>
                        <div>
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

                        {(formData.achievements || ['']).map((achievement, index) => (
                            <div key={index}>
                                <Input
                                    type="text"
                                    placeholder="Led a team of 5 developers to ship feature X..."
                                    value={achievement}
                                    onChange={(value) => handleUpdateAchievement(index, value)
                                    }
                                />
                                {formData.achievements && formData.achievements.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveAchievement(index)}
                                       
                                    >
                                        <Trash01 />
                                    </button>
                                )}
                            </div>
                        ))}
                        <p>
                            Start with action verbs. Focus on measurable impact.
                        </p>
                    </div>

                    <Button color="secondary" onClick={handleAddExperience}>
                        Add This Experience
                    </Button>
                </div>

                {/* Navigation */}
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
                        Continue to Education
                    </Button>
                </div>
            </div>

            {/* Preview Section */}
            <div>
                <h4>Preview</h4>
                <div>
                    <h3>Work Experience</h3>
                    {experiences.length === 0 ? (
                        <p>
                            No experience added yet. Add your work history above.
                        </p>
                    ) : (
                        <div>
                            {experiences.map((exp) => (
                                <div key={exp.id}>
                                    <h4>{exp.position}</h4>
                                    <p>{exp.company}</p>
                                    <p>
                                        {exp.startDate} - {exp.endDate} • {exp.location}
                                    </p>
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
                    )}
                </div>
            </div>
        </div>
    );
}
