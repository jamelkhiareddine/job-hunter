export const PROFILE = {
  name: "Mohamed Jamel Khiareddine",
  title: "Senior Full-Stack Engineer",
  skills: "Node.js, TypeScript, NestJS, React, GCP, Azure, Docker, Kubernetes, PostgreSQL, Microservices",
  experience:
    "4+ years building scalable microservices, real-time systems, payment solutions. Tech Lead at EMKAMed. Built fleet tracking SaaS (1000+ vehicles), ride-hailing backend (50K+ concurrent), e-commerce platform on Azure.",
  languages: "English (Advanced), French (Conversational), German (A2)",
  location: "Tunisia – open to relocation to Germany",
};

// --- Job-fit scorer -----------------------------------------------------------

/** Skills parsed from PROFILE.skills, used for matching */
export const PROFILE_SKILLS: string[] = [
  "Node.js", "TypeScript", "NestJS", "React", "GCP", "Azure",
  "Docker", "Kubernetes", "PostgreSQL", "Microservices",
  "REST", "GraphQL", "CI/CD", "Redis", "MongoDB",
  "Full-Stack", "Backend", "Cloud",
];

export interface ScoreResult {
  score: number;      // 0–100
  matched: string[];  // skill names found in the job
}

/**
 * Score a job against the user's profile.
 * Title matches count 3×, description matches count 1×.
 */
export function scoreJob(title: string, description: string): ScoreResult {
  const haystack = `${title} ${description}`.toLowerCase();
  const titleHay = title.toLowerCase();

  const matched: string[] = [];
  let hits = 0;

  for (const skill of PROFILE_SKILLS) {
    const needle = skill.toLowerCase();
    const inTitle = titleHay.includes(needle);
    const inDesc  = haystack.includes(needle);
    if (inTitle || inDesc) {
      matched.push(skill);
      hits += inTitle ? 3 : 1;
    }
  }

  // Normalise: perfect match = all skills found in title → PROFILE_SKILLS.length * 3
  const maxHits = PROFILE_SKILLS.length * 3;
  const score   = Math.min(100, Math.round((hits / maxHits) * 100 * 2.5));
  return { score, matched };
}

// ------------------------------------------------------------------------------

export type Platform = {
  name: string;
  color: string;
  bg: string;
  emoji: string;
  searches: { label: string; url: string }[];
  buildUrl: (kw: string, loc: string, period?: string) => string;
  periodOptions: { value: string; label: string }[];
};

