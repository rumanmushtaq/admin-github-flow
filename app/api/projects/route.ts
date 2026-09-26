import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  await dbConnect();

  const projects = await Project.find({ published: true })
    .sort({ featured: -1, order: 1 })
    .select("-__v")
    .lean();

  return NextResponse.json({ projects });
}
