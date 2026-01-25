'use client';

import { useState } from 'react';

interface EducationItem {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
}

interface EducationTabProps {
    data: EducationItem[];
    onChange: (edu: EducationItem[]) => void;
    onInteraction: () => void;
}

export function EducationTab({ data, onChange, onInteraction }: EducationTabProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = () => {
        onInteraction();
        const newItem: EducationItem = {
            id: Date.now().toString(),
            school: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
        };
        onChange([...data, newItem]);
        setExpandedId(newItem.id);
    };

    const handleUpdate = (id: string, field: keyof EducationItem, value: any) => {
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Add Education
                </button>
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No education added yet. Click "Add Education" to get started.
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
                                        {item.school || 'School Name'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {item.degree || 'Degree'} in {item.field || 'Field'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.startDate || 'Start'} - {item.endDate || 'End'}
                                        {item.gpa && ` • GPA: ${item.gpa}`}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        School
                                    </label>
                                    <input
                                        type="text"
                                        value={item.school}
                                        onChange={(e) => handleUpdate(item.id, 'school', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                        placeholder="Stanford University"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Degree
                                        </label>
                                        <input
                                            type="text"
                                            value={item.degree}
                                            onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="Bachelor of Science"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Field of Study
                                        </label>
                                        <input
                                            type="text"
                                            value={item.field}
                                            onChange={(e) => handleUpdate(item.id, 'field', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="Computer Science"
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
                                        placeholder="Stanford, CA"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="text"
                                            value={item.startDate}
                                            onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="2015"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="2019"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            GPA (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={item.gpa || ''}
                                            onChange={(e) => handleUpdate(item.id, 'gpa', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                            placeholder="3.9"
                                        />
                                    </div>
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
