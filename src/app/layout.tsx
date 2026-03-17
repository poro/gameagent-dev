import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Game Agent — Building AI Products Live",
  description: "Watch Mark Ollila build real, revenue-generating AI products live with his AI agent Dufus. Streams, projects, and the future of AI development.",
  openGraph: {
    title: "Game Agent — Building AI Products Live",
    description: "Watch real AI products get built live. No tutorials. No toy demos. Real products, real revenue.",
    url: "https://gameagent.dev",
    siteName: "Game Agent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@markollila",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script defer src="https://analytics.game-agents.com/script.js" data-website-id="00b9dafe-2ebd-41d1-bb4b-381f8dd377f0"></script>
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
