import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Masuk · PeerUP" };

export default function Page() {
  return <LoginForm />;
}
