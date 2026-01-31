import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import AppShell from "@/components/app-shell";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AssignmentHub - Admin Dashboard',
  description: 'Manage users, subscriptions and assignments',
  generator: 'AssignmentHub.app',
  icons: {
    icon: [
      { url: '/icon-logo.png', type: 'image/png' },
    ],
    shortcut: '/icon-logo.png',
    apple: '/icon-logo.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}
