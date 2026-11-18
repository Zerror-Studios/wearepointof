import React from "react";
import { JetBrains_Mono } from "next/font/google";
import UniverseShell from "@/components/universe/UniverseShell";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-uni-mono",
});

// Sidebar + main column shared by /universe and every /universe/<slide> page
export default function UniverseLayout({ children }) {
  return (
    <div className={mono.variable}>
      <UniverseShell>{children}</UniverseShell>
    </div>
  );
}
