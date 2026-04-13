import { Suspense } from "react";
import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { TopAppBar } from "@/components/TopAppBar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "SterileFlow — Clinical Logistics",
  description: "B2B hospital cleaning logistics",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <Suspense fallback={<div className="h-16" />}>
            <TopAppBar />
          </Suspense>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
