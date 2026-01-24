'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, InfoCircle, Lightbulb01 } from '@untitledui/icons';
import type { ATSAnalysisResult } from '@/lib/ats/analyzer';
import { getScoreColor } from '@/lib/ats/analyzer';

interface ATSScorePanelProps {
    analysis: ATSAnalysisResult;
    onFixIssue?: (issueTitle: string) => void;
}

export function ATSScorePanel({ analysis, onFixIssue }: ATSScorePanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const scoreColor = getScoreColor(analysis.score);
    const criticalIssues = analysis.issues.filter(i => i.category === 'critical');
    const warnings = analysis.issues.filter(i => i.category === 'warning');
    const suggestions = analysis.issues.filter(i => i.category === 'suggestion');

    return (
        <div className="rounded-lg border border-secondary bg-primary">
            {/* Header */}
            <div className="border-b border-secondary p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={
                                        scoreColor === 'emerald' ? '#10b981' :
                                        scoreColor === 'blue' ? '#3b82f6' :
                                        scoreColor === 'yellow' ? '#f59e0b' : '#ef4444'
                                    }
                                    strokeWidth="3"
                                    strokeDasharray={`${analysis.score}, 100`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-primary">{analysis.score}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary">ATS Compatibility Score</h3>
                            <p className="text-sm text-tertiary">
                                {analysis.grade === 'excellent' && 'Excellent - Resume is highly optimized'}
                                {analysis.grade === 'good' && 'Good - Resume is well-optimized'}
                                {analysis.grade === 'fair' && 'Fair - Some improvements needed'}
                                {analysis.grade === 'poor' && 'Needs Work - Multiple issues to address'}
                            </p>
                        </div>
                    </div>
                    <Button
                        color="link-gray"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        iconTrailing={isExpanded ? ChevronUp : ChevronDown}
                    >
                        {isExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="space-y-4 p-4">
                    {/* Score Breakdown */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-secondary">Score Breakdown</h4>
                            <Button
                                color="link-gray"
                                size="sm"
                                onClick={() => setShowBreakdown(!showBreakdown)}
                            >
                                {showBreakdown ? 'Hide' : 'Show'}
                            </Button>
                        </div>
                        {showBreakdown && (
                            <div className="space-y-2">
                                {Object.entries(analysis.breakdown).map(([category, score]) => (
                                    <div key={category} className="flex items-center gap-2">
                                        <span className="w-24 text-sm capitalize text-tertiary">{category}:</span>
                                        <div className="flex-1">
                                            <div className="h-2 w-full rounded-full bg-secondary">
                                                <div
                                                    className="h-2 rounded-full bg-blue-500"
                                                    style={{ width: `${(score / 25) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="w-12 text-right text-sm font-medium text-primary">
                                            {score}/25
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                <CheckCircle className="h-4 w-4" />
                                Strengths ({analysis.strengths.length})
                            </h4>
                            <ul className="space-y-1">
                                {analysis.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-tertiary">
                                        <span className="mt-1 text-emerald-500">✓</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Critical Issues */}
                    {criticalIssues.length > 0 && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700">
                                <AlertCircle className="h-4 w-4" />
                                Critical Issues ({criticalIssues.length})
                            </h4>
                            <div className="space-y-2">
                                {criticalIssues.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-red-200 bg-red-50 p-3"
                                    >
                                        <div className="mb-1 font-semibold text-red-900">
                                            {issue.title}
                                        </div>
                                        <p className="text-sm text-red-700">{issue.description}</p>
                                        {issue.fix && (
                                            <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                                                <Lightbulb01 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                <span>{issue.fix}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-700">
                                <AlertCircle className="h-4 w-4" />
                                Warnings ({warnings.length})
                            </h4>
                            <div className="space-y-2">
                                {warnings.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-yellow-200 bg-yellow-50 p-3"
                                    >
                                        <div className="mb-1 font-semibold text-yellow-900">
                                            {issue.title}
                                        </div>
                                        <p className="text-sm text-yellow-700">{issue.description}</p>
                                        {issue.fix && (
                                            <div className="mt-2 flex items-start gap-2 text-sm text-yellow-600">
                                                <Lightbulb01 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                <span>{issue.fix}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                                <InfoCircle className="h-4 w-4" />
                                Suggestions ({suggestions.length})
                            </h4>
                            <div className="space-y-2">
                                {suggestions.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-blue-200 bg-blue-50 p-3"
                                    >
                                        <div className="mb-1 font-semibold text-blue-900">
                                            {issue.title}
                                        </div>
                                        <p className="text-sm text-blue-700">{issue.description}</p>
                                        {issue.fix && (
                                            <div className="mt-2 flex items-start gap-2 text-sm text-blue-600">
                                                <Lightbulb01 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                <span>{issue.fix}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
