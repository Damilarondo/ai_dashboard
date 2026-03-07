import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Control Plane — Network Troubleshooting Dashboard",
  description: "Real-time AI-powered network troubleshooting agent dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '240px', padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
