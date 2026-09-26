"use client";

import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Card,
  Space,
  Spin,
  Popconfirm,
  Divider,
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
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/projects")}>
            Back
          </Button>
          <h2 style={{ margin: 0 }}>Edit Project</h2>
        </Space>
        <Space wrap>
          <Button
            icon={<ThunderboltOutlined />}
            loading={regenerating}
            onClick={regenerate}
          >
            Regenerate with AI
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => window.open(project.githubUrl, "_blank")}
          >
            GitHub
          </Button>
        </Space>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select options={categories.map((c) => ({ label: c, value: c }))} />
          </Form.Item>

          <Form.Item label="Tech Stack" name="techStack">
            <Select mode="tags" placeholder="Add technologies" />
          </Form.Item>

          <Form.Item label="Thumbnail URL" name="thumbnail">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Homepage URL" name="homepage">
            <Input placeholder="https://..." />
          </Form.Item>

          <Space size="large">
            <Form.Item label="Published" name="published" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Featured" name="featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>

          <Divider />

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Save
            </Button>
            <Popconfirm title="Delete this project permanently?" onConfirm={remove}>
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </Form>
      </Card>
    </>
  );
}
