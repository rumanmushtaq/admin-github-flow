import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Portfolio Admin",
};

export default function LoginPage() {
  return <LoginForm />;
}
