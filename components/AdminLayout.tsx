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
  RocketOutlined,
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
    />
  );

  const brandBlock = (
    <div className="sider-brand">
      <div className="sider-brand-icon">
        <RocketOutlined />
      </div>
      <span className="sider-brand-text">Portfolio</span>
    </div>
  );

  return (
    <Layout className="admin-layout">
      {!isMobile && (
        <Sider width={240} className="admin-sider">
          {brandBlock}
          {menuContent}
        </Sider>
      )}
      <Layout>
        <Header className="admin-header">
          <div className="mobile-brand">
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="header-hamburger"
              />
            )}
            {isMobile && (
              <>
                <div className="sider-brand-icon" style={{ width: 32, height: 32, borderRadius: 8, fontSize: 14 }}>
                  <RocketOutlined />
                </div>
                <span className="mobile-brand-text">Portfolio</span>
              </>
            )}
          </div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="header-logout"
          >
            {!isMobile && "Logout"}
          </Button>
        </Header>
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={280}
          styles={{ body: { padding: 0 } }}
          rootClassName="dark-drawer"
        >
          {brandBlock}
          {menuContent}
        </Drawer>
      )}
    </Layout>
  );
}
