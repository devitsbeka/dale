'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/button';
import { Input, InputGroup } from '@/components/base/input';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Trash01 } from '@untitledui/icons/react';
import type { Education } from '@/types/resume';

interface EducationStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function EducationStep({ onNext, onPrevious }: EducationStepProps) {
    const { resumeData, addEducation, removeEducation, markStepComplete } = useResume();
    const educationList = resumeData.education || [];
    const [formData, setFormData] = useState<Partial<Education>>({
        school: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
    });

    const handleAddEducation = () => {
        if (formData.school && formData.degree) {
            const newEdu: Education = {
                id: Date.now().toString(),
                school: formData.school,
                degree: formData.degree,
                field: formData.field || '',
                location: formData.location || '',
                startDate: formData.startDate || '',
                endDate: formData.endDate || '',
                gpa: formData.gpa,
            };
            addEducation(newEdu);
            setFormData({
                school: '',
                degree: '',
                field: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
            });
        }
    };

    const handleNext = () => {
        markStepComplete('education');
        onNext();
    };

    return (
        <div className="grid gap-8 p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-md font-semibold text-primary">Education</h3>
                    <p className="text-sm text-tertiary">Add your educational background.</p>
                </div>

                {educationList.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {educationList.map((edu) => (
                            <div
                                key={edu.id}
                                className="flex items-start gap-3 rounded-lg border border-secondary bg-secondary/30 p-4"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-primary">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </p>
                                    <p className="text-sm text-secondary">{edu.school}</p>
                                    <p className="text-sm text-tertiary">
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="rounded p-1.5 text-error-500 outline-focus-ring transition hover:bg-error-50"
                                >
                                    <Trash01 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5">
                    <h4 className="text-sm font-semibold text-secondary">Add Education</h4>

                    <InputGroup>
                        <InputGroup.Label>School/University</InputGroup.Label>
                        <Input
                            type="text"
                            placeholder="University of California, Berkeley"
                            value={formData.school || ''}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        />
                    </InputGroup>

                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>Degree</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="Bachelor of Science"
                                value={formData.degree || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, degree: e.target.value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>Field of Study</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="Computer Science"
                                value={formData.field || ''}
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <InputGroup.Label>Location</InputGroup.Label>
                        <Input
                            type="text"
                            placeholder="Berkeley, CA"
                            value={formData.location || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                        />
                    </InputGroup>

                    <div className="grid gap-5 md:grid-cols-3">
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
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>GPA (Optional)</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="3.8"
                                value={formData.gpa || ''}
                                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            />
                        </InputGroup>
                    </div>

                    <Button variant="secondary" onClick={handleAddEducation}>
                        Add This Education
                    </Button>
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
                        Continue to Skills
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-secondary bg-secondary/30 p-6">
                <h4 className="mb-4 text-sm font-semibold text-secondary">Preview</h4>
                <div className="rounded-lg bg-white p-6 shadow-xs">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Education</h3>
                    {educationList.length === 0 ? (
                        <p className="text-sm text-gray-500">No education added yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {educationList.map((edu) => (
                                <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
                                    <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                                    <p className="text-sm text-gray-700">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {edu.startDate} - {edu.endDate} • {edu.location}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
