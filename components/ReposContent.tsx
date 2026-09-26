"use client";

import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Grid,
  List,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ImportOutlined,
  CheckCircleOutlined,
  StarOutlined,
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: GitHubRepo) => (
        <a href={record.githubUrl} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (lang: string) => lang && <Tag>{lang}</Tag>,
    },
    {
      title: "Stars",
      dataIndex: "stars",
      key: "stars",
      sorter: (a: GitHubRepo, b: GitHubRepo) => a.stars - b.stars,
      render: (stars: number) => (
        <span>
          <StarOutlined style={{ marginRight: 4 }} />
          {stars}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: GitHubRepo) =>
        record.imported ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Imported
          </Tag>
        ) : (
          <Tag color="default">New</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: GitHubRepo) =>
        record.imported ? (
          <Tag color="green">Done</Tag>
        ) : (
          <Button
            type="primary"
            size="small"
            icon={<ImportOutlined />}
            loading={importing.has(record.githubId)}
            onClick={() => importRepo(record)}
          >
            Import
          </Button>
        ),
    },
  ];

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
        <h2 style={{ margin: 0 }}>GitHub Repos</h2>
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Sync
        </Button>
      </div>

      <Space
        wrap
        style={{ marginBottom: 16, width: "100%" }}
        direction={isMobile ? "vertical" : "horizontal"}
      >
        <Input
          placeholder="Search repos..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: isMobile ? "100%" : 240 }}
          allowClear
        />
        <Select
          placeholder="Filter by language"
          value={languageFilter}
          onChange={setLanguageFilter}
          allowClear
          style={{ width: isMobile ? "100%" : 180 }}
          options={languages.map((l) => ({ label: l, value: l }))}
        />
      </Space>

      {isMobile ? (
        <List
          loading={loading}
          dataSource={repos}
          renderItem={(repo) => (
            <Card
              size="small"
              style={{ marginBottom: 12 }}
              title={
                <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              }
              extra={
                repo.imported ? (
                  <Badge status="success" text="Imported" />
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    icon={<ImportOutlined />}
                    loading={importing.has(repo.githubId)}
                    onClick={() => importRepo(repo)}
                  >
                    Import
                  </Button>
                )
              }
            >
              <Space>
                {repo.language && <Tag>{repo.language}</Tag>}
                <span>
                  <StarOutlined /> {repo.stars}
                </span>
              </Space>
            </Card>
          )}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={repos}
          rowKey="githubId"
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      )}
    </>
  );
}
