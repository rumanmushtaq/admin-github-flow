import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchReadme } from "@/lib/github";
import { generateProjectContent } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { githubId, name, fullName, githubUrl, homepage, description, language, stars, topics } = body;

  await dbConnect();

  const existing = await Project.findOne({ githubId });
  if (existing) {
    return NextResponse.json({ error: "Project already imported" }, { status: 409 });
  }

  const readme = await fetchReadme(fullName);
  const aiContent = await generateProjectContent({
    name,
    description: description || "",
    language: language || "Unknown",
    topics: topics || [],
    readme,
  });

  const count = await Project.countDocuments();

  const project = await Project.create({
    githubId,
    name,
    fullName,
    githubUrl,
    homepage: homepage || null,
    title: aiContent.title,
    description: aiContent.description,
    techStack: aiContent.techStack,
    category: aiContent.category,
    githubStars: stars || 0,
    language: language || "Unknown",
    order: count,
  });

  return NextResponse.json({ project }, { status: 201 });
}
