import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wanderkit - Unlock Your Perfect Trip",
  description:
    "Discover your ideal journey with Wanderkit! Our AI-powered itinerary generator crafts personalized travel plans based on your preferences, interests, and budget. Start exploring effortlessly today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "p-6 lg:p-12 md:max-w-xl lg:max-w-7xl mx-auto"
        )}
      >
        <header>
          <h2 className="font-bold text-xl pb-12">
            <Link href="/">Wanderkit</Link>
          </h2>
        </header>
        {children}
      </body>
    </html>
  );
}
