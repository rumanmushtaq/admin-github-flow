"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Drawer, Grid } from "antd";
import {
  DashboardOutlined,
  GithubOutlined,
  ProjectOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { signOut } from "next-auth/react";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/repos", icon: <GithubOutlined />, label: "GitHub Repos" },
  { key: "/admin/projects", icon: <ProjectOutlined />, label: "Projects" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleMenuClick = (key: string) => {
    router.push(key);
    setDrawerOpen(false);
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key)}
      style={{ borderInlineEnd: "none" }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider width={220} theme="light" style={{ borderRight: "1px solid #f0f0f0" }}>
          <div style={{ padding: "16px 24px", fontWeight: 700, fontSize: 18 }}>
            Portfolio Admin
          </div>
          {menuContent}
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            )}
            {isMobile && (
              <span style={{ fontWeight: 700, fontSize: 16 }}>Portfolio Admin</span>
            )}
          </div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            {!isMobile && "Logout"}
          </Button>
        </Header>
        <Content style={{ padding: isMobile ? 12 : 24, background: "#f5f5f5" }}>
          {children}
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          title="Portfolio Admin"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={260}
          styles={{ body: { padding: 0 } }}
        >
          {menuContent}
        </Drawer>
      )}
    </Layout>
  );
}
