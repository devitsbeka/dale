'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Label } from '@/components/base/input/label';
import { HintText } from '@/components/base/input/hint-text';
import { TextArea } from '@/components/base/textarea/textarea';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight } from '@untitledui/icons';
import type { PersonalInfo } from '@/types/resume';

interface PersonalInfoStepProps {
    onNext: () => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
    const { resumeData, updatePersonalInfo, markStepComplete } = useResume();
    const personalInfo = resumeData.personalInfo || ({} as PersonalInfo);

    const handleNext = () => {
        markStepComplete('personal');
        onNext();
    };

    const isValid =
        personalInfo.firstName &&
        personalInfo.lastName &&
        personalInfo.email &&
        personalInfo.phone;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
                <p className="mt-1 text-sm text-tertiary">
                    Tell us about yourself. This information will appear at the top of your resume.
                </p>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup className="w-full">
                        <Label>First name</Label>
                        <Input
                            type="text"
                            placeholder="John"
                            value={personalInfo.firstName || ''}
                            onChange={(value) => updatePersonalInfo({ firstName: value })}
                            isRequired
                        />
                    </InputGroup>

                    <InputGroup className="w-full">
                        <Label>Last name</Label>
                        <Input
                            type="text"
                            placeholder="Doe"
                            value={personalInfo.lastName || ''}
                            onChange={(value) => updatePersonalInfo({ lastName: value })}
                            isRequired
                        />
                    </InputGroup>
                </div>

                {/* Contact fields */}
                <InputGroup className="w-full">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={personalInfo.email || ''}
                        onChange={(value) => updatePersonalInfo({ email: value })}
                        isRequired
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>Phone</Label>
                    <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={personalInfo.phone || ''}
                        onChange={(value) => updatePersonalInfo({ phone: value })}
                        isRequired
                    />
                </InputGroup>

                <InputGroup className="w-full">
                    <Label>Location</Label>
                    <Input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={personalInfo.location || ''}
                        onChange={(value) => updatePersonalInfo({ location: value })}
                    />
                    <HintText>City and state/country (optional but recommended)</HintText>
                </InputGroup>

                {/* Optional fields */}
                <div className="border-t border-secondary pt-6">
                    <h4 className="mb-4 text-sm font-semibold text-secondary">
                        Optional Information
                    </h4>
                    <div className="space-y-6">
                        <InputGroup className="w-full">
                            <Label>LinkedIn</Label>
                            <Input
                                type="url"
                                placeholder="linkedin.com/in/johndoe"
                                value={personalInfo.linkedin || ''}
                                onChange={(value) => updatePersonalInfo({ linkedin: value })}
                            />
                        </InputGroup>

                        <InputGroup className="w-full">
                            <Label>Website</Label>
                            <Input
                                type="url"
                                placeholder="johndoe.com or portfolio link"
                                value={personalInfo.website || ''}
                                onChange={(value) => updatePersonalInfo({ website: value })}
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* Professional summary */}
                <div className="border-t border-secondary pt-6">
                    <InputGroup className="w-full">
                        <Label>Professional Summary</Label>
                        <TextArea
                            placeholder="A brief overview of your professional background and career goals (2-3 sentences)..."
                            value={personalInfo.summary || ''}
                            onChange={(value) => updatePersonalInfo({ summary: value })}
                            rows={4}
                        />
                        <HintText>
                            Keep it concise and impactful. Focus on your key strengths and what
                            you bring to the role.
                        </HintText>
                    </InputGroup>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end border-t border-secondary pt-6">
                <Button
                    color="primary"
                    size="lg"
                    onClick={handleNext}
                    isDisabled={!isValid}
                    iconTrailing={ChevronRight}
                >
                    Continue to Experience
                </Button>
            </div>
        </div>
    );
}
