import AdminLayout from "@/components/AdminLayout";
import { SessionProvider } from "next-auth/react";

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <SessionProvider>
      <AdminLayout>{children}</AdminLayout>
    </SessionProvider>
  );
}
