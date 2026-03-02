"use client";

import { useState } from "react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

interface VisaType {
  id: string;
  name: string;
  country: string;
  category: "work" | "talent" | "investment" | "digital_nomad";
  processingTime: string;
  cost: string;
  probability: number;
  requirements: string[];
  benefits: string[];
  timeline: string;
  notes: string;
}

const VISA_TYPES: VisaType[] = [
  {
    id: "h1b", name: "H-1B Specialty Occupation", country: "US", category: "work",
    processingTime: "3-6 months", cost: "$2,500-$10,000",
    probability: 35,
    requirements: ["Bachelor's degree or equivalent", "Job offer from US employer", "Specialty occupation", "Employer files petition"],
    benefits: ["Work authorization for 3 years (renewable)", "Dual intent (can apply for green card)", "Spouse can get H-4 visa"],
    timeline: "Apply in March lottery → Results April → Start October",
    notes: "Annual cap of 85,000. Lottery-based selection. Premium processing available for +$2,805.",
  },
  {
    id: "o1", name: "O-1 Extraordinary Ability", country: "US", category: "talent",
    processingTime: "2-4 months", cost: "$3,000-$8,000",
    probability: 55,
    requirements: ["Extraordinary ability in field", "Evidence of achievements (awards, publications, high salary)", "Advisory opinion letter", "US employer or agent as petitioner"],
    benefits: ["No annual cap or lottery", "Initial 3-year stay", "Dual intent", "Can be self-sponsored via agent"],
    timeline: "Can apply any time → Premium processing 15 days",
    notes: "Strong portfolio of achievements required. Tech professionals with notable contributions often qualify.",
  },
  {
    id: "eb1", name: "EB-1 Green Card", country: "US", category: "talent",
    processingTime: "1-2 years", cost: "$5,000-$15,000",
    probability: 45,
    requirements: ["Extraordinary ability (EB-1A) or Outstanding professor/researcher (EB-1B)", "Or multinational manager (EB-1C)", "Evidence of sustained acclaim"],
    benefits: ["Permanent residency", "No labor certification needed (EB-1A)", "Family included"],
    timeline: "File I-140 → Wait for priority date → Adjust status or consular processing",
    notes: "EB-1A can self-petition. No employer sponsorship required.",
  },
  {
    id: "uk_skilled", name: "Skilled Worker Visa", country: "UK", category: "work",
    processingTime: "3-8 weeks", cost: "£1,270-£1,580",
    probability: 75,
    requirements: ["Job offer from licensed sponsor", "Certificate of Sponsorship", "Meet salary threshold (£38,700+)", "English language proficiency"],
    benefits: ["Work for specific employer", "Path to settlement after 5 years", "Family can join"],
    timeline: "Apply online → Biometrics → Decision in 3-8 weeks",
    notes: "Points-based system. Lower threshold for shortage occupations. Tech roles generally qualify.",
  },
  {
    id: "uk_talent", name: "Global Talent Visa", country: "UK", category: "talent",
    processingTime: "3-5 weeks", cost: "£623",
    probability: 60,
    requirements: ["Endorsed by Tech Nation (for tech)", "Exceptional talent or promise", "Evidence of achievements"],
    benefits: ["No employer needed", "Free to work/freelance", "Path to settlement in 3-5 years", "Family included"],
    timeline: "Stage 1: Endorsement → Stage 2: Visa application",
    notes: "Ideal for senior engineers, founders, and tech leaders. Can switch employers freely.",
  },
  {
    id: "eu_blue", name: "EU Blue Card", country: "EU", category: "work",
    processingTime: "1-3 months", cost: "€100-€500",
    probability: 80,
    requirements: ["Higher education qualification", "Work contract ≥6 months", "Salary ≥ 1.5x national average", "Relevant to qualification"],
    benefits: ["Work and live in EU", "Family reunification", "Permanent residence after 5 years", "Mobility between EU states after 12 months"],
    timeline: "Apply at consulate/immigration → Decision 1-3 months",
    notes: "Thresholds vary by country. Germany, Netherlands, and France are most tech-friendly.",
  },
  {
    id: "pt_d7", name: "Digital Nomad Visa (D8)", country: "PT", category: "digital_nomad",
    processingTime: "2-3 months", cost: "€180",
    probability: 85,
    requirements: ["Remote work for non-Portuguese company", "Monthly income ≥ 4x min wage (~€3,040)", "Health insurance", "Clean criminal record"],
    benefits: ["Live in Portugal", "Schengen area access", "Path to residency", "NHR tax regime possible"],
    timeline: "Apply at consulate → SEF appointment in Portugal",
    notes: "One of Europe's most popular digital nomad programs. Excellent quality of life.",
  },
  {
    id: "sg_ep", name: "Employment Pass", country: "SG", category: "work",
    processingTime: "3-8 weeks", cost: "S$225",
    probability: 70,
    requirements: ["Job offer in Singapore", "Monthly salary ≥ S$5,600 (varies by age)", "Acceptable qualifications", "COMPASS framework points"],
    benefits: ["Work in Singapore", "Dependant passes for family", "Path to PR after 2+ years", "Low personal tax"],
    timeline: "Employer applies online → MOM review → Collection",
    notes: "COMPASS framework introduced 2023. Points for salary, qualifications, diversity, and skills bonus.",
  },
];

