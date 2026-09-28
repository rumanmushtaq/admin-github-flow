"use client";

import { Input, Select, Button, Tag, Grid, Spin } from "antd";
import {
  SearchOutlined,
  SyncOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { List } from "react-window";
import { useRepos } from "@/hooks/useRepos";
import type { GitHubRepo } from "@/types";
import type { CSSProperties, ReactElement } from "react";

const { useBreakpoint } = Grid;

const ROW_HEIGHT = 56;
const HEADER_HEIGHT = 44;

interface RowProps {
  repos: GitHubRepo[];
  importing: Set<number>;
  importRepo: (r: GitHubRepo) => void;
}

function VirtualRow({ index, style, repos, importing, importRepo }: { index: number; style: CSSProperties } & RowProps): ReactElement | null {
  const repo = repos[index];
  if (!repo) return null;
  return (
    <div
      className="virtual-row"
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 16px",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <div className="repo-icon-cell">
          <CodeOutlined style={{ color: "#818cf8", fontSize: 16 }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "#a5b4fc" }}>
            {repo.name}
          </a>
          {repo.description && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
              {repo.description}
            </div>
          )}
        </div>
      </div>
      <div style={{ width: 120, flexShrink: 0, textAlign: "center" }}>
        {repo.language && repo.language !== "Unknown" && <Tag className="tag-language">{repo.language}</Tag>}
      </div>
      <div style={{ width: 80, flexShrink: 0, textAlign: "center" }}>
        <span className="star-count"><StarOutlined /> {repo.stars}</span>
      </div>
      <div style={{ width: 100, flexShrink: 0, textAlign: "center" }}>
        {repo.imported ? (
          <Tag icon={<CheckCircleOutlined />} className="tag-imported">Imported</Tag>
        ) : (
          <Tag className="tag-new">New</Tag>
        )}
      </div>
      <div style={{ width: 100, flexShrink: 0, textAlign: "right" }}>
        {repo.imported ? (
          <Tag className="tag-imported" style={{ fontSize: 12 }}>Done</Tag>
        ) : (
          <Button
            className="btn-primary"
            size="small"
            icon={<ImportOutlined />}
            loading={importing.has(repo.githubId)}
            onClick={() => importRepo(repo)}
            style={{ height: 32, borderRadius: 8, fontSize: 13 }}
          >
            Import
          </Button>
        )}
      </div>
    </div>
  );
}

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

  const listHeight = Math.min(repos.length * ROW_HEIGHT, 600);

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
        <div className="glass-card virtual-table">
          <div className="virtual-table-header" style={{ display: "flex", alignItems: "center", height: HEADER_HEIGHT, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
            <div style={{ flex: 1 }}>Repository</div>
            <div style={{ width: 120, textAlign: "center" }}>Language</div>
            <div style={{ width: 80, textAlign: "center" }}>Stars</div>
            <div style={{ width: 100, textAlign: "center" }}>Status</div>
            <div style={{ width: 100, textAlign: "right" }}></div>
          </div>
          <List
            defaultHeight={listHeight}
            rowCount={repos.length}
            rowHeight={ROW_HEIGHT}
            rowComponent={VirtualRow as any}
            rowProps={{ repos, importing, importRepo }}
          />
          <div className="virtual-table-footer" style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "right" }}>
            {repos.length} repositories
          </div>
        </div>
      )}
    </div>
  );
}
