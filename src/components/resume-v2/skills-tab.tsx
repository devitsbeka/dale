'use client';

import { useState } from 'react';

interface SkillItem {
    id: string;
    name: string;
    category: 'technical' | 'soft' | 'language' | 'tool';
}

interface SkillsTabProps {
    data: SkillItem[];
    onChange: (skills: SkillItem[]) => void;
    onInteraction: () => void;
}

export function SkillsTab({ data, onChange, onInteraction }: SkillsTabProps) {
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('technical');

    const handleAdd = () => {
        if (!newSkillName.trim()) return;

        onInteraction();
        const newSkill: SkillItem = {
            id: Date.now().toString(),
            name: newSkillName.trim(),
            category: newSkillCategory,
        };
        onChange([...data, newSkill]);
        setNewSkillName('');
    };

    const handleDelete = (id: string) => {
        onInteraction();
        onChange(data.filter(skill => skill.id !== id));
    };

    const categoryColors = {
        technical: 'bg-blue-100 text-blue-800 border-blue-200',
        soft: 'bg-green-100 text-green-800 border-green-200',
        language: 'bg-purple-100 text-purple-800 border-purple-200',
        tool: 'bg-orange-100 text-orange-800 border-orange-200',
    };

    const categoryLabels = {
        technical: 'Technical Skills',
        soft: 'Soft Skills',
        language: 'Languages',
        tool: 'Tools & Technologies',
    };

    const groupedSkills = {
        technical: data.filter(s => s.category === 'technical'),
        soft: data.filter(s => s.category === 'soft'),
        language: data.filter(s => s.category === 'language'),
        tool: data.filter(s => s.category === 'tool'),
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Skill</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="e.g., React, Python, Leadership"
                    />
                    <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as SkillItem['category'])}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    >
                        <option value="technical">Technical</option>
                        <option value="soft">Soft Skill</option>
                        <option value="language">Language</option>
                        <option value="tool">Tool</option>
                    </select>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Add
                    </button>
                </div>
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No skills added yet. Add your first skill above.
                </div>
            )}

            {(Object.keys(groupedSkills) as Array<keyof typeof groupedSkills>).map((category) => {
                const skills = groupedSkills[category];
                if (skills.length === 0) return null;

                return (
                    <div key={category}>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            {categoryLabels[category]}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${categoryColors[category]}`}
                                >
                                    <span className="font-medium">{skill.name}</span>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="hover:opacity-70 transition-opacity"
                                        title="Remove skill"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