const categoryLabels = {
  work: "Work Visa",
  talent: "Talent Visa",
  investment: "Investment",
  digital_nomad: "Digital Nomad",
};

const categoryColors = {
  work: "blue" as const,
  talent: "purple" as const,
  investment: "success" as const,
  digital_nomad: "warning" as const,
};

export default function ImmigrationPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const countries = [...new Set(VISA_TYPES.map((v) => v.country))];
  const categories = [...new Set(VISA_TYPES.map((v) => v.category))];

  const filtered = VISA_TYPES
    .filter((v) => !selectedCountry || v.country === selectedCountry)
    .filter((v) => !selectedCategory || v.category === selectedCategory)
    .sort((a, b) => b.probability - a.probability);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Immigration Intelligence</h1>
        <p className="text-md text-tertiary">
          Explore visa options, compare requirements, and estimate your approval probability
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-none focus:ring-2 focus:ring-brand-solid"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary shadow-xs outline-none focus:ring-2 focus:ring-brand-solid"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Types</option>
          {categories.map((c) => (
            <option key={c} value={c}>{categoryLabels[c]}</option>
          ))}
        </select>
      </div>

      {/* Visa cards */}
      <div className="mt-6 flex flex-col gap-4">
        {filtered.map((visa) => (
          <div
            key={visa.id}
            className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-semibold text-primary">{visa.name}</h3>
                  <Badge color={categoryColors[visa.category]} size="sm">
                    {categoryLabels[visa.category]}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-tertiary">
                  {visa.country} &middot; {visa.processingTime} &middot; {visa.cost}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  visa.probability >= 70 ? "text-success-primary" :
                  visa.probability >= 50 ? "text-warning-primary" :
                  "text-error-primary"
                }`}>
                  {visa.probability}%
                </div>
                <p className="text-xs text-tertiary">est. approval</p>
              </div>
            </div>

            {/* Probability bar */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${
                  visa.probability >= 70 ? "bg-utility-success-500" :
                  visa.probability >= 50 ? "bg-utility-warning-500" :
                  "bg-utility-error-500"
                }`}
                style={{ width: `${visa.probability}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-tertiary">{visa.notes}</p>

            {/* Expanded details */}
            {expandedId === visa.id && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-secondary pt-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-primary">Requirements</h4>
                  <ul className="mt-2 flex flex-col gap-1">
                    {visa.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-tertiary">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-quaternary" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">Benefits</h4>
                  <ul className="mt-2 flex flex-col gap-1">
                    {visa.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-tertiary">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-utility-success-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-primary">Timeline</h4>
                  <p className="mt-1 text-sm text-tertiary">{visa.timeline}</p>
                </div>
              </div>
            )}

            <Button
              color="tertiary"
              size="sm"
              className="mt-3"
              onClick={() => setExpandedId(expandedId === visa.id ? null : visa.id)}
            >
              {expandedId === visa.id ? "Show Less" : "Show Details"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
