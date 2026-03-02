"use client";

import { useState } from "react";
import { ArrowRight, SearchLg, TrendUp01 } from "@untitledui/icons";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { trpc } from "@/lib/trpc";

const levelColors = {
  beginner: "gray" as const,
  intermediate: "blue" as const,
  advanced: "purple" as const,
  expert: "success" as const,
};

const levelLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: userSkills } = trpc.skill.getUserSkills.useQuery();
  const { data: allSkills } = trpc.skill.list.useQuery({
    category: (selectedCategory || undefined) as Parameters<typeof trpc.skill.list.useQuery>[0] extends { category?: infer C } ? C : never,
    search: search || undefined,
  });

  const addSkill = trpc.skill.addUserSkill.useMutation();
  const { data: transferableRoles } = trpc.skill.transferableRoles.useQuery();
  const { data: adjacentSkills } = trpc.skill.adjacentSkills.useQuery();

  // Radar chart data from user skills
  const radarData = userSkills?.slice(0, 8).map((us) => ({
    skill: us.skill.name.length > 12 ? us.skill.name.slice(0, 12) + "..." : us.skill.name,
    value: us.level === "beginner" ? 25 : us.level === "intermediate" ? 50 : us.level === "advanced" ? 75 : 100,
  })) ?? [];

  // Skills the user doesn't have yet (for suggestions)
  const userSkillIds = new Set(userSkills?.map((us) => us.skillId) ?? []);
  const suggestedSkills = allSkills?.filter((s) => !userSkillIds.has(s.id)).slice(0, 20) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Skills Genome</h1>
        <p className="text-md text-tertiary">
          Your skill profile, gap analysis, and growth recommendations
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Radar Chart */}
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary lg:col-span-1">
          <h2 className="text-lg font-semibold text-primary">Skill Radar</h2>
          {radarData.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <Radar
                    dataKey="value"
                    stroke="currentColor"
                    fill="currentColor"
                    fillOpacity={0.2}
                    className="text-utility-brand-600"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-tertiary">Add skills to see your radar</p>
            </div>
          )}
        </div>

        {/* Your Skills */}
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary lg:col-span-2">
          <h2 className="text-lg font-semibold text-primary">
            Your Skills ({userSkills?.length ?? 0})
          </h2>
          {userSkills && userSkills.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {userSkills.map((us) => (
                <div
                  key={us.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">{us.skill.name}</span>
                    <Badge color="gray" size="sm">{us.skill.category}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color={levelColors[us.level]} size="sm">
                      {levelLabels[us.level]}
                    </Badge>
                    <span className="text-xs text-quaternary">{us.yearsOfExperience}yr</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 py-8 text-center">
              <p className="text-sm text-tertiary">
                No skills added yet. Browse the catalog below to add your first skill.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transferable Roles */}
      {transferableRoles && transferableRoles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">You Could Become a...</h2>
          <p className="mt-1 text-sm text-tertiary">Roles your current skills transfer to</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {transferableRoles.slice(0, 6).map((role) => (
              <div
                key={role.title}
                className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary">{role.title}</p>
                    <p className="mt-0.5 text-xs text-tertiary">
                      {role.jobCount} open position{role.jobCount !== 1 ? "s" : ""}
                      {role.salaryRange && (
                        <> &middot; ${Math.round(role.salaryRange.min / 1000)}k – ${Math.round(role.salaryRange.max / 1000)}k</>
                      )}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${
                    role.transferScore >= 80 ? "text-success-primary" :
                    role.transferScore >= 60 ? "text-brand-primary" :
                    role.transferScore >= 40 ? "text-warning-primary" :
                    "text-tertiary"
                  }`}>
                    {role.transferScore}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid"
                    style={{ width: `${role.transferScore}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {role.matchedSkills.slice(0, 3).map((s) => (
                    <Badge key={s} color="success" size="sm">{s}</Badge>
                  ))}
                  {role.gapSkills.slice(0, 2).map((s) => (
                    <Badge key={s} color="gray" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjacent Skills */}
      {adjacentSkills && adjacentSkills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Skills to Learn Next</h2>
          <p className="mt-1 text-sm text-tertiary">High-value skills that complement yours</p>
          <div className="mt-4 flex flex-col gap-2">
            {adjacentSkills.slice(0, 8).map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 ring-1 ring-secondary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">{skill.name}</span>
                  <Badge color="gray" size="sm">{skill.category}</Badge>
                  {skill.growthRate > 10 && (
                    <Badge color="success" size="sm">
                      <TrendUp01 className="mr-0.5 size-3" />
                      +{skill.growthRate}%
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand-solid"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-quaternary">{skill.demandScore}%</span>
                  </div>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={async () => {
                      await addSkill.mutateAsync({
                        skillId: skill.id,
                        level: "beginner",
                        yearsOfExperience: 0,
                      });
                      window.location.reload();
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Catalog */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-primary">Skill Catalog</h2>
        <p className="mt-1 text-sm text-tertiary">Browse and add skills to your profile</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <SearchLg className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-quaternary" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-lg border border-primary bg-primary py-2.5 pr-3.5 pl-11 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
            />
          </div>
          <select
            className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-none focus:ring-2 focus:ring-brand-solid"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {Object.entries(SKILL_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {suggestedSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 ring-1 ring-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">{skill.name}</span>
                <Badge color="gray" size="sm">{skill.category}</Badge>
                {skill.growthRate > 10 && (
                  <Badge color="success" size="sm">Trending +{skill.growthRate}%</Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-brand-solid"
                      style={{ width: `${skill.demandScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-quaternary">{skill.demandScore}%</span>
                </div>
                <Button
                  color="secondary"
                  size="sm"
                  onClick={async () => {
                    await addSkill.mutateAsync({
                      skillId: skill.id,
                      level: "beginner",
                      yearsOfExperience: 0,
                    });
                    window.location.reload();
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