export const PLATFORMS: Record<string, Platform> = {
  linkedin: {
    name: "LinkedIn",
    color: "#0a66c2",
    bg: "#e8f0fb",
    emoji: "💼",
    searches: [
      { label: "Node.js Developer", url: "https://www.linkedin.com/jobs/search/?keywords=Node.js%20Developer&location=Germany&f_TPR=r604800" },
      { label: "NestJS Engineer", url: "https://www.linkedin.com/jobs/search/?keywords=NestJS%20Engineer&location=Germany&f_TPR=r604800" },
      { label: "Full-Stack TypeScript", url: "https://www.linkedin.com/jobs/search/?keywords=Full-Stack%20TypeScript&location=Germany&f_TPR=r604800" },
      { label: "Backend Node.js Berlin", url: "https://www.linkedin.com/jobs/search/?keywords=Backend%20Node.js&location=Berlin%2C%20Germany&f_TPR=r604800" },
      { label: "Senior Engineer React Berlin", url: "https://www.linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer%20React&location=Berlin%2C%20Germany&f_TPR=r604800" },
      { label: "Node.js Munich", url: "https://www.linkedin.com/jobs/search/?keywords=Node.js&location=Munich%2C%20Germany&f_TPR=r604800" },
    ],
    buildUrl: (kw, loc, period) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(kw)}&location=${encodeURIComponent(loc)}&f_TPR=${period}`,
    periodOptions: [
      { value: "r86400", label: "Last 24h" },
      { value: "r604800", label: "Last 7 days" },
      { value: "r2592000", label: "Last 30 days" },
    ],
  },
  stepstone: {
    name: "StepStone.de",
    color: "#cc0000",
    bg: "#fff0f0",
    emoji: "🪜",
    searches: [
      { label: "Node.js Entwickler", url: "https://www.stepstone.de/jobs/node-js-entwickler/in-deutschland" },
      { label: "TypeScript Engineer", url: "https://www.stepstone.de/jobs/typescript-engineer/in-deutschland" },
      { label: "Full-Stack Berlin", url: "https://www.stepstone.de/jobs/full-stack-entwickler/in-berlin" },
      { label: "Backend NestJS", url: "https://www.stepstone.de/jobs/backend-developer/in-deutschland?q=nestjs" },
      { label: "Senior Software Engineer", url: "https://www.stepstone.de/jobs/senior-software-engineer/in-deutschland" },
      { label: "React Developer Munich", url: "https://www.stepstone.de/jobs/react-developer/in-muenchen" },
    ],
    buildUrl: (kw, loc) =>
      `https://www.stepstone.de/jobs/${encodeURIComponent(kw.toLowerCase().replace(/ /g, "-"))}/in-${encodeURIComponent((loc || "deutschland").toLowerCase().replace(/ /g, "-"))}`,
    periodOptions: [],
  },
  xing: {
    name: "XING",
    color: "#00a094",
    bg: "#e6f7f6",
    emoji: "✦",
    searches: [
      { label: "Node.js Deutschland", url: "https://www.xing.com/jobs/search?keywords=Node.js&location=Deutschland" },
      { label: "TypeScript Backend", url: "https://www.xing.com/jobs/search?keywords=TypeScript+Backend&location=Deutschland" },
      { label: "Full-Stack React", url: "https://www.xing.com/jobs/search?keywords=Full-Stack+React&location=Deutschland" },
      { label: "Senior Engineer Berlin", url: "https://www.xing.com/jobs/search?keywords=Senior+Software+Engineer&location=Berlin" },
      { label: "NestJS Developer", url: "https://www.xing.com/jobs/search?keywords=NestJS&location=Deutschland" },
      { label: "Cloud GCP Engineer", url: "https://www.xing.com/jobs/search?keywords=Cloud+GCP+Engineer&location=Deutschland" },
    ],
    buildUrl: (kw, loc) =>
      `https://www.xing.com/jobs/search?keywords=${encodeURIComponent(kw)}&location=${encodeURIComponent(loc || "Deutschland")}`,
    periodOptions: [],
  },
  indeed: {
    name: "Indeed Germany",
    color: "#2164f3",
    bg: "#eef2ff",
    emoji: "🔎",
    searches: [
      { label: "Node.js Developer", url: "https://de.indeed.com/jobs?q=Node.js+Developer&l=Deutschland" },
      { label: "TypeScript Engineer", url: "https://de.indeed.com/jobs?q=TypeScript+Engineer&l=Deutschland" },
      { label: "NestJS Backend", url: "https://de.indeed.com/jobs?q=NestJS+Backend&l=Deutschland" },
      { label: "Full-Stack React Berlin", url: "https://de.indeed.com/jobs?q=Full+Stack+React+Developer&l=Berlin" },
      { label: "Senior Node.js Munich", url: "https://de.indeed.com/jobs?q=Senior+Node.js&l=M%C3%BCnchen" },
      { label: "Microservices Engineer", url: "https://de.indeed.com/jobs?q=Microservices+Engineer&l=Deutschland" },
    ],
    buildUrl: (kw, loc, period) =>
      `https://de.indeed.com/jobs?q=${encodeURIComponent(kw)}&l=${encodeURIComponent(loc || "Deutschland")}${period ? `&fromage=${period}` : ""}`,
    periodOptions: [
      { value: "1", label: "Last 24h" },
      { value: "3", label: "Last 3 days" },
      { value: "7", label: "Last 7 days" },
    ],
  },
  wttj: {
    name: "Welcome to the Jungle",
    color: "#7c3aed",
    bg: "#f3eeff",
    emoji: "🌿",
    searches: [
      { label: "Node.js Germany", url: "https://www.welcometothejungle.com/en/jobs?query=Node.js&aroundQuery=Germany" },
      { label: "TypeScript Full-Stack", url: "https://www.welcometothejungle.com/en/jobs?query=TypeScript+Full-Stack&aroundQuery=Germany" },
      { label: "Backend Engineer Berlin", url: "https://www.welcometothejungle.com/en/jobs?query=Backend+Engineer&aroundQuery=Berlin%2C+Germany" },
      { label: "React Developer", url: "https://www.welcometothejungle.com/en/jobs?query=React+Developer&aroundQuery=Germany" },
      { label: "Senior Engineer Munich", url: "https://www.welcometothejungle.com/en/jobs?query=Senior+Software+Engineer&aroundQuery=Munich%2C+Germany" },
      { label: "Cloud Microservices", url: "https://www.welcometothejungle.com/en/jobs?query=Cloud+Microservices&aroundQuery=Germany" },
    ],
    buildUrl: (kw, loc) =>
      `https://www.welcometothejungle.com/en/jobs?query=${encodeURIComponent(kw)}&aroundQuery=${encodeURIComponent(loc || "Germany")}`,
    periodOptions: [],
  },
};

export type Recommendation = {
  id: number;
  author: string;
  role: string;
  company: string;
  avatar: string; // initials fallback
  avatarColor: string;
  relation: string;
  date: string;
  text: string;
  linkedin?: string;
};

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    author: "Anis Ben Romdhane",
    role: "CTO",
    company: "EMKAMed",
    avatar: "AB",
    avatarColor: "#2563eb",
    relation: "Managed Mohamed directly",
    date: "January 2025",
    text: "Mohamed is one of the most talented engineers I've had the pleasure of working with. As Tech Lead, he architected our entire fleet-tracking SaaS from the ground up — handling 1,000+ concurrent vehicles with rock-solid uptime. His mastery of NestJS, Kubernetes, and event-driven systems is exceptional. Beyond the technical depth, Mohamed is a natural leader who mentors junior devs and always delivers on time.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: 2,
    author: "Sarra Mabrouk",
    role: "Product Manager",
    company: "RideConnect",
    avatar: "SM",
    avatarColor: "#7c3aed",
    relation: "Worked with Mohamed on the same team",
    date: "October 2024",
    text: "Working with Mohamed on our ride-hailing backend was an incredible experience. He single-handedly scaled our system to handle 50,000+ concurrent users without a single critical outage. What sets Mohamed apart is his ability to translate complex technical challenges into business language and align eng priorities with product goals. He's also proactive — he flagged potential bottlenecks before they became problems.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: 3,
    author: "Karim Azizi",
    role: "Senior Software Engineer",
    company: "AzureCommerce GmbH",
    avatar: "KA",
    avatarColor: "#0ea5e9",
    relation: "Collaborated on the same project",
    date: "March 2024",
    text: "I had the chance to collaborate with Mohamed on a large e-commerce platform migration to Azure microservices. His deep knowledge of Docker, CI/CD pipelines, and PostgreSQL optimization shaved weeks off our timeline. He's the kind of engineer who doesn't just write clean code — he designs systems that grow gracefully. Any team would be lucky to have him.",
    linkedin: "https://www.linkedin.com/",
  },
];

export const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Saved:     { color: "#6366f1", bg: "#eef2ff" },
  Applied:   { color: "#0ea5e9", bg: "#e0f2fe" },
  Interview: { color: "#f59e0b", bg: "#fef3c7" },
  Offer:     { color: "#10b981", bg: "#d1fae5" },
  Rejected:  { color: "#ef4444", bg: "#fee2e2" },
};

export type Job = {
  id: number;
  title: string;
  company: string;
  url: string;
  description: string;
  status: string;
  notes: string;
  source: string;
  date: string;
};
