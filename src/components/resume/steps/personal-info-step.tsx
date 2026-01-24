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
        <div>
            {/* Form Section */}
            <div>
                <div>
                    <h3>Personal Information</h3>
                    <p>
                        Tell us about yourself. This information will appear at the top of your resume.
                    </p>
                </div>

                <div>
                    {/* Name fields */}
                    <div>
                        <InputGroup>
                            <Label>First name</Label>
                            <Input
                                type="text"
                                placeholder="John"
                                value={personalInfo.firstName || ''}
                                onChange={(value) => updatePersonalInfo({ firstName: value })
                                }
                                isRequired
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Last name</Label>
                            <Input
                                type="text"
                                placeholder="Doe"
                                value={personalInfo.lastName || ''}
                                onChange={(value) => updatePersonalInfo({ lastName: value })
                                }
                                isRequired
                            />
                        </InputGroup>
                    </div>

                    {/* Contact fields */}
                    <div>
                        <InputGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                value={personalInfo.email || ''}
                                onChange={(value) => updatePersonalInfo({ email: value })}
                                isRequired
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Phone</Label>
                            <Input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={personalInfo.phone || ''}
                                onChange={(value) => updatePersonalInfo({ phone: value })}
                                isRequired
                            />
                        </InputGroup>
                    </div>

                    <InputGroup>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            placeholder="San Francisco, CA"
                            value={personalInfo.location || ''}
                            onChange={(value) => updatePersonalInfo({ location: value })}
                        />
                        <HintText>
                            City and state/country (optional but recommended)
                        </HintText>
                    </InputGroup>

                    {/* Optional fields */}
                    <div>
                        <InputGroup>
                            <Label>LinkedIn</Label>
                            <Input
                                type="url"
                                placeholder="linkedin.com/in/johndoe"
                                value={personalInfo.linkedin || ''}
                                onChange={(value) => updatePersonalInfo({ linkedin: value })
                                }
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Website/Portfolio</Label>
                            <Input
                                type="url"
                                placeholder="johndoe.com"
                                value={personalInfo.website || ''}
                                onChange={(value) => updatePersonalInfo({ website: value })}
                            />
                        </InputGroup>
                    </div>

                    {/* Professional summary */}
                    <InputGroup>
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

                {/* Navigation */}
                <div>
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

            {/* Preview Section */}
            <div>
                <h4>Preview</h4>
                <div>
                    <div>
                        <h2>
                            {personalInfo.firstName && personalInfo.lastName
                                ? `${personalInfo.firstName} ${personalInfo.lastName}`
                                : 'Your Name'}
                        </h2>
                        <div>
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.email && personalInfo.phone && (
                                <span>•</span>
                            )}
                            {personalInfo.phone && <span>{personalInfo.phone}</span>}
                            {(personalInfo.email || personalInfo.phone) &&
                                personalInfo.location && (
                                    <span>•</span>
                                )}
                            {personalInfo.location && <span>{personalInfo.location}</span>}
                        </div>
                        {(personalInfo.linkedin || personalInfo.website) && (
                            <div>
                                {personalInfo.linkedin && (
                                    <a href="#">
                                        LinkedIn
                                    </a>
                                )}
                                {personalInfo.linkedin && personalInfo.website && (
                                    <span>•</span>
                                )}
                                {personalInfo.website && (
                                    <a href="#">
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        )}
                        {personalInfo.summary && (
                            <p>
                                {personalInfo.summary}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
