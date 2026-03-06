import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Germany Job Hunter — MJ Khiareddine",
  description: "Personal job search tracker and AI cover letter generator for the German tech market",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
