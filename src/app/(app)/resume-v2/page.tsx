'use client';

import { useState } from 'react';

interface ResumeData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    summary: string;
    template: string;
    color: string;
    font: string;
}

const TEMPLATES = [
    { id: 'modern', name: 'Modern', color: '#3B82F6' },
    { id: 'classic', name: 'Classic', color: '#1F2937' },
    { id: 'minimal', name: 'Minimal', color: '#000000' },
    { id: 'creative', name: 'Creative', color: '#8B5CF6' },
];

const COLORS = [
    { id: 'blue', name: 'Blue', value: '#3B82F6' },
    { id: 'green', name: 'Green', value: '#059669' },
    { id: 'purple', name: 'Purple', value: '#8B5CF6' },
    { id: 'slate', name: 'Slate', value: '#334155' },
];

const FONTS = [
    { id: 'inter', name: 'Inter', value: 'Inter, sans-serif' },
    { id: 'roboto', name: 'Roboto', value: 'Roboto, sans-serif' },
    { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
];

export default function ResumeV2Page() {
    const [activeTab, setActiveTab] = useState<'info' | 'customize'>('info');
    const [data, setData] = useState<ResumeData>({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-1234',
        summary: 'Experienced professional...',
        template: 'modern',
        color: '#3B82F6',
        font: 'Inter, sans-serif',
    });

    const updateField = (field: keyof ResumeData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Panel - Form */}
            <div className="w-[500px] bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Resume Builder v2</h1>
                    <p className="text-sm text-gray-600 mt-1">Clean, working implementation</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === 'info'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('customize')}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === 'customize'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Customize
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={data.firstName}
                                    onChange={(e) => updateField('firstName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={data.lastName}
                                    onChange={(e) => updateField('lastName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="555-1234"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Summary
                                </label>
                                <textarea
                                    value={data.summary}
                                    onChange={(e) => updateField('summary', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    placeholder="Brief professional summary..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'customize' && (
                        <div className="space-y-6">
                            {/* Templates */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Choose Template
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {TEMPLATES.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => {
                                                updateField('template', template.id);
                                                updateField('color', template.color);
                                            }}
                                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                data.template === template.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-semibold text-gray-900">
                                                {template.name}
                                            </div>
                                            <div
                                                className="mt-2 h-1 rounded"
                                                style={{ backgroundColor: template.color }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Accent Color
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => updateField('color', color.value)}
                                            className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                                                data.color === color.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: color.value }}
                                            />
                                            <span className="font-medium text-gray-900">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fonts */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Font</h3>
                                <div className="space-y-2">
                                    {FONTS.map((font) => (
                                        <button
                                            key={font.id}
                                            onClick={() => updateField('font', font.value)}
                                            className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                                                data.font === font.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div
                                                className="font-semibold text-gray-900"
                                                style={{ fontFamily: font.value }}
                                            >
                                                {font.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Resume Preview */}
                        <div className="p-12" style={{ fontFamily: data.font }}>
                            {/* Header */}
                            <div className="border-b-2 pb-6" style={{ borderColor: data.color }}>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {data.firstName} {data.lastName}
                                </h1>
                                <div className="mt-2 text-sm text-gray-600">
                                    {data.email} • {data.phone}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-6">
                                <h2
                                    className="text-xl font-bold mb-2"
                                    style={{ color: data.color }}
                                >
                                    Professional Summary
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                            </div>

                            {/* Template indicator */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">
                                    Template: <span className="font-semibold">{data.template}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Color: <span className="font-semibold">{data.color}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
