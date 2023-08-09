import "@/app/globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import GlobalToastRegion from "@/components/Toast";

const openSans = Open_Sans({ subsets: ["latin"] });

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
      {process.env.NODE_ENV !== "development" && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-NHG3FG5J1Z" />
          <Script id="google-analytics">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-NHG3FG5J1Z');
        `}
          </Script>
        </>
      )}

      <body className={openSans.className}>
        {children}
        <GlobalToastRegion />
      </body>
    </html>
  );
}
