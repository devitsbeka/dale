'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { HintText } from '@/components/base/input/hint-text';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Trash01 } from '@untitledui/icons';
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
        <div>
            <div>
                <div>
                    <h3>Education</h3>
                    <p>Add your educational background.</p>
                </div>

                {educationList.length > 0 && (
                    <div>
                        {educationList.map((edu) => (
                            <div
                                key={edu.id}
                               
                            >
                                <div>
                                    <p>
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </p>
                                    <p>{edu.school}</p>
                                    <p>
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                   
                                >
                                    <Trash01 />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <h4>Add Education</h4>

                    <InputGroup>
                        <Label>School/University</Label>
                        <Input
                            type="text"
                            placeholder="University of California, Berkeley"
                            value={formData.school || ''}
                            onChange={(value) => setFormData({ ...formData, school: value })}
                        />
                    </InputGroup>

                    <div>
                        <InputGroup>
                            <Label>Degree</Label>
                            <Input
                                type="text"
                                placeholder="Bachelor of Science"
                                value={formData.degree || ''}
                                onChange={(value) => setFormData({ ...formData, degree: value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Field of Study</Label>
                            <Input
                                type="text"
                                placeholder="Computer Science"
                                value={formData.field || ''}
                                onChange={(value) => setFormData({ ...formData, field: value })}
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            placeholder="Berkeley, CA"
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
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>GPA (Optional)</Label>
                            <Input
                                type="text"
                                placeholder="3.8"
                                value={formData.gpa || ''}
                                onChange={(value) => setFormData({ ...formData, gpa: value })}
                            />
                        </InputGroup>
                    </div>

                    <Button color="secondary" onClick={handleAddEducation}>
                        Add This Education
                    </Button>
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
                        Continue to Skills
                    </Button>
                </div>
            </div>

            <div>
                <h4>Preview</h4>
                <div>
                    <h3>Education</h3>
                    {educationList.length === 0 ? (
                        <p>No education added yet.</p>
                    ) : (
                        <div>
                            {educationList.map((edu) => (
                                <div key={edu.id}>
                                    <h4>{edu.school}</h4>
                                    <p>
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </p>
                                    <p>
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
