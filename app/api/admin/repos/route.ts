import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchGitHubRepos } from "@/lib/github";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const repos = await fetchGitHubRepos();
  const imported = await Project.find({}).select("githubId").lean();
  const importedIds = new Set(imported.map((p: any) => p.githubId));

  const enriched = repos.map((repo) => ({
    ...repo,
    imported: importedIds.has(repo.githubId),
  }));

  return NextResponse.json({ repos: enriched });
}
