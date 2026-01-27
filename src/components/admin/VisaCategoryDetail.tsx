'use client';

import { useState, useEffect } from 'react';

interface VisaCategoryDetailProps {
  visaCategoryId: string | null;
  countryCode: string;
  onClose: () => void;
  isDark?: boolean;
}

export const VisaCategoryDetail = ({
  visaCategoryId,
  countryCode,
  onClose,
  isDark = false
}: VisaCategoryDetailProps) => {
  const [visaData, setVisaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'process' | 'jobs'>('overview');

  useEffect(() => {
    if (!visaCategoryId) return;

    const fetchVisaDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/visa-categories/${visaCategoryId}`);
        const data = await response.json();
        setVisaData(data.visaCategory);
      } catch (error) {
        console.error('Error fetching visa details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisaDetails();
  }, [visaCategoryId]);

  if (!visaCategoryId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl rounded-lg shadow-xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {loading ? 'Loading...' : visaData?.name}
              </h2>
              <p className={`text-sm mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {visaData?.countryName} • {visaData?.type}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className={`flex gap-1 p-4 border-b ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                {['overview', 'requirements', 'process', 'jobs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      activeTab === tab
                        ? isDark
                          ? 'bg-gray-800 text-gray-100'
                          : 'bg-gray-100 text-gray-900'
                        : isDark
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'overview' && (
                  <OverviewTab visaData={visaData} isDark={isDark} />
                )}
                {activeTab === 'requirements' && (
                  <RequirementsTab visaData={visaData} isDark={isDark} />
                )}
                {activeTab === 'process' && (
                  <ProcessTab visaData={visaData} isDark={isDark} />
                )}
                {activeTab === 'jobs' && (
                  <JobsTab visaCategoryId={visaCategoryId} isDark={isDark} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ visaData, isDark }: any) => (
  <div className="space-y-6">
    {/* Description */}
    <div>
      <h3 className={`text-sm font-semibold mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Description
      </h3>
      <p className={`text-sm leading-relaxed ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {visaData.description}
      </p>
    </div>

    {/* Key Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {visaData.processingTimeMin && visaData.processingTimeMax && (
        <StatCard
          label="Processing Time"
          value={`${visaData.processingTimeMin}-${visaData.processingTimeMax} days`}
          isDark={isDark}
        />
      )}
      {visaData.costTotalEstimateUSD && (
        <StatCard
          label="Total Cost"
          value={`$${visaData.costTotalEstimateUSD.toLocaleString()}`}
          isDark={isDark}
        />
      )}
      {visaData.approvalRate && (
        <StatCard
          label="Approval Rate"
          value={`${visaData.approvalRate}%`}
          isDark={isDark}
        />
      )}
      {visaData.validityYears && (
        <StatCard
          label="Validity"
          value={`${visaData.validityYears} years`}
          isDark={isDark}
        />
      )}
    </div>

    {/* Pros & Cons */}
    {(visaData.pros?.length > 0 || visaData.cons?.length > 0) && (
      <div className="grid md:grid-cols-2 gap-6">
        {visaData.pros?.length > 0 && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-green-400' : 'text-green-700'
            }`}>
              Advantages
            </h3>
            <ul className="space-y-2">
              {visaData.pros.map((pro: string, i: number) => (
                <li key={i} className={`text-sm flex items-start gap-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-green-500 mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}
        {visaData.cons?.length > 0 && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-red-400' : 'text-red-700'
            }`}>
              Challenges
            </h3>
            <ul className="space-y-2">
              {visaData.cons.map((con: string, i: number) => (
                <li key={i} className={`text-sm flex items-start gap-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-red-500 mt-0.5">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    {/* Cost Breakdown */}
    {visaData.costBreakdown && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Cost Breakdown
        </h3>
        <div className={`rounded-lg p-4 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          {Object.entries(visaData.costBreakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                ${(value as number).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Requirements Tab Component
const RequirementsTab = ({ visaData, isDark }: any) => (
  <div className="space-y-6">
    {/* Eligibility Criteria */}
    {visaData.eligibilityCriteria?.length > 0 && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Eligibility Criteria
        </h3>
        <ul className="space-y-2">
          {visaData.eligibilityCriteria.map((criteria: string, i: number) => (
            <li key={i} className={`text-sm flex items-start gap-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="text-blue-500 mt-0.5">•</span>
              {criteria}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Required Documents */}
    {visaData.requiredDocuments?.length > 0 && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Required Documents
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {visaData.requiredDocuments.map((doc: string, i: number) => (
            <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <span className="text-blue-500">📄</span>
              <span className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {doc}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Financial Requirements */}
    {(visaData.salaryMinUSD || visaData.financialProofUSD) && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Financial Requirements
        </h3>
        <div className="space-y-2">
          {visaData.salaryMinUSD && (
            <div className={`flex justify-between p-3 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Minimum Salary
              </span>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                ${visaData.salaryMinUSD.toLocaleString()}
              </span>
            </div>
          )}
          {visaData.financialProofUSD && (
            <div className={`flex justify-between p-3 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Bank Balance Required
              </span>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-900'
              }`}>
                ${visaData.financialProofUSD.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Common Rejection Reasons */}
    {visaData.commonRejectionReasons?.length > 0 && (
      <div className={`p-4 rounded-lg border-l-4 ${
        isDark
          ? 'bg-red-950/30 border-red-500'
          : 'bg-red-50 border-red-500'
      }`}>
        <h3 className={`text-sm font-semibold mb-2 ${
          isDark ? 'text-red-400' : 'text-red-700'
        }`}>
          Common Rejection Reasons
        </h3>
        <ul className="space-y-1">
          {visaData.commonRejectionReasons.map((reason: string, i: number) => (
            <li key={i} className={`text-sm ${
              isDark ? 'text-red-300' : 'text-red-700'
            }`}>
              • {reason}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Process Tab Component
const ProcessTab = ({ visaData, isDark }: any) => (
  <div className="space-y-6">
    {/* Application Steps */}
    {visaData.applicationSteps?.length > 0 && (
      <div>
        <h3 className={`text-sm font-semibold mb-4 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Application Process
        </h3>
        <div className="space-y-4">
          {visaData.applicationSteps.map((step: string, i: number) => (
            <div key={i} className="flex gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-700'
              } font-semibold text-sm`}>
                {i + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Timeline */}
    {(visaData.processingTimeMin || visaData.processingTimeMax) && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Timeline
        </h3>
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="space-y-3">
            {visaData.processingTimeMin && (
              <div className="flex justify-between">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Minimum Processing Time
                </span>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {visaData.processingTimeMin} days
                </span>
              </div>
            )}
            {visaData.processingTimeMax && (
              <div className="flex justify-between">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Maximum Processing Time
                </span>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {visaData.processingTimeMax} days
                </span>
              </div>
            )}
            {visaData.averageApprovalDays && (
              <div className="flex justify-between">
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Average Approval Time
                </span>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {visaData.averageApprovalDays} days
                </span>
              </div>
            )}
          </div>
          {visaData.processingTimeNote && (
            <p className={`text-xs mt-3 pt-3 border-t ${
              isDark
                ? 'text-gray-500 border-gray-700'
                : 'text-gray-500 border-gray-200'
            }`}>
              {visaData.processingTimeNote}
            </p>
          )}
        </div>
      </div>
    )}

    {/* Official Resources */}
    {visaData.officialUrl && (
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Official Resources
        </h3>
        <a
          href={visaData.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isDark
              ? 'bg-blue-900/50 text-blue-400 hover:bg-blue-900'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Visit Official Immigration Website →
        </a>
      </div>
    )}
  </div>
);

// Jobs Tab Component
const JobsTab = ({ visaCategoryId, isDark }: any) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/visa-categories/${visaCategoryId}/jobs`);
        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [visaCategoryId]);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No jobs currently sponsoring this visa type
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job: any) => (
        <div
          key={job.id}
          className={`p-4 rounded-lg border transition ${
            isDark
              ? 'border-gray-800 bg-gray-800/50 hover:bg-gray-800'
              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold truncate ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {job.title}
              </h4>
              <p className={`text-xs mt-0.5 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {job.company} • {job.location}
              </p>
              {(job.salaryMin || job.salaryMax) && (
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, isDark }: any) => (
  <div className={`p-4 rounded-lg ${
    isDark ? 'bg-gray-800' : 'bg-gray-50'
  }`}>
    <div className={`text-xs mb-1 ${
      isDark ? 'text-gray-500' : 'text-gray-500'
    }`}>
      {label}
    </div>
    <div className={`text-base font-semibold ${
      isDark ? 'text-gray-100' : 'text-gray-900'
    }`}>
      {value}
    </div>
  </div>
);
