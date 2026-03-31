import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextStop — Your personal Swiss departure board",
  description: "Real-time Swiss public transport departures for your saved stops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-chalk text-ink font-body antialiased">{children}</body>
    </html>
  );
}
