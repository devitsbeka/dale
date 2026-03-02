"use client";

import { JOB_LEVELS, JOB_TYPES, REMOTE_POLICIES } from "@/lib/constants";

interface JobFiltersProps {
  filters: {
    remotePolicy?: string;
    type?: string;
    level?: string;
    salaryMin?: number;
    salaryMax?: number;
  };
  onChange: (filters: JobFiltersProps["filters"]) => void;
}

const selectClass =
  "rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-none focus:ring-2 focus:ring-brand-solid";

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        className={selectClass}
        value={filters.remotePolicy ?? ""}
        onChange={(e) => onChange({ ...filters, remotePolicy: e.target.value || undefined })}
      >
        <option value="">All locations</option>
        {Object.entries(REMOTE_POLICIES).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.type ?? ""}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      >
        <option value="">All types</option>
        {Object.entries(JOB_TYPES).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.level ?? ""}
        onChange={(e) => onChange({ ...filters, level: e.target.value || undefined })}
      >
        <option value="">All levels</option>
        {Object.entries(JOB_LEVELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
