"use client";

import { Table, Input, Select, Button, Tag, Space, Grid, Spin } from "antd";
import {
  SearchOutlined,
  SyncOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  StarOutlined,
  GithubOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { useRepos } from "@/hooks/useRepos";
import type { GitHubRepo } from "@/types";

const { useBreakpoint } = Grid;

export default function ReposContent() {
  const {
    repos,
    loading,
    importing,
    search,
    setSearch,
    languageFilter,
    setLanguageFilter,
    languages,
    importRepo,
    refresh,
  } = useRepos();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns = [
    {
      title: "Repository",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: GitHubRepo) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CodeOutlined style={{ color: "#818cf8", fontSize: 16 }} />
          </div>
          <div>
            <a href={record.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
              {name}
            </a>
            {record.description && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 1, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: 130,
      render: (lang: string) => lang && lang !== "Unknown" && <Tag className="tag-language">{lang}</Tag>,
    },
    {
      title: "Stars",
      dataIndex: "stars",
      key: "stars",
      width: 90,
      sorter: (a: GitHubRepo, b: GitHubRepo) => a.stars - b.stars,
      render: (stars: number) => (
        <span className="star-count">
          <StarOutlined />
          {stars}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      render: (_: unknown, record: GitHubRepo) =>
        record.imported ? (
          <Tag icon={<CheckCircleOutlined />} className="tag-imported">Imported</Tag>
        ) : (
          <Tag className="tag-new">New</Tag>
        ),
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_: unknown, record: GitHubRepo) =>
        record.imported ? (
          <Tag className="tag-imported" style={{ fontSize: 12 }}>Done</Tag>
        ) : (
          <Button
            className="btn-primary"
            size="small"
            icon={<ImportOutlined />}
            loading={importing.has(record.githubId)}
            onClick={() => importRepo(record)}
            style={{ height: 32, borderRadius: 8, fontSize: 13 }}
          >
            Import
          </Button>
        ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">GitHub Repos</h1>
          <p className="page-subtitle">Import repositories and generate AI descriptions</p>
        </div>
        <Button className="btn-ghost" icon={<SyncOutlined />} onClick={refresh} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Sync
        </Button>
      </div>

      <div className="dark-input" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <Input
          placeholder="Search repos..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: isMobile ? "100%" : 280, height: 40, borderRadius: 10 }}
          allowClear
        />
        <Select
          placeholder="Filter by language"
          value={languageFilter}
          onChange={setLanguageFilter}
          allowClear
          style={{ width: isMobile ? "100%" : 200 }}
          options={languages.map((l) => ({ label: l, value: l }))}
        />
      </div>

      {loading ? (
        <div className="page-loading"><Spin size="large" /></div>
      ) : isMobile ? (
        <div>
          {repos.map((repo) => (
            <div key={repo.githubId} className="repo-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#a5b4fc", fontWeight: 600, fontSize: 15 }}>
                    {repo.name}
                  </a>
                  {repo.description && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                      {repo.description.slice(0, 60)}
                    </div>
                  )}
                </div>
                {repo.imported ? (
                  <Tag className="tag-imported" icon={<CheckCircleOutlined />}>Imported</Tag>
                ) : (
                  <Button className="btn-primary" size="small" icon={<ImportOutlined />} loading={importing.has(repo.githubId)} onClick={() => importRepo(repo)} style={{ height: 30, borderRadius: 8, fontSize: 12 }}>
                    Import
                  </Button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {repo.language && repo.language !== "Unknown" && <Tag className="tag-language">{repo.language}</Tag>}
                <span className="star-count"><StarOutlined /> {repo.stars}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dark-table glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <Table
            columns={columns}
            dataSource={repos}
            rowKey="githubId"
            pagination={{ pageSize: 15 }}
          />
        </div>
      )}
    </div>
  );
}
