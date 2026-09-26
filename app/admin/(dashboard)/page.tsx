import type { Metadata } from "next";
import DashboardContent from "@/components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard — Portfolio Admin",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
