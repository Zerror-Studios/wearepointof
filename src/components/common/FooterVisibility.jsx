"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// excludePaths hides the footer on a path and everything under it;
// excludeExactPaths hides it only on that exact path.
export default function FooterVisibility({ excludePaths = [], excludeExactPaths = [] }) {
  const pathname = usePathname();

  if (!pathname) return null;
  if ((excludeExactPaths ?? []).includes(pathname)) return null;
  if (
    (excludePaths ?? []).some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    )
  )
    return null;

  return <Footer />;
}
