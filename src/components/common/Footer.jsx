"use client";

import { Check, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isValidEmail } from "@/helper/validateEmail";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle"); // idle | loading | success | error
  const [newsletterError, setNewsletterError] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (newsletterStatus !== "success") return;
    const t = setTimeout(() => {
      setNewsletterStatus("idle")
      setNewsletterEmail("");
    }, 6000);
    return () => clearTimeout(t);
  }, [newsletterStatus]);

  const submitNewsletter = async () => {
    const email = String(newsletterEmail ?? "").trim();
    setNewsletterError("");

    if (!isValidEmail(email)) {
      setNewsletterStatus("error");
      setNewsletterError("Please enter a valid email");
      return;
    }

    try {
      setNewsletterStatus("loading");
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setNewsletterStatus("error");
        setNewsletterError(data?.error || "Something went wrong");
        return;
      }

      setNewsletterStatus("success");
    } catch {
      setNewsletterStatus("error");
      setNewsletterError("Network error. Please try again.");
    }
  };

  return (
    <footer className="w-full bg-background relative">
      <div className="px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 mx-auto pt-10 md:pt-16 lg:pt-20 ">

        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-0">

          {/* LOGO */}
          <div>
            <Link href="/" className="flex items-start" title="Go to homepage">
              <Image
                src="/logo/po-logo.png"
                alt="Point Of logo"
                // Real aspect ratio of the file (2763×3474), sized for the largest (h-14) at 2x
                width={89}
                height={112}
                className="h-10 sm:h-12 md:h-11 lg:h-12 xl:h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* 🔥 RIGHT SIDE WRAPPER */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-10 sm:gap-16 md:flex-nowrap md:gap-12 lg:gap-28">

            {/* NAV + SOCIAL (side-by-side on mobile) */}
            <div className="grid grid-cols-2 gap-10 sm:flex sm:flex-row sm:flex-wrap sm:gap-16 md:flex-nowrap md:gap-12 lg:gap-28">
              {/* NAV LINKS */}
              <div className="space-y-3 para text-subheading tracking-wide">
                {[
                  { name: "ABOUT", href: "/about" },
                  { name: "WORK", href: "/work" },
                  { name: "EXPERTISE", href: "/expertise" },
                  { name: "BRANDS", href: "/brands" },
                  { name: "CONNECT", href: "/connect" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`link-underline block transition ${pathname.startsWith(item.href) ? "font-semibold" : "font-medium"}`}
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* SOCIAL LINKS */}
              <div className="space-y-3 para text-subheading">
                {[
                  {
                    name: "INSTAGRAM",
                    href: "https://instagram.com/wearepointof",
                  },
                  {
                    name: "LINKEDIN",
                    href: "https://linkedin.com/company/wearepointof",
                  },
                  {
                    name: "BEHANCE",
                    href: "https://www.behance.net/wearepointof",
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline block transition font-medium"
                    title={item.name}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* EMAIL SUBSCRIBE */}
            <div className="space-y-3  w-full sm:w-[260px] md:w-[300px]">
              <p className="para text-heading tracking-wide font-medium">Don’t miss anything</p>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  submitNewsletter();
                }}
                className={`relative border-b pb-2 ${
                  newsletterStatus === "error" ? "border-red-400" : "border-neutral-700"
                }`}
              >
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Email*"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus !== "idle") {
                      setNewsletterStatus("idle");
                      setNewsletterError("");
                    }
                  }}
                  onBlur={() => {
                    const email = String(newsletterEmail ?? "").trim();
                    if (!email) return;
                    if (!isValidEmail(email)) {
                      setNewsletterStatus("error");
                      setNewsletterError("Please enter a valid email");
                    }
                  }}
                  className="w-full bg-transparent outline-none py-2 pr-10 text-sm md:text-base placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  aria-label="Subscribe to newsletter"
                  title="Subscribe"
                  disabled={newsletterStatus === "loading"}
                >
                  {newsletterStatus === "success" ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : newsletterStatus === "loading" ? (
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 border-neutral-400/30 border-t-neutral-200 animate-spin"
                      aria-label="Loading"
                    />
                  ) : (
                    <Send className="c w-5 h-5 cursor-pointer opacity-70" />
                  )}
                </button>
              </form>

              {newsletterStatus === "success" ? (
                <p className="text-xs text-green-600">Subscribed</p>
              ) : newsletterStatus === "error" ? (
                <p className="text-xs text-red-400">{newsletterError || "Please enter a valid email"}</p>
              ) : null}

              <div className="text-sm">
                <p className="text-desc mb-2">Partner with us</p>
                <Link
                  href="/brand-partners"
                  className="link-underline para text-heading tracking-wide font-medium block"
                  title="Brand Partners Access"
                >
                  Brand Partners Access
                </Link>
                <a
                  href="mailto:think@wearepointof.com"
                  className="link-underline para text-heading tracking-wide font-medium block mt-2"
                  title="Email Point Of"
                >
                  think@wearepointof.com
                </a>
                <a
                  href="https://tidycal.com/piran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline para text-heading tracking-wide font-medium block mt-2"
                  title="Schedule a call"
                >
                  Schedule a call
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-neutral-700 mt-10 md:mt-12 py-6 flex flex-row flex-wrap justify-between items-start md:items-center gap-4 text-sm">

          <div className="w-full sm:w-auto flex flex-wrap gap-3 md:gap-4 text-neutral-400">
            <Link href="/privacy" className="hover:text-white transition" title="Privacy Policy">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/legal" className="hover:text-white transition" title="Legal">
              Legal
            </Link>
          </div>
          <p className="w-full sm:w-auto text-left text-neutral-400 text-[0.8125rem] sm:text-sm">
            © {new Date().getFullYear()} built by Point Of
          </p>
        </div>

      </div>
    </footer>
  );
}