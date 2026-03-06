import { NextRequest, NextResponse } from "next/server";
import { PROFILE } from "@/lib/data";

// Smart template variants — picked randomly for variety on "Regenerate"
const OPENERS = [
  `I am writing to express my strong interest in the {title} position at {company}.`,
  `The {title} role at {company} immediately caught my attention, and I am excited to put forward my application.`,
  `Having followed {company}'s growth in the German tech scene, I was delighted to come across the {title} opening.`,
  `I would love to bring my background in Node.js and cloud architecture to the {title} role at {company}.`,
];

const CLOSERS = [
  `I would welcome the opportunity to discuss how my background aligns with {company}'s goals. Thank you for your consideration.`,
  `I am genuinely excited about the prospect of joining {company} and contributing to your engineering team. I look forward to hearing from you.`,
  `Thank you for considering my application. I am happy to provide any additional information and look forward to the possibility of working together at {company}.`,
  `I am confident that my experience maps well to what {company} is building, and I would be thrilled to discuss this further.`,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] || "");
}

function extractKeywords(description: string): string[] {
  const keywords = [
    "Node.js", "NestJS", "TypeScript", "React", "Next.js",
    "GraphQL", "REST", "Microservices", "Docker", "Kubernetes",
    "PostgreSQL", "MongoDB", "Redis", "GCP", "AWS", "Azure",
    "CI/CD", "Agile", "Scrum", "TDD", "testing",
  ];
  return keywords.filter(k => description.toLowerCase().includes(k.toLowerCase()));
}

export async function POST(req: NextRequest) {
  const { job } = await req.json();

  const vars = {
    title: job.title || "Software Engineer",
    company: job.company || "your company",
    name: PROFILE.name,
  };

  // Detect relevant skills from job description
  const matched = job.description ? extractKeywords(job.description) : [];
  const highlightedSkills = matched.length > 0
    ? matched.slice(0, 5).join(", ")
    : "Node.js, TypeScript, React, and cloud infrastructure";

  // Build the body paragraph around what the job mentions
  const bodyParagraph = job.description
    ? `With ${PROFILE.experience.split(".")[0].toLowerCase()}, I have developed deep expertise in ${highlightedSkills} — skills that map directly to what you are looking for. ${
        matched.includes("Microservices") || matched.includes("Docker")
          ? "My hands-on experience designing distributed microservices and containerised deployments means I can contribute from day one."
          : matched.includes("React") || matched.includes("TypeScript")
          ? "I take pride in writing clean, maintainable TypeScript across both backend and frontend, with a strong focus on developer experience and code quality."
          : "I am comfortable working across the full stack and thrive in environments that value clean architecture and engineering rigour."
      }`
    : `With ${PROFILE.experience.split(".")[0].toLowerCase()}, I have built production-grade systems using Node.js, TypeScript, React, and cloud platforms (GCP and Azure). I am comfortable leading technical decisions as well as writing hands-on code, and I take pride in shipping reliable, well-tested software.`;

  const relocation = `I am currently based in Tunisia and am actively planning to relocate to Germany. I hold an advanced level of English, conversational French, and am actively learning German (currently A2).`;

  const letter = [
    fill(pick(OPENERS), vars),
    "",
    bodyParagraph,
    "",
    relocation,
    "",
    fill(pick(CLOSERS), vars),
    "",
    `Best regards,`,
    PROFILE.name,
    `${PROFILE.title}`,
    `khiareddine.mj@gmail.com`,
  ].join("\n");

  return NextResponse.json({ letter });
}
