import React from "react";
import { JetBrains_Mono } from "next/font/google";
import UniverseShell from "@/components/universe/UniverseShell";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-uni-mono",
});

export const metadata = {
  title: "Universe",
  description:
    "The Point Of Brand System. Everything we are, everything we build with: from manifesto to immersions, strategy and identity.",
  alternates: { canonical: "/universe" },
};

export default function UniversePage() {
  return (
    <div className={mono.variable}>
      <UniverseShell />
    </div>
  );
}
