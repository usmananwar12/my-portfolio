import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Usman Anwar - Web Developer",
  description: "Professional web developer portfolio showcasing modern web technologies and innovative projects. Specializing in React, Next.js, and full-stack development.",
  keywords: ["web developer", "react", "next.js", "javascript", "portfolio", "frontend developer"],
  authors: [{ name: "Usman Anwar" }],
  creator: "Usman Anwar",
  openGraph: {
    title: "Usman Anwar - Web Developer",
    description: "Professional web developer portfolio showcasing modern web technologies and innovative projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Usman Anwar - Web Developer",
    description: "Professional web developer portfolio showcasing modern web technologies and innovative projects.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
