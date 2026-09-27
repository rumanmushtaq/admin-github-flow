"use client";

import { Table, Switch, Tag, Button, Popconfirm, Grid, Space, Spin } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/types";

const { useBreakpoint } = Grid;

export default function ProjectsContent() {
  const { projects, loading, toggleField, deleteProject } = useProjects();
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns = [
    {
      title: "Project",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Project) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(168,85,247,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AppstoreOutlined style={{ color: "#c4b5fd", fontSize: 16 }} />
          </div>
          <a onClick={() => router.push(`/admin/projects/${record._id}`)} style={{ fontWeight: 600, cursor: "pointer" }}>
            {title}
          </a>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (cat: string) => <Tag className="tag-category">{cat}</Tag>,
    },
    {
      title: "Tech Stack",
      dataIndex: "techStack",
      key: "techStack",
      width: 200,
      render: (stack: string[]) => (
        <Space wrap size={4}>
          {stack.slice(0, 3).map((t) => (
            <Tag key={t} className="tag-tech">{t}</Tag>
          ))}
          {stack.length > 3 && <Tag className="tag-tech" style={{ opacity: 0.6 }}>+{stack.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: "Published",
      key: "published",
      width: 90,
      render: (_: unknown, record: Project) => (
        <Switch
          checked={record.published}
          onChange={(val) => toggleField(record._id, "published", val)}
          size="small"
        />
      ),
    },
    {
      title: "Featured",
      key: "featured",
      width: 90,
      render: (_: unknown, record: Project) => (
        <Switch
          checked={record.featured}
          onChange={(val) => toggleField(record._id, "featured", val)}
          size="small"
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_: unknown, record: Project) => (
        <Space size={6}>
          <Button
            size="small"
            className="btn-ghost"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/projects/${record._id}`)}
            style={{ height: 32, width: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          />
          <Popconfirm
            title="Delete this project?"
            onConfirm={() => deleteProject(record._id)}
          >
            <Button
              size="small"
              className="btn-danger"
              icon={<DeleteOutlined />}
              style={{ height: 32, width: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div className="page-loading"><Spin size="large" /></div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage your imported portfolio projects</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon"><AppstoreOutlined /></div>
            <div className="empty-state-text">No projects yet. Import from GitHub Repos to get started.</div>
            <Button className="btn-primary" style={{ marginTop: 20 }} onClick={() => router.push("/admin/repos")}>
              Go to GitHub Repos
            </Button>
          </div>
        </div>
      ) : isMobile ? (
        <div>
          {projects.map((project) => (
            <div key={project._id} className="project-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ cursor: "pointer" }} onClick={() => router.push(`/admin/projects/${project._id}`)}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{project.title}</div>
                  <Tag className="tag-category" style={{ marginTop: 6 }}>{project.category}</Tag>
                </div>
                <Space size={6}>
                  <Button size="small" className="btn-ghost" icon={<EditOutlined />} onClick={() => router.push(`/admin/projects/${project._id}`)} style={{ height: 30, width: 30, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} />
                  <Popconfirm title="Delete?" onConfirm={() => deleteProject(project._id)}>
                    <Button size="small" className="btn-danger" icon={<DeleteOutlined />} style={{ height: 30, width: 30, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} />
                  </Popconfirm>
                </Space>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Published</span>
                  <Switch size="small" checked={project.published} onChange={(val) => toggleField(project._id, "published", val)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Featured</span>
                  <Switch size="small" checked={project.featured} onChange={(val) => toggleField(project._id, "featured", val)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {project.techStack.slice(0, 4).map((t) => (
                  <Tag key={t} className="tag-tech">{t}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dark-table glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="_id"
            pagination={false}
          />
        </div>
      )}
    </div>
  );
}
