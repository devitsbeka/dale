import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient();

// ============================================================================
// Skills Taxonomy (500+ skills)
// ============================================================================

const skills = [
  // Programming Languages
  { name: "JavaScript", slug: "javascript", category: "technical" as const, demandScore: 95, growthRate: 3 },
  { name: "TypeScript", slug: "typescript", category: "technical" as const, demandScore: 92, growthRate: 15 },
  { name: "Python", slug: "python", category: "technical" as const, demandScore: 96, growthRate: 8 },
  { name: "Java", slug: "java", category: "technical" as const, demandScore: 85, growthRate: -2 },
  { name: "Go", slug: "go", category: "technical" as const, demandScore: 78, growthRate: 12 },
  { name: "Rust", slug: "rust", category: "technical" as const, demandScore: 65, growthRate: 25 },
  { name: "C++", slug: "cpp", category: "technical" as const, demandScore: 72, growthRate: -1 },
  { name: "C#", slug: "csharp", category: "technical" as const, demandScore: 75, growthRate: 2 },
  { name: "Ruby", slug: "ruby", category: "technical" as const, demandScore: 55, growthRate: -5 },
  { name: "PHP", slug: "php", category: "technical" as const, demandScore: 52, growthRate: -8 },
  { name: "Swift", slug: "swift", category: "technical" as const, demandScore: 68, growthRate: 5 },
  { name: "Kotlin", slug: "kotlin", category: "technical" as const, demandScore: 70, growthRate: 10 },
  { name: "Scala", slug: "scala", category: "technical" as const, demandScore: 45, growthRate: -3 },
  { name: "Elixir", slug: "elixir", category: "technical" as const, demandScore: 35, growthRate: 8 },
  { name: "SQL", slug: "sql", category: "technical" as const, demandScore: 90, growthRate: 2 },

  // Frontend Frameworks
  { name: "React", slug: "react", category: "technical" as const, demandScore: 94, growthRate: 5 },
  { name: "Next.js", slug: "nextjs", category: "technical" as const, demandScore: 88, growthRate: 20 },
  { name: "Vue.js", slug: "vuejs", category: "technical" as const, demandScore: 72, growthRate: 3 },
  { name: "Angular", slug: "angular", category: "technical" as const, demandScore: 68, growthRate: -5 },
  { name: "Svelte", slug: "svelte", category: "technical" as const, demandScore: 45, growthRate: 18 },
  { name: "Tailwind CSS", slug: "tailwind-css", category: "technical" as const, demandScore: 82, growthRate: 22 },
  { name: "HTML/CSS", slug: "html-css", category: "technical" as const, demandScore: 88, growthRate: 0 },
  { name: "Three.js", slug: "threejs", category: "technical" as const, demandScore: 42, growthRate: 15 },
  { name: "WebGL", slug: "webgl", category: "technical" as const, demandScore: 35, growthRate: 10 },

  // Backend Frameworks
  { name: "Node.js", slug: "nodejs", category: "technical" as const, demandScore: 90, growthRate: 5 },
  { name: "Express.js", slug: "expressjs", category: "technical" as const, demandScore: 78, growthRate: -2 },
  { name: "Django", slug: "django", category: "technical" as const, demandScore: 72, growthRate: 3 },
  { name: "FastAPI", slug: "fastapi", category: "technical" as const, demandScore: 68, growthRate: 25 },
  { name: "Spring Boot", slug: "spring-boot", category: "technical" as const, demandScore: 75, growthRate: 2 },
  { name: "Ruby on Rails", slug: "ruby-on-rails", category: "technical" as const, demandScore: 52, growthRate: -8 },
  { name: "GraphQL", slug: "graphql", category: "technical" as const, demandScore: 72, growthRate: 8 },
  { name: "tRPC", slug: "trpc", category: "technical" as const, demandScore: 55, growthRate: 30 },
  { name: "REST APIs", slug: "rest-apis", category: "technical" as const, demandScore: 92, growthRate: 0 },

  // Databases
  { name: "PostgreSQL", slug: "postgresql", category: "technical" as const, demandScore: 88, growthRate: 10 },
  { name: "MongoDB", slug: "mongodb", category: "technical" as const, demandScore: 72, growthRate: 3 },
  { name: "Redis", slug: "redis", category: "technical" as const, demandScore: 78, growthRate: 5 },
  { name: "MySQL", slug: "mysql", category: "technical" as const, demandScore: 75, growthRate: -2 },
  { name: "Elasticsearch", slug: "elasticsearch", category: "technical" as const, demandScore: 65, growthRate: 3 },
  { name: "DynamoDB", slug: "dynamodb", category: "technical" as const, demandScore: 62, growthRate: 8 },
  { name: "Prisma", slug: "prisma", category: "tool" as const, demandScore: 60, growthRate: 25 },

  // Cloud & DevOps
  { name: "AWS", slug: "aws", category: "technical" as const, demandScore: 92, growthRate: 5 },
  { name: "Google Cloud", slug: "gcp", category: "technical" as const, demandScore: 75, growthRate: 8 },
  { name: "Azure", slug: "azure", category: "technical" as const, demandScore: 78, growthRate: 5 },
  { name: "Docker", slug: "docker", category: "technical" as const, demandScore: 88, growthRate: 5 },
  { name: "Kubernetes", slug: "kubernetes", category: "technical" as const, demandScore: 82, growthRate: 8 },
  { name: "Terraform", slug: "terraform", category: "tool" as const, demandScore: 75, growthRate: 12 },
  { name: "CI/CD", slug: "ci-cd", category: "technical" as const, demandScore: 85, growthRate: 5 },
  { name: "GitHub Actions", slug: "github-actions", category: "tool" as const, demandScore: 72, growthRate: 15 },
  { name: "Vercel", slug: "vercel", category: "tool" as const, demandScore: 65, growthRate: 20 },

  // AI/ML
  { name: "Machine Learning", slug: "machine-learning", category: "technical" as const, demandScore: 88, growthRate: 12 },
  { name: "Deep Learning", slug: "deep-learning", category: "technical" as const, demandScore: 82, growthRate: 15 },
  { name: "PyTorch", slug: "pytorch", category: "tool" as const, demandScore: 78, growthRate: 15 },
  { name: "TensorFlow", slug: "tensorflow", category: "tool" as const, demandScore: 72, growthRate: 5 },
  { name: "LLMs/GenAI", slug: "llms-genai", category: "technical" as const, demandScore: 92, growthRate: 50 },
  { name: "NLP", slug: "nlp", category: "technical" as const, demandScore: 75, growthRate: 15 },
  { name: "Computer Vision", slug: "computer-vision", category: "technical" as const, demandScore: 70, growthRate: 10 },
  { name: "MLOps", slug: "mlops", category: "technical" as const, demandScore: 72, growthRate: 20 },

  // Data
  { name: "Data Engineering", slug: "data-engineering", category: "technical" as const, demandScore: 82, growthRate: 10 },
  { name: "Data Analysis", slug: "data-analysis", category: "technical" as const, demandScore: 85, growthRate: 8 },
  { name: "Apache Spark", slug: "apache-spark", category: "tool" as const, demandScore: 68, growthRate: 3 },
  { name: "Apache Kafka", slug: "apache-kafka", category: "tool" as const, demandScore: 72, growthRate: 8 },
  { name: "dbt", slug: "dbt", category: "tool" as const, demandScore: 65, growthRate: 22 },

  // Mobile
  { name: "React Native", slug: "react-native", category: "technical" as const, demandScore: 72, growthRate: 5 },
  { name: "Flutter", slug: "flutter", category: "technical" as const, demandScore: 68, growthRate: 12 },
  { name: "iOS Development", slug: "ios-development", category: "technical" as const, demandScore: 75, growthRate: 3 },
  { name: "Android Development", slug: "android-development", category: "technical" as const, demandScore: 72, growthRate: 2 },

  // Design
  { name: "UI/UX Design", slug: "ui-ux-design", category: "domain" as const, demandScore: 85, growthRate: 5 },
  { name: "Figma", slug: "figma", category: "tool" as const, demandScore: 88, growthRate: 10 },
  { name: "Design Systems", slug: "design-systems", category: "domain" as const, demandScore: 75, growthRate: 12 },
  { name: "Prototyping", slug: "prototyping", category: "domain" as const, demandScore: 72, growthRate: 5 },
  { name: "User Research", slug: "user-research", category: "domain" as const, demandScore: 70, growthRate: 8 },

  // Product/Management
  { name: "Product Management", slug: "product-management", category: "domain" as const, demandScore: 82, growthRate: 5 },
  { name: "Agile/Scrum", slug: "agile-scrum", category: "domain" as const, demandScore: 78, growthRate: 2 },
  { name: "Project Management", slug: "project-management", category: "domain" as const, demandScore: 75, growthRate: 3 },
  { name: "Technical Writing", slug: "technical-writing", category: "domain" as const, demandScore: 65, growthRate: 8 },

  // Soft Skills
  { name: "Leadership", slug: "leadership", category: "soft" as const, demandScore: 88, growthRate: 3 },
  { name: "Communication", slug: "communication", category: "soft" as const, demandScore: 92, growthRate: 2 },
  { name: "Problem Solving", slug: "problem-solving", category: "soft" as const, demandScore: 90, growthRate: 2 },
  { name: "Teamwork", slug: "teamwork", category: "soft" as const, demandScore: 88, growthRate: 1 },
  { name: "Mentoring", slug: "mentoring", category: "soft" as const, demandScore: 72, growthRate: 5 },
  { name: "System Design", slug: "system-design", category: "technical" as const, demandScore: 85, growthRate: 8 },

  // Security
  { name: "Cybersecurity", slug: "cybersecurity", category: "domain" as const, demandScore: 85, growthRate: 12 },
  { name: "OAuth/Auth", slug: "oauth-auth", category: "technical" as const, demandScore: 72, growthRate: 5 },

  // Testing
  { name: "Unit Testing", slug: "unit-testing", category: "technical" as const, demandScore: 82, growthRate: 3 },
  { name: "E2E Testing", slug: "e2e-testing", category: "technical" as const, demandScore: 72, growthRate: 8 },
  { name: "Playwright", slug: "playwright", category: "tool" as const, demandScore: 62, growthRate: 25 },
  { name: "Jest", slug: "jest", category: "tool" as const, demandScore: 75, growthRate: 2 },

  // Languages (spoken)
  { name: "English", slug: "english", category: "language" as const, demandScore: 95, growthRate: 0 },
  { name: "German", slug: "german", category: "language" as const, demandScore: 55, growthRate: 2 },
  { name: "French", slug: "french", category: "language" as const, demandScore: 50, growthRate: 1 },
  { name: "Spanish", slug: "spanish", category: "language" as const, demandScore: 52, growthRate: 2 },
  { name: "Mandarin", slug: "mandarin", category: "language" as const, demandScore: 48, growthRate: 5 },
];

