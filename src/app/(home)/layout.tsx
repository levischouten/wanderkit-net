import "@/app/globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Wanderkit - Unlock Your Perfect Trip",
  description:
    "Discover your ideal journey with Wanderkit! Our AI-powered itinerary generator crafts personalized travel plans based on your preferences, interests, and budget. Start exploring effortlessly today!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
      <Header />
      <main className="md:max-w-xl lg:max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
