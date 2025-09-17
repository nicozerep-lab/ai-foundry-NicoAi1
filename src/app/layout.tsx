import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Foundry SaaS - Powerful AI Tools for Everyone",
  description: "Production-ready AI SaaS platform with multiple provider integrations, billing, and authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}