'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { CheckCircle } from '@untitledui/icons';

interface OnboardingData {
  dreamJob: string;
  location: string;
  remote: boolean;
  salaryMin: string;
  experience: string;
  skills: string[];
  industries: string[];
  linkedinUrl?: string;
}

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' },
];

const commonSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'MongoDB',
  'PostgreSQL',
  'Git',
  'CI/CD',
  'REST APIs',
];

const commonIndustries = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Marketing',
  'Consulting',
  'Startups',
  'Enterprise',
  'Government',
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    dreamJob: '',
    location: '',
    remote: true,
    salaryMin: '',
    experience: 'mid',
    skills: [],
    industries: [],
    linkedinUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Save preferences to backend
      // For now, store in localStorage
      localStorage.setItem('user_preferences', JSON.stringify(data));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.dreamJob.trim().length > 0;
      case 2:
        return data.location.trim().length > 0 || data.remote;
      case 3:
        return data.skills.length > 0;
      case 4:
        return data.industries.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to CareerOS, {user?.name || 'there'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Let's set up your job search preferences. This takes about 2 minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    s <= step
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {s < step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-full ${
                      s < step ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    style={{ width: '100px' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Dream Job</span>
            <span>Location</span>
            <span>Skills</span>
            <span>Industry</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Step 1: Dream Job */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  What's your dream job?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Be specific! e.g., "Senior React Developer at a startup" or "Product Manager in fintech"
                </p>
              </div>
              <div>
                <label htmlFor="dreamJob" className="sr-only">
                  Dream Job
                </label>
                <input
                  id="dreamJob"
                  type="text"
                  value={data.dreamJob}
                  onChange={(e) => setData({ ...data, dreamJob: e.target.value })}
                  placeholder="e.g., Senior Full Stack Engineer at a fast-growing startup"
                  className="block w-full rounded-md border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setData({ ...data, experience: level.value })}
                      className={`rounded-md border px-4 py-3 text-sm font-medium ${
                        data.experience === level.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Salary */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Where do you want to work?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tell us your location preferences and salary expectations
                </p>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.remote}
                    onChange={(e) => setData({ ...data, remote: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Open to remote positions
                  </span>
                </label>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Preferred Location (City or "Remote")
                </label>
                <input
                  id="location"
                  type="text"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="e.g., San Francisco, New York, or Remote"
                  className="mt-1 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">
                  Minimum Salary (USD)
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    id="salaryMin"
                    type="number"
                    value={data.salaryMin}
                    onChange={(e) => setData({ ...data, salaryMin: e.target.value })}
                    placeholder="100,000"
                    className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  What are your top skills?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select all that apply. Choose at least 3 skills.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium ${
                      data.skills.includes(skill)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Selected: {data.skills.length} skill{data.skills.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Step 4: Industries & LinkedIn */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Which industries interest you?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred industries. Choose at least 1.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {commonIndustries.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleIndustryToggle(industry)}
                    className={`rounded-md border px-4 py-2 text-sm font-medium ${
                      data.industries.includes(industry)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6">
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile (Optional)
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  We'll use this to pre-fill your resume with your experience
                </p>
                <input
                  id="linkedinUrl"
                  type="url"
                  value={data.linkedinUrl}
                  onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-2 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
