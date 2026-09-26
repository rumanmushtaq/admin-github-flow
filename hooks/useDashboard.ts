"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/types";

interface DashboardStats {
  totalRepos: number;
  imported: number;
  published: number;
  featured: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRepos: 0,
    imported: 0,
    published: 0,
    featured: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reposRes, projectsRes] = await Promise.all([
        fetch("/api/admin/repos"),
        fetch("/api/admin/projects/import"),
      ]);

      if (reposRes.ok) {
        const { repos } = await reposRes.json();
        const importedCount = repos.filter((r: any) => r.imported).length;
        setStats((prev) => ({ ...prev, totalRepos: repos.length, imported: importedCount }));
      }

      const projectsRes2 = await fetch("/api/admin/projects");
      if (projectsRes2.ok) {
        const { projects: projectsList } = await projectsRes2.json();
        setRecentProjects(projectsList.slice(0, 5));
        setStats((prev) => ({
          ...prev,
          imported: projectsList.length,
          published: projectsList.filter((p: Project) => p.published).length,
          featured: projectsList.filter((p: Project) => p.featured).length,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { stats, recentProjects, loading, refresh: fetchData };
}
