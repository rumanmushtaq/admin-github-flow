"use client";

import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Spin,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useProjectEdit } from "@/hooks/useProjectEdit";
import { useEffect } from "react";

const categories = ["Web App", "AI/ML", "Mobile", "Library", "Other"];

export default function ProjectEditContent({ id }: { id: string }) {
  const { project, loading, saving, regenerating, save, regenerate, remove } =
    useProjectEdit(id);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue(project);
    }
  }, [project, form]);

  if (loading) {
    return <div className="page-loading"><Spin size="large" /></div>;
  }

  if (!project) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <div className="empty-state-text">Project not found</div>
          <Button className="btn-ghost" style={{ marginTop: 16 }} onClick={() => router.push("/admin/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            className="btn-ghost"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/admin/projects")}
            style={{ height: 38, width: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          />
          <div>
            <h1 className="page-title">Edit Project</h1>
            <p className="page-subtitle">{project.name}</p>
          </div>
        </div>
        <Space wrap>
          <Button
            className="btn-ai"
            icon={<ThunderboltOutlined />}
            loading={regenerating}
            onClick={regenerate}
          >
            Regenerate with AI
          </Button>
          <Button
            className="btn-ghost"
            icon={<GithubOutlined />}
            onClick={() => window.open(project.githubUrl, "_blank")}
          >
            GitHub
          </Button>
        </Space>
      </div>

      <div className="glass-card dark-form">
        <Form form={form} layout="vertical" onFinish={save} requiredMark={false}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0 24px" }}>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input style={{ height: 42, borderRadius: 10 }} />
            </Form.Item>

            <Form.Item label="Category" name="category">
              <Select
                options={categories.map((c) => ({ label: c, value: c }))}
                style={{ height: 42 }}
              />
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item label="Tech Stack" name="techStack">
            <Select mode="tags" placeholder="Add technologies" style={{ borderRadius: 10 }} />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0 24px" }}>
            <Form.Item label="Thumbnail URL" name="thumbnail">
              <Input placeholder="https://..." style={{ height: 42, borderRadius: 10 }} />
            </Form.Item>

            <Form.Item label="Homepage URL" name="homepage">
              <Input placeholder="https://..." style={{ height: 42, borderRadius: 10 }} />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: 32, marginBottom: 24, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Form.Item label={<span style={{ color: "rgba(255,255,255,0.6)" }}>Published</span>} name="published" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
            <Form.Item label={<span style={{ color: "rgba(255,255,255,0.6)" }}>Featured</span>} name="featured" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch />
            </Form.Item>
          </div>

          <Space size={12}>
            <Button
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              className="btn-primary"
              style={{ paddingInline: 24 }}
            >
              Save Changes
            </Button>
            <Popconfirm title="Delete this project permanently?" onConfirm={remove}>
              <Button className="btn-danger" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </Form>
      </div>
    </div>
  );
}
