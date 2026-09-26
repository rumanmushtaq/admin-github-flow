"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";

export function useProjectEdit(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        if (!res.ok) throw new Error();
        const { projects } = await res.json();
        const found = projects.find((p: any) => p._id === id);
        if (found) setProject(found);
        else message.error("Project not found");
      } catch {
        message.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const save = async (values: Partial<Project>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      const { project: updated } = await res.json();
      setProject(updated);
      message.success("Project saved");
    } catch {
      message.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}/regenerate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const { project: updated } = await res.json();
      setProject(updated);
      message.success("AI content regenerated");
    } catch {
      message.error("Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  const remove = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      message.success("Project deleted");
      router.push("/admin/projects");
    } catch {
      message.error("Delete failed");
    }
  };

  return { project, loading, saving, regenerating, save, regenerate, remove };
}
