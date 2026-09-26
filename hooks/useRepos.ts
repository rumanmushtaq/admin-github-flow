"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import type { GitHubRepo } from "@/types";

export function useRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/repos");
      if (!res.ok) throw new Error("Failed to fetch repos");
      const { repos: data } = await res.json();
      setRepos(data);
    } catch {
      message.error("Failed to fetch GitHub repos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const importRepo = async (repo: GitHubRepo) => {
    setImporting((prev) => new Set(prev).add(repo.githubId));
    try {
      const res = await fetch("/api/admin/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repo),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
      }

      message.success(`"${repo.name}" imported with AI description`);
      setRepos((prev) =>
        prev.map((r) => (r.githubId === repo.githubId ? { ...r, imported: true } : r)),
      );
    } catch (err: any) {
      message.error(err.message || "Import failed");
    } finally {
      setImporting((prev) => {
        const next = new Set(prev);
        next.delete(repo.githubId);
        return next;
      });
    }
  };

  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();

  const filtered = repos.filter((repo) => {
    if (search && !repo.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (languageFilter && repo.language !== languageFilter) return false;
    return true;
  });

  return {
    repos: filtered,
    loading,
    importing,
    search,
    setSearch,
    languageFilter,
    setLanguageFilter,
    languages,
    importRepo,
    refresh: fetchRepos,
  };
}
