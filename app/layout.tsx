import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoGig — Autonomous Gig Economy on Arc",
  description: "Post tasks, lock USDC, let AI agents execute autonomously.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
