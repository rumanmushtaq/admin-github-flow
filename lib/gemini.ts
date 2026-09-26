import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GeneratedContent {
  title: string;
  description: string;
  techStack: string[];
  category: string;
}

export async function generateProjectContent(repo: {
  name: string;
  description: string;
  language: string;
  topics: string[];
  readme: string;
}): Promise<GeneratedContent> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a professional portfolio writer. Given this GitHub repository information, generate portfolio content.

Repository: ${repo.name}
Description: ${repo.description}
Language: ${repo.language}
Topics: ${repo.topics.join(", ")}
README (first 2000 chars): ${repo.readme}

Respond ONLY with valid JSON, no markdown or code fences:
{
  "title": "Professional display title (not the repo slug, make it human-readable)",
  "description": "2-3 sentence professional description highlighting what it does, key technologies, and its purpose",
  "techStack": ["Technology1", "Technology2"],
  "category": "Web App" or "AI/ML" or "Mobile" or "Library" or "Other"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      title: repo.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: repo.description || "A software project.",
      techStack: repo.language ? [repo.language] : [],
      category: "Other",
    };
  }

  return JSON.parse(jsonMatch[0]);
}
