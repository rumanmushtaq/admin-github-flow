import type { Metadata } from "next";
import ReposContent from "@/components/ReposContent";

export const metadata: Metadata = {
  title: "GitHub Repos — Portfolio Admin",
};

export default function ReposPage() {
  return <ReposContent />;
}