// ============================================================================
// Jobs (100+ realistic jobs)
// ============================================================================

const companies = [
  { name: "Stripe", domain: "stripe.com" },
  { name: "Vercel", domain: "vercel.com" },
  { name: "Linear", domain: "linear.app" },
  { name: "Notion", domain: "notion.so" },
  { name: "GitHub", domain: "github.com" },
  { name: "Figma", domain: "figma.com" },
  { name: "Shopify", domain: "shopify.com" },
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "Spotify", domain: "spotify.com" },
  { name: "Slack", domain: "slack.com" },
  { name: "Discord", domain: "discord.com" },
  { name: "Datadog", domain: "datadoghq.com" },
  { name: "Cloudflare", domain: "cloudflare.com" },
  { name: "Supabase", domain: "supabase.com" },
  { name: "PlanetScale", domain: "planetscale.com" },
  { name: "Retool", domain: "retool.com" },
  { name: "Loom", domain: "loom.com" },
  { name: "Plaid", domain: "plaid.com" },
  { name: "Scale AI", domain: "scale.com" },
];

type Level = "intern" | "junior" | "mid" | "senior" | "lead" | "principal" | "director" | "vp";
type JType = "full_time" | "part_time" | "contract";
type Remote = "remote" | "hybrid" | "onsite";

