"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { rememberExitPath } from "@/helper/universeExit";

const matches = (pathname, p) => pathname === p || pathname.startsWith(`${p}/`);

// Unmounts the navbar on excluded paths (and everything under them), so it remounts
// cleanly—with its scroll animations rebuilt—when you navigate back out.
export default function NavbarVisibility({ excludePaths = [] }) {
  const pathname = usePathname();

  // Remember the last page outside /universe so its Close button can return there
  useEffect(() => {
    if (pathname && !matches(pathname, "/universe")) rememberExitPath(pathname);
  }, [pathname]);

  if (!pathname) return null;
  if (excludePaths.some((p) => matches(pathname, p))) return null;

  return <Navbar />;
}
