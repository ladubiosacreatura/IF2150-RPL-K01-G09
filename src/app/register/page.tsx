import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Daftar Akun · PeerUP" };

export default function Page() {
  return <RegisterForm />;
}