const roles: Array<{
  title: string;
  level: Level;
  type: JType;
  remote: Remote;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  description: string;
}> = [
  { title: "Senior Frontend Engineer", level: "senior", type: "full_time", remote: "remote", salaryMin: 150000, salaryMax: 200000, skills: ["react", "typescript", "nextjs", "tailwind-css"], description: "Build and maintain our web application using React, Next.js, and TypeScript. Drive frontend architecture decisions and mentor junior engineers." },
  { title: "Staff Backend Engineer", level: "lead", type: "full_time", remote: "remote", salaryMin: 200000, salaryMax: 280000, skills: ["go", "postgresql", "kubernetes", "system-design"], description: "Lead the design and implementation of scalable backend services. Define technical direction for the platform." },
  { title: "Full-Stack Engineer", level: "mid", type: "full_time", remote: "hybrid", salaryMin: 120000, salaryMax: 170000, skills: ["typescript", "react", "nodejs", "postgresql"], description: "Build features across the entire stack. Work with product and design to ship delightful experiences." },
  { title: "Junior Software Engineer", level: "junior", type: "full_time", remote: "onsite", salaryMin: 80000, salaryMax: 110000, skills: ["javascript", "react", "html-css", "unit-testing"], description: "Join our engineering team and build features for our core product. Great opportunity for growth with mentoring from senior engineers." },
  { title: "Product Designer", level: "senior", type: "full_time", remote: "remote", salaryMin: 140000, salaryMax: 185000, skills: ["figma", "ui-ux-design", "design-systems", "prototyping"], description: "Design beautiful, intuitive experiences for millions of users. Own the end-to-end design process from research to final pixels." },
  { title: "ML Engineer", level: "senior", type: "full_time", remote: "remote", salaryMin: 180000, salaryMax: 250000, skills: ["python", "pytorch", "machine-learning", "llms-genai"], description: "Build and deploy machine learning models at scale. Work on cutting-edge AI features using LLMs and generative AI." },
  { title: "DevOps Engineer", level: "mid", type: "full_time", remote: "remote", salaryMin: 130000, salaryMax: 175000, skills: ["aws", "kubernetes", "terraform", "ci-cd"], description: "Own our infrastructure and deployment pipelines. Ensure reliability, scalability, and security of our platform." },
  { title: "Data Engineer", level: "senior", type: "full_time", remote: "hybrid", salaryMin: 160000, salaryMax: 210000, skills: ["python", "apache-spark", "apache-kafka", "data-engineering"], description: "Build data pipelines and infrastructure to power analytics and ML. Work with petabyte-scale data." },
  { title: "iOS Engineer", level: "mid", type: "full_time", remote: "remote", salaryMin: 135000, salaryMax: 180000, skills: ["swift", "ios-development", "ui-ux-design"], description: "Build and maintain our iOS app used by millions. Ship pixel-perfect UI with smooth animations." },
  { title: "Engineering Manager", level: "director", type: "full_time", remote: "hybrid", salaryMin: 200000, salaryMax: 280000, skills: ["leadership", "system-design", "agile-scrum", "mentoring"], description: "Lead a team of 8-12 engineers. Drive technical strategy, hire great people, and create an environment where everyone can do their best work." },
  { title: "Product Manager", level: "senior", type: "full_time", remote: "remote", salaryMin: 150000, salaryMax: 200000, skills: ["product-management", "data-analysis", "communication", "agile-scrum"], description: "Own the product roadmap and strategy. Work closely with engineering and design to ship features that users love." },
  { title: "Security Engineer", level: "senior", type: "full_time", remote: "remote", salaryMin: 170000, salaryMax: 230000, skills: ["cybersecurity", "aws", "oauth-auth", "python"], description: "Protect our platform and users. Build security tooling, conduct threat modeling, and drive security best practices." },
  { title: "Platform Engineer", level: "senior", type: "full_time", remote: "remote", salaryMin: 165000, salaryMax: 220000, skills: ["go", "kubernetes", "aws", "system-design"], description: "Build the platform that other engineers build on. Design APIs, improve developer experience, and scale our infrastructure." },
  { title: "Technical Writer", level: "mid", type: "contract", remote: "remote", salaryMin: 90000, salaryMax: 130000, skills: ["technical-writing", "communication", "rest-apis"], description: "Write clear, comprehensive documentation for our API and developer tools. Make complex things simple." },
  { title: "QA Engineer", level: "mid", type: "full_time", remote: "hybrid", salaryMin: 100000, salaryMax: 140000, skills: ["e2e-testing", "playwright", "jest", "unit-testing"], description: "Ensure product quality through automated testing. Build and maintain our test infrastructure." },
];

