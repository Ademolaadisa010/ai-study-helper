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
  title: "AI Study Helper",
  description:
    "Turn your notes into summaries, quizzes, and simple explanations using AI. Built for the Devpost Spec Driven Development Hackathon.",
  keywords: [
    "AI Study",
    "AI Notes",
    "Study Helper",
    "Summarizer",
    "Quiz Generator",
    "Students",
  ],
  authors: [{ name: "Your Name" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-white text-slate-900 font-sans antialiased">
        {/* Page Wrapper */}
        <div className="flex flex-col min-h-screen">
          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}