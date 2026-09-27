"use client";

import { ConfigProvider, theme, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#6366f1",
            colorBgContainer: "rgba(255, 255, 255, 0.04)",
            colorBgElevated: "#1a1a2e",
            colorBorder: "rgba(255, 255, 255, 0.08)",
            borderRadius: 12,
            colorText: "rgba(255, 255, 255, 0.85)",
            colorTextSecondary: "rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
          },
          components: {
            Table: {
              headerBg: "rgba(255, 255, 255, 0.04)",
              rowHoverBg: "rgba(255, 255, 255, 0.03)",
              borderColor: "rgba(255, 255, 255, 0.06)",
            },
            Card: {
              colorBgContainer: "rgba(255, 255, 255, 0.03)",
              colorBorderSecondary: "rgba(255, 255, 255, 0.06)",
            },
            Input: {
              colorBgContainer: "rgba(255, 255, 255, 0.05)",
              colorBorder: "rgba(255, 255, 255, 0.1)",
            },
            Select: {
              colorBgContainer: "rgba(255, 255, 255, 0.05)",
              colorBorder: "rgba(255, 255, 255, 0.1)",
              optionSelectedBg: "rgba(99, 102, 241, 0.15)",
            },
            Popconfirm: {
              colorWarning: "#f59e0b",
            },
            Modal: {
              contentBg: "#1a1a2e",
            },
            Message: {
              contentBg: "#1a1a2e",
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
