'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';
import { ChevronDown, ChevronUp, SearchSm, CheckCircle, XCircle, Star01 } from '@untitledui/icons';
import { analyzeKeywords, type KeywordAnalysisResult } from '@/lib/ats/keyword-analyzer';
import type { ResumeData } from '@/types/resume';

interface KeywordAnalyzerPanelProps {
    resumeData: Partial<ResumeData>;
}

export function KeywordAnalyzerPanel({ resumeData }: KeywordAnalyzerPanelProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState<KeywordAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showMissing, setShowMissing] = useState(true);
    const [showFound, setShowFound] = useState(false);

    const handleAnalyze = () => {
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);
        // Simulate API call delay
        setTimeout(() => {
            const result = analyzeKeywords(resumeData, jobDescription);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 500);
    };

    return (
        <div className="space-y-4 rounded-lg border border-secondary bg-primary p-4">
            <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-primary">
                    <Star01 className="h-5 w-5" />
                    Keyword Analyzer
                </h3>
                <p className="text-sm text-tertiary">
                    Paste a job description to see how well your resume matches the requirements
                </p>
            </div>

            {/* Input */}
            <div className="space-y-2">
                <Label>Job Description</Label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[120px] w-full rounded-lg border border-secondary bg-primary p-3 text-sm text-primary outline-focus-ring transition focus:border-brand-500 focus:outline-2"
                    rows={6}
                />
                <Button
                    color="primary"
                    size="md"
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    iconLeading={SearchSm}
                    className="w-full"
                >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
                </Button>
            </div>

            {/* Results */}
            {analysis && (
                <div className="space-y-4 border-t border-secondary pt-4">
                    {/* Match Rate */}
                    <div className="rounded-lg bg-secondary/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-primary">{analysis.matchRate}%</div>
                                <div className="text-sm text-tertiary">
                                    {analysis.matchedKeywords} of {analysis.totalKeywords} keywords matched
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`text-sm font-semibold ${
                                        analysis.matchRate >= 70
                                            ? 'text-emerald-600'
                                            : analysis.matchRate >= 50
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {analysis.matchRate >= 70
                                        ? 'Strong Match'
                                        : analysis.matchRate >= 50
                                        ? 'Good Match'
                                        : 'Weak Match'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <h4 className="mb-2 font-semibold text-blue-900">Recommendations</h4>
                            <ul className="space-y-1">
                                {analysis.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                                        <span className="mt-0.5">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Missing Keywords */}
                    {analysis.missingKeywords.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowMissing(!showMissing)}
                                className="mb-2 flex w-full items-center justify-between text-left"
                            >
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                                    <XCircle className="h-4 w-4" />
                                    Missing Keywords ({analysis.missingKeywords.length})
                                </h4>
                                {showMissing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            {showMissing && (
                                <div className="space-y-1">
                                    {analysis.missingKeywords.map((keyword, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between rounded border border-red-200 bg-red-50 px-3 py-2"
                                        >
                                            <span className="text-sm font-medium text-red-900">
                                                {keyword.keyword}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    keyword.category === 'required'
                                                        ? 'bg-red-200 text-red-800'
                                                        : keyword.category === 'preferred'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : 'bg-blue-200 text-blue-800'
                                                }`}
                                            >
                                                {keyword.category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Found Keywords */}
                    {analysis.foundKeywords.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowFound(!showFound)}
                                className="mb-2 flex w-full items-center justify-between text-left"
                            >
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                    <CheckCircle className="h-4 w-4" />
                                    Found Keywords ({analysis.foundKeywords.length})
                                </h4>
                                {showFound ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            {showFound && (
                                <div className="space-y-1">
                                    {analysis.foundKeywords.map((keyword, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-emerald-900">
                                                    {keyword.keyword}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        keyword.category === 'required'
                                                            ? 'bg-emerald-200 text-emerald-800'
                                                            : keyword.category === 'preferred'
                                                            ? 'bg-blue-200 text-blue-800'
                                                            : 'bg-gray-200 text-gray-800'
                                                    }`}
                                                >
                                                    {keyword.category}
                                                </span>
                                            </div>
                                            {keyword.locations.length > 0 && (
                                                <div className="mt-1 text-xs text-emerald-600">
                                                    Found in: {keyword.locations.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
