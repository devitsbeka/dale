"use client";

import { Button } from "@/components/base/buttons/button";

const FEATURES = [
  { title: "Job Intelligence", description: "AI-powered job matching with personalized scores across 120+ companies.", icon: "🔍" },
  { title: "Compensation Engine", description: "Real salary data with percentile analysis, not self-reported surveys.", icon: "💰" },
  { title: "Skills Genome", description: "Map your skills, find gaps, and discover transferable career paths.", icon: "🧬" },
  { title: "8 AI Agents", description: "Specialized agents for negotiation, research, resume building, and more.", icon: "🤖" },
  { title: "Path Simulator", description: "Visualize career trajectories and compare salary projections over 20 years.", icon: "🛤️" },
  { title: "Career Game", description: "Level up with XP, complete quests, earn badges, and compete on leaderboards.", icon: "🎮" },
  { title: "Relocation Intel", description: "Compare cities by net salary, cost of living, and quality of life score.", icon: "🌍" },
  { title: "Immigration Guide", description: "Visa probability scoring for H-1B, O-1, UK Talent, EU Blue Card, and more.", icon: "🛂" },
  { title: "Company Health", description: "Deep company intelligence with culture, growth, and stability scores.", icon: "🏢" },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with core features",
    features: ["Job search & matching", "Basic salary data", "Skills tracking", "1 AI agent chat/day", "Career map"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Full career intelligence suite",
    features: ["Everything in Free", "Unlimited AI agents", "Full salary data (P25-P75)", "Path simulator", "Negotiation intelligence", "Skill transferability", "Priority support"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    features: ["Everything in Pro", "Team dashboards", "API access", "Custom integrations", "Dedicated support", "Volume pricing", "SSO / SAML"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "120+", label: "Companies" },
  { value: "500+", label: "Skills Tracked" },
  { value: "5K+", label: "Salary Data Points" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-solid text-white text-sm font-bold">P</div>
          <span className="text-lg font-bold text-primary">Planeta.id</span>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-tertiary hover:text-secondary">Features</a>
          <a href="#pricing" className="text-sm text-tertiary hover:text-secondary">Pricing</a>
          <a href="/login" className="text-sm text-tertiary hover:text-secondary">Sign In</a>
          <Button color="primary" size="sm" onClick={() => window.location.href = "/register"}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-utility-brand-50 px-4 py-1.5 text-sm font-medium text-brand-primary">
          Career Operating System for Earth
        </div>
        <h1 className="mt-6 text-display-lg font-semibold text-primary">
          Replace 30+ career tools<br />with one intelligent platform
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-tertiary">
          Planeta.id combines AI-powered job matching, real salary intelligence,
          skill mapping, negotiation coaching, and career simulation in one unified platform.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button color="primary" size="xl" onClick={() => window.location.href = "/register"}>
            Start Free — No Credit Card
          </Button>
          <Button color="secondary" size="xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
            See Features
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-display-xs font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-secondary bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-display-sm font-semibold text-primary">Everything you need for your career</h2>
            <p className="mt-2 text-lg text-tertiary">Nine intelligence engines working together</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-3 text-md font-semibold text-primary">{feature.title}</h3>
                <p className="mt-1 text-sm text-tertiary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-display-sm font-semibold text-primary">Simple, transparent pricing</h2>
            <p className="mt-2 text-lg text-tertiary">Start free, upgrade when you&apos;re ready</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-brand-solid text-white ring-2 ring-brand-solid shadow-lg"
                    : "bg-primary shadow-xs ring-1 ring-secondary"
                }`}
              >
                <h3 className={`text-lg font-semibold ${plan.highlighted ? "" : "text-primary"}`}>{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-display-md font-bold ${plan.highlighted ? "" : "text-primary"}`}>{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-tertiary"}`}>{plan.period}</span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/70" : "text-tertiary"}`}>{plan.description}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-white/90" : "text-secondary"}`}>
                      <span className={`size-1.5 rounded-full ${plan.highlighted ? "bg-white/60" : "bg-brand-solid"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  color={plan.highlighted ? "secondary" : "primary"}
                  size="lg"
                  className="mt-8 w-full"
                  onClick={() => window.location.href = "/register"}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-secondary bg-secondary py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-display-sm font-semibold text-primary">Ready to level up your career?</h2>
          <p className="mt-2 text-lg text-tertiary">
            Join thousands of professionals using Planeta.id to make smarter career decisions.
          </p>
          <Button color="primary" size="xl" className="mt-8" onClick={() => window.location.href = "/register"}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-brand-solid text-white text-xs font-bold">P</div>
            <span className="text-sm font-semibold text-primary">Planeta.id</span>
          </div>
          <p className="text-xs text-quaternary">Career Operating System for Earth</p>
        </div>
      </footer>
    </div>
  );
}
