"use client";

import { Row, Col, Card, Statistic, List, Tag, Button, Spin } from "antd";
import {
  GithubOutlined,
  ImportOutlined,
  EyeOutlined,
  StarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardContent() {
  const { stats, recentProjects, loading, refresh } = useDashboard();
  const router = useRouter();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="GitHub Repos"
              value={stats.totalRepos}
              prefix={<GithubOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Imported"
              value={stats.imported}
              prefix={<ImportOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Published"
              value={stats.published}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Featured"
              value={stats.featured}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Quick Actions" style={{ marginTop: 24 }}>
        <Row gutter={[12, 12]}>
          <Col>
            <Button type="primary" onClick={() => router.push("/admin/repos")}>
              Sync & Import Repos
            </Button>
          </Col>
          <Col>
            <Button onClick={() => router.push("/admin/projects")}>
              Manage Projects
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => window.open("/api/projects", "_blank")}
            >
              View Public API
            </Button>
          </Col>
        </Row>
      </Card>

      <Card title="Recent Projects" style={{ marginTop: 24 }}>
        <List
          dataSource={recentProjects}
          locale={{ emptyText: "No projects imported yet" }}
          renderItem={(project) => (
            <List.Item
              actions={[
                <Tag key="cat" color="blue">{project.category}</Tag>,
                project.published ? (
                  <Tag key="pub" color="green">Published</Tag>
                ) : (
                  <Tag key="pub">Draft</Tag>
                ),
              ]}
            >
              <List.Item.Meta
                title={project.title}
                description={project.description?.slice(0, 100)}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
