import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchReadme } from "@/lib/github";
import { generateProjectContent } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await dbConnect();

  const project = await Project.findById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const readme = await fetchReadme(project.fullName);
  const aiContent = await generateProjectContent({
    name: project.name,
    description: project.description,
    language: project.language,
    topics: project.techStack,
    readme,
  });

  project.title = aiContent.title;
  project.description = aiContent.description;
  project.techStack = aiContent.techStack;
  project.category = aiContent.category;
  await project.save();

  return NextResponse.json({ project });
}
