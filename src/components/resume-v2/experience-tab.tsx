'use client';

import { useState } from 'react';

interface ExperienceItem {
    id: string;
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
}

interface ExperienceTabProps {
    data: ExperienceItem[];
    onChange: (exp: ExperienceItem[]) => void;
    onInteraction: () => void;
}

export function ExperienceTab({ data, onChange, onInteraction }: ExperienceTabProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = () => {
        onInteraction();
        const newItem: ExperienceItem = {
            id: Date.now().toString(),
            position: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: [''],
        };
        onChange([...data, newItem]);
        setExpandedId(newItem.id);
    };

    const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
        onInteraction();
        onChange(data.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDelete = (id: string) => {
        onInteraction();
        onChange(data.filter(item => item.id !== id));
        if (expandedId === id) {
            setExpandedId(null);
        }
    };

    const handleAchievementChange = (id: string, value: string) => {
        onInteraction();
        const achievements = value.split('\n').filter(line => line.trim());
        handleUpdate(id, 'achievements', achievements.length > 0 ? achievements : ['']);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Add Experience
                </button>
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No experience added yet. Click "Add Experience" to get started.
                </div>
            )}

            {data.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                    <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg bg-white"
                    >
                        {/* Header - Always visible */}
                        <div
                            className="p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                        {item.position || 'Untitled Position'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {item.company || 'Company Name'} • {item.location || 'Location'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.startDate || 'Start'} - {item.current ? 'Present' : (item.endDate || 'End')}
                                    </p>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-gray-600 ml-4"
                                >
                                    {isExpanded ? '▼' : '▶'}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Content - Edit Mode */}
                        {isExpanded && (
                            <div className="p-4 border-t border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={item.position}
                                            onChange={(e) => handleUpdate(item.id, 'position', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="Software Engineer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={item.company}
                                            onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={item.location}
                                        onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                        placeholder="San Francisco, CA"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="text"
                                            value={item.startDate}
                                            onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="2021-06"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="text"
                                            value={item.endDate}
                                            onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                                            disabled={item.current}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                            placeholder="2023-05"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={item.current}
                                            onChange={(e) => handleUpdate(item.id, 'current', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            I currently work here
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Achievements (one per line)
                                    </label>
                                    <textarea
                                        value={item.achievements.join('\n')}
                                        onChange={(e) => handleAchievementChange(item.id, e.target.value)}
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                        placeholder="• Built real-time ML pipeline&#10;• Led migration to Kubernetes&#10;• Mentored 5 junior engineers"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
