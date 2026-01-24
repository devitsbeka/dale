'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Plus, Trash01, Edit05 } from '@untitledui/icons';
import type { Education } from '@/types/resume';

interface EducationStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export function EducationStep({ onNext, onPrevious }: EducationStepProps) {
    const { resumeData, addEducation, updateEducation, removeEducation, markStepComplete } = useResume();
    const educationList = resumeData.education || [];
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAddNew = () => {
        const newEdu: Education = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
        };
        addEducation(newEdu);
        setEditingId(newEdu.id);
    };

    const handleNext = () => {
        markStepComplete('education');
        onNext();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-primary">Education</h3>
                <p className="mt-1 text-sm text-tertiary">
                    Add your educational background.
                </p>
            </div>

            {/* Existing education */}
            {educationList.length > 0 && (
                <div className="space-y-4">
                    {educationList.map((edu) => (
                        <EducationCard
                            key={edu.id}
                            education={edu}
                            isEditing={editingId === edu.id}
                            onEdit={() => setEditingId(edu.id)}
                            onSave={() => setEditingId(null)}
                            onDelete={() => removeEducation(edu.id)}
                            onUpdate={(updates) => updateEducation(edu.id, updates)}
                        />
                    ))}
                </div>
            )}

            {/* Add new education button */}
            <Button
                color="secondary"
                onClick={handleAddNew}
                iconLeading={Plus}
            >
                Add Education
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
                    Continue to Skills
                </Button>
            </div>
        </div>
    );
}

interface EducationCardProps {
    education: Education;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDelete: () => void;
    onUpdate: (updates: Partial<Education>) => void;
}

function EducationCard({ education, isEditing, onEdit, onSave, onDelete, onUpdate }: EducationCardProps) {
    const [localEdu, setLocalEdu] = useState(education);

    const handleBlur = (field: keyof Education, value: any) => {
        onUpdate({ [field]: value });
    };

    if (!isEditing) {
        return (
            <div className="flex items-start justify-between rounded-lg border border-secondary bg-secondary/30 p-4">
                <div className="flex-1">
                    <p className="font-semibold text-primary">
                        {education.degree || 'Degree'} {education.field && `in ${education.field}`}
                    </p>
                    <p className="text-sm text-secondary">{education.school || 'School'}</p>
                    {education.location && (
                        <p className="text-xs text-tertiary">{education.location}</p>
                    )}
                    <p className="text-xs text-tertiary">
                        {education.startDate || 'Start'} - {education.endDate || 'End'}
                    </p>
                    {education.gpa && (
                        <p className="text-xs text-tertiary">GPA: {education.gpa}</p>
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
                <h4 className="text-sm font-semibold text-secondary">Edit Education</h4>
                <Button
                    color="link-gray"
                    size="sm"
                    onClick={onSave}
                >
                    Done
                </Button>
            </div>

            <InputGroup className="w-full">
                <Label>School</Label>
                <Input
                    type="text"
                    placeholder="University of California, Berkeley"
                    value={localEdu.school}
                    onChange={(value) => setLocalEdu({ ...localEdu, school: value })}
                    onBlur={() => handleBlur('school', localEdu.school)}
                    isRequired
                />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup className="w-full">
                    <Label>Degree</Label>
                    <Input
                        type="text"
                        placeholder="Bachelor of Science"
                        value={localEdu.degree}
                        onChange={(value) => setLocalEdu({ ...localEdu, degree: value })}
                        onBlur={() => handleBlur('degree', localEdu.degree)}
                        isRequired
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>Field</Label>
                    <Input
                        type="text"
                        placeholder="Computer Science"
                        value={localEdu.field}
                        onChange={(value) => setLocalEdu({ ...localEdu, field: value })}
                        onBlur={() => handleBlur('field', localEdu.field)}
                    />
                </InputGroup>
            </div>

            <InputGroup className="w-full">
                <Label>Location</Label>
                <Input
                    type="text"
                    placeholder="Berkeley, CA"
                    value={localEdu.location}
                    onChange={(value) => setLocalEdu({ ...localEdu, location: value })}
                    onBlur={() => handleBlur('location', localEdu.location)}
                />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup className="w-full">
                    <Label>Start Date</Label>
                    <Input
                        type="month"
                        value={localEdu.startDate}
                        onChange={(value) => setLocalEdu({ ...localEdu, startDate: value })}
                        onBlur={() => handleBlur('startDate', localEdu.startDate)}
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>End Date</Label>
                    <Input
                        type="month"
                        value={localEdu.endDate}
                        onChange={(value) => setLocalEdu({ ...localEdu, endDate: value })}
                        onBlur={() => handleBlur('endDate', localEdu.endDate)}
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>GPA (Optional)</Label>
                    <Input
                        type="text"
                        placeholder="3.8"
                        value={localEdu.gpa || ''}
                        onChange={(value) => setLocalEdu({ ...localEdu, gpa: value })}
                        onBlur={() => handleBlur('gpa', localEdu.gpa)}
                    />
                </InputGroup>
            </div>
        </div>
    );
}
