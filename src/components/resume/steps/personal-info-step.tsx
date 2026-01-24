'use client';

import React from 'react';
import { Button } from '@/components/base/button';
import { Input, InputGroup } from '@/components/base/input';
import { Textarea } from '@/components/base/textarea';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight } from '@untitledui/icons/react';

interface PersonalInfoStepProps {
    onNext: () => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
    const { resumeData, updatePersonalInfo, markStepComplete } = useResume();
    const personalInfo = resumeData.personalInfo || {};

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
        <div className="grid gap-8 p-6 lg:grid-cols-2">
            {/* Form Section */}
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-md font-semibold text-primary">Personal Information</h3>
                    <p className="text-sm text-tertiary">
                        Tell us about yourself. This information will appear at the top of your resume.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Name fields */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>First name</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="John"
                                value={personalInfo.firstName || ''}
                                onChange={(e) =>
                                    updatePersonalInfo({ firstName: e.target.value })
                                }
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>Last name</InputGroup.Label>
                            <Input
                                type="text"
                                placeholder="Doe"
                                value={personalInfo.lastName || ''}
                                onChange={(e) =>
                                    updatePersonalInfo({ lastName: e.target.value })
                                }
                                required
                            />
                        </InputGroup>
                    </div>

                    {/* Contact fields */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>Email</InputGroup.Label>
                            <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                value={personalInfo.email || ''}
                                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>Phone</InputGroup.Label>
                            <Input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={personalInfo.phone || ''}
                                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                                required
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <InputGroup.Label>Location</InputGroup.Label>
                        <Input
                            type="text"
                            placeholder="San Francisco, CA"
                            value={personalInfo.location || ''}
                            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                        />
                        <InputGroup.HintText>
                            City and state/country (optional but recommended)
                        </InputGroup.HintText>
                    </InputGroup>

                    {/* Optional fields */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <InputGroup>
                            <InputGroup.Label>LinkedIn</InputGroup.Label>
                            <Input
                                type="url"
                                placeholder="linkedin.com/in/johndoe"
                                value={personalInfo.linkedin || ''}
                                onChange={(e) =>
                                    updatePersonalInfo({ linkedin: e.target.value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Label>Website/Portfolio</InputGroup.Label>
                            <Input
                                type="url"
                                placeholder="johndoe.com"
                                value={personalInfo.website || ''}
                                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                            />
                        </InputGroup>
                    </div>

                    {/* Professional summary */}
                    <InputGroup>
                        <InputGroup.Label>Professional Summary</InputGroup.Label>
                        <Textarea
                            placeholder="A brief overview of your professional background and career goals (2-3 sentences)..."
                            value={personalInfo.summary || ''}
                            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                            rows={4}
                        />
                        <InputGroup.HintText>
                            Keep it concise and impactful. Focus on your key strengths and what
                            you bring to the role.
                        </InputGroup.HintText>
                    </InputGroup>
                </div>

                {/* Navigation */}
                <div className="flex justify-end gap-3 border-t border-secondary pt-5">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleNext}
                        disabled={!isValid}
                        iconTrailing={ChevronRight}
                    >
                        Continue to Experience
                    </Button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="rounded-xl border border-secondary bg-secondary/30 p-6">
                <h4 className="mb-4 text-sm font-semibold text-secondary">Preview</h4>
                <div className="rounded-lg bg-white p-6 shadow-xs">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900">
                            {personalInfo.firstName && personalInfo.lastName
                                ? `${personalInfo.firstName} ${personalInfo.lastName}`
                                : 'Your Name'}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.email && personalInfo.phone && (
                                <span className="text-gray-400">•</span>
                            )}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {(personalInfo.email || personalInfo.phone) &&
                                personalInfo.location && (
                                    <span className="text-gray-400">•</span>
                                )}
                            {personalInfo.location && <span>{personalInfo.location}</span>}
                        </div>
                        {(personalInfo.linkedin || personalInfo.website) && (
                            <div className="flex flex-wrap gap-2 text-sm text-blue-600">
                                {personalInfo.linkedin && (
                                    <a href="#" className="hover:underline">
                                        LinkedIn
                                    </a>
                                )}
                                {personalInfo.linkedin && personalInfo.website && (
                                    <span className="text-gray-400">•</span>
                                )}
                                {personalInfo.website && (
                                    <a href="#" className="hover:underline">
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        )}
                        {personalInfo.summary && (
                            <p className="mt-4 text-sm leading-relaxed text-gray-700">
                                {personalInfo.summary}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
