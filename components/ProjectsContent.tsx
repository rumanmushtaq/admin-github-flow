"use client";

import {
  Table,
  Card,
  Switch,
  Tag,
  Button,
  Popconfirm,
  Grid,
  List,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Project) => (
        <a onClick={() => router.push(`/admin/projects/${record._id}`)}>{title}</a>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Tech Stack",
      dataIndex: "techStack",
      key: "techStack",
      render: (stack: string[]) => (
        <Space wrap>
          {stack.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {stack.length > 3 && <Tag>+{stack.length - 3}</Tag>}
        </Space>
      ),
    },
    {
      title: "Published",
      key: "published",
      render: (_: unknown, record: Project) => (
        <Switch
          checked={record.published}
          onChange={(val) => toggleField(record._id, "published", val)}
        />
      ),
    },
    {
      title: "Featured",
      key: "featured",
      render: (_: unknown, record: Project) => (
        <Switch
          checked={record.featured}
          onChange={(val) => toggleField(record._id, "featured", val)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Project) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/projects/${record._id}`)}
          />
          <Popconfirm
            title="Delete this project?"
            onConfirm={() => deleteProject(record._id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>Projects</h2>

      {isMobile ? (
        <List
          loading={loading}
          dataSource={projects}
          locale={{ emptyText: "No projects yet. Import from GitHub Repos." }}
          renderItem={(project) => (
            <Card
              size="small"
              style={{ marginBottom: 12 }}
              title={project.title}
              extra={
                <Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/admin/projects/${project._id}`)}
                  />
                  <Popconfirm
                    title="Delete?"
                    onConfirm={() => deleteProject(project._id)}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              }
            >
              <Tag color="blue">{project.category}</Tag>
              <div style={{ marginTop: 8 }}>
                <Space>
                  <span>Published:</span>
                  <Switch
                    size="small"
                    checked={project.published}
                    onChange={(val) => toggleField(project._id, "published", val)}
                  />
                  <span>Featured:</span>
                  <Switch
                    size="small"
                    checked={project.featured}
                    onChange={(val) => toggleField(project._id, "featured", val)}
                  />
                </Space>
              </div>
              <div style={{ marginTop: 8 }}>
                {project.techStack.slice(0, 4).map((t) => (
                  <Tag key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))}
              </div>
            </Card>
          )}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />
      )}
    </>
  );
}
