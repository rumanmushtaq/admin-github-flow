"use client";

import { Spin, Tag } from "antd";
import {
  GithubOutlined,
  ImportOutlined,
  EyeOutlined,
  StarOutlined,
  ReloadOutlined,
  SyncOutlined,
  AppstoreOutlined,
  ApiOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardContent() {
  const { stats, recentProjects, loading, refresh } = useDashboard();
  const router = useRouter();

  if (loading) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your portfolio projects</p>
        </div>
        <button className="btn-ghost" onClick={refresh} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "0 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, height: 38, color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: 14 }}>
          <ReloadOutlined /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div className="stat-card stat-card--repos animate-in">
          <div className="stat-icon stat-icon--repos"><GithubOutlined /></div>
          <div className="stat-label">GitHub Repos</div>
          <div className="stat-value">{stats.totalRepos}</div>
        </div>
        <div className="stat-card stat-card--imported animate-in">
          <div className="stat-icon stat-icon--imported"><ImportOutlined /></div>
          <div className="stat-label">Imported</div>
          <div className="stat-value">{stats.imported}</div>
        </div>
        <div className="stat-card stat-card--published animate-in">
          <div className="stat-icon stat-icon--published"><EyeOutlined /></div>
          <div className="stat-label">Published</div>
          <div className="stat-value">{stats.published}</div>
        </div>
        <div className="stat-card stat-card--featured animate-in">
          <div className="stat-icon stat-icon--featured"><StarOutlined /></div>
          <div className="stat-label">Featured</div>
          <div className="stat-value">{stats.featured}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card animate-in" style={{ marginBottom: 28 }}>
        <div className="glass-card-title">
          <ArrowRightOutlined /> Quick Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div className="action-card" onClick={() => router.push("/admin/repos")}>
            <div className="action-icon action-icon--sync"><SyncOutlined /></div>
            <div>
              <div className="action-text">Sync & Import</div>
              <div className="action-desc">Fetch repos from GitHub</div>
            </div>
          </div>
          <div className="action-card" onClick={() => router.push("/admin/projects")}>
            <div className="action-icon action-icon--manage"><AppstoreOutlined /></div>
            <div>
              <div className="action-text">Manage Projects</div>
              <div className="action-desc">Edit, publish & feature</div>
            </div>
          </div>
          <div className="action-card" onClick={() => window.open("/api/projects", "_blank")}>
            <div className="action-icon action-icon--api"><ApiOutlined /></div>
            <div>
              <div className="action-text">Public API</div>
              <div className="action-desc">View JSON endpoint</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="glass-card animate-in">
        <div className="glass-card-title">
          <ClockCircleOutlined /> Recent Projects
        </div>
        {recentProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><AppstoreOutlined /></div>
            <div className="empty-state-text">No projects imported yet. Head to GitHub Repos to get started.</div>
          </div>
        ) : (
          recentProjects.map((project) => (
            <div key={project._id} className="recent-item">
              <div className="recent-item-info">
                <div className="recent-item-title">{project.title}</div>
                <div className="recent-item-desc">{project.description?.slice(0, 80)}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Tag className="tag-category">{project.category}</Tag>
                {project.published ? (
                  <Tag className="tag-published">Live</Tag>
                ) : (
                  <Tag className="tag-draft">Draft</Tag>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
