import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PopUpNotification from "@/components/PopUpNotification";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/controllers/userController";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerUP",
  description: "Platform sesi belajar sebaya untuk mahasiswa.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {user ? (
          <div className="md:flex">
            <Sidebar user={user} />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ) : (
          children
        )}
        <PopUpNotification />
      </body>
    </html>
  );
}
