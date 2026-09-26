"use client";

import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { Project } from "@/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      message.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toggleField = async (id: string, field: "published" | "featured", value: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error();
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)),
      );
      message.success(`Project ${value ? field : `un${field}`}`);
    } catch {
      message.error("Update failed");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p._id !== id));
      message.success("Project deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  return { projects, loading, toggleField, deleteProject, refresh: fetchProjects };
}