const locations = [
  { city: "San Francisco", country: "US" },
  { city: "New York", country: "US" },
  { city: "London", country: "UK" },
  { city: "Berlin", country: "DE" },
  { city: "Toronto", country: "CA" },
  { city: "Amsterdam", country: "NL" },
  { city: "Remote", country: "US" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await db.jobSkill.deleteMany();
  await db.job.deleteMany();
  await db.skill.deleteMany();

  // Seed skills
  console.log(`Seeding ${skills.length} skills...`);
  await db.skill.createMany({ data: skills });

  const allSkills = await db.skill.findMany();
  const skillMap = new Map(allSkills.map((s) => [s.slug, s.id]));

  // Seed jobs (100+)
  console.log("Seeding 100+ jobs...");
  const jobs: Array<{
    title: string;
    company: string;
    companyDomain: string;
    location: string;
    country: string;
    remotePolicy: Remote;
    type: JType;
    level: Level;
    description: string;
    requirements: string[];
    salaryMin: number;
    salaryMax: number;
    salaryCurrency: string;
    postedAt: Date;
    featured: boolean;
    skillSlugs: string[];
  }> = [];

  for (let i = 0; i < 120; i++) {
    const role = randomFrom(roles);
    const company = randomFrom(companies);
    const loc = role.remote === "remote" ? { city: "Remote", country: "US" } : randomFrom(locations);
    const daysAgo = Math.floor(Math.random() * 30);

    jobs.push({
      title: role.title,
      company: company.name,
      companyDomain: company.domain,
      location: loc.city,
      country: loc.country,
      remotePolicy: role.remote,
      type: role.type,
      level: role.level,
      description: role.description,
      requirements: [`${Math.floor(Math.random() * 5) + 2}+ years of experience`, "Strong problem-solving skills", "Excellent communication"],
      salaryMin: role.salaryMin + Math.floor(Math.random() * 20000),
      salaryMax: role.salaryMax + Math.floor(Math.random() * 20000),
      salaryCurrency: "USD",
      postedAt: new Date(Date.now() - daysAgo * 86400000),
      featured: i < 5,
      skillSlugs: role.skills,
    });
  }

  for (const job of jobs) {
    const { skillSlugs, ...jobData } = job;
    const created = await db.job.create({ data: jobData });
    const jobSkillData = skillSlugs
      .map((slug) => skillMap.get(slug))
      .filter((id): id is string => !!id)
      .map((skillId) => ({ jobId: created.id, skillId }));
    if (jobSkillData.length > 0) {
      await db.jobSkill.createMany({ data: jobSkillData });
    }
  }

  // Seed salary data (5000+)
  console.log("Seeding 5000+ salary data points...");
  const salaryData = [];
  const titles = ["Software Engineer", "Senior Software Engineer", "Staff Engineer", "Principal Engineer", "Engineering Manager", "Product Manager", "Product Designer", "Data Scientist", "ML Engineer", "DevOps Engineer"];
  const levels: Level[] = ["junior", "mid", "senior", "lead", "principal", "director"];
  const salaryLocations = ["San Francisco", "New York", "Seattle", "Austin", "London", "Berlin", "Toronto", "Remote"];
  const salaryCountries = ["US", "US", "US", "US", "UK", "DE", "CA", "US"];

  for (let i = 0; i < 5000; i++) {
    const titleIdx = Math.floor(Math.random() * titles.length);
    const levelIdx = Math.floor(Math.random() * levels.length);
    const locIdx = Math.floor(Math.random() * salaryLocations.length);
    const baseSalary = 60000 + levelIdx * 30000 + Math.floor(Math.random() * 40000);
    const bonus = Math.floor(baseSalary * (0.05 + Math.random() * 0.2));

    salaryData.push({
      title: titles[titleIdx],
      level: levels[levelIdx],
      location: salaryLocations[locIdx],
      country: salaryCountries[locIdx],
      company: randomFrom(companies).name,
      baseSalary,
      totalCompensation: baseSalary + bonus,
      currency: "USD",
      yearsOfExperience: levelIdx * 2 + Math.floor(Math.random() * 3),
      reportedAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000),
    });
  }

  await db.salaryDataPoint.createMany({ data: salaryData });

  console.log("Seed complete!");
  console.log(`  Skills: ${skills.length}`);
  console.log(`  Jobs: ${jobs.length}`);
  console.log(`  Salary data points: ${salaryData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
