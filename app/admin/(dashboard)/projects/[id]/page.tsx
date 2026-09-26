import type { Metadata } from "next";
import ProjectEditContent from "@/components/ProjectEditContent";

export const metadata: Metadata = {
  title: "Edit Project — Portfolio Admin",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditContent id={id} />;
}
