// layout.tsx

import SmoothScroller from "@/components/SmoothScroller";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import FooterVisibility from "@/components/common/FooterVisibility";
import localFont from "next/font/local";
import ToasterProvider from "@/components/common/ToasterProvider";
import { SanityLive } from "@/sanity/lib/live";

export const metadata = {
  metadataBase: new URL("https://www.wearepointof.com"),
  title: {
    default: "Point Of—Global Brand & Strategic Design Consultancy",
    template: "%s—Point Of",
  },
  description:
    "An independent consultancy based in Mumbai, working globally—rethinking how brands engage with culture and people. Design, strategy, and technology. Building for India and beyond.",
  keywords: [
    "Point Of",
    "Brand strategy",
    "Branding",
    "Design consultancy",
    "Strategic design",
    "Visual identity",
    "Web design",
    "Web development",
    "Digital products",
    "Mumbai",
    "India",
  ],
  authors: [{ name: "Point Of", url: "https://www.wearepointof.com" }],
  creator: "Point Of",
  publisher: "Point Of",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    // Small PNGs generated from favicon.jpg (2084px / 172KB, which every page used to download)
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Point Of",
    url: "/",
    title: "Point Of—Where brands are made, shaped, and set in motion",
    description:
      "An independent consultancy based in Mumbai, working globally—rethinking how brands engage with culture and people. Design, strategy, and technology. Building for India and beyond.",
    locale: "en_US",
    images: [
      {
        url: "/pointof-og.png",
        width: 1200,
        height: 630,
        alt: "Point Of",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Point Of—Where brands are made, shaped, and set in motion",
    description:
      "An independent consultancy based in Mumbai, working globally—rethinking how brands engage with culture and people. Design, strategy, and technology. Building for India and beyond.",
    images: [
      {
        url: "/pointof-og.png",
        width: 1200,
        height: 630,
        alt: "Point Of",
      },
    ],
  },
};

export const viewport = {
  themeColor: "#000000",
};

const headingFont = localFont({
  src: [
    { path: "../../public/fonts/TWKLausanne-100.woff2", weight: "100" },
    { path: "../../public/fonts/TWKLausanne-200.woff2", weight: "200" },
    { path: "../../public/fonts/TWKLausanne-300.woff2", weight: "300" },
    { path: "../../public/fonts/TWKLausanne-400.woff2", weight: "400" },
    { path: "../../public/fonts/TWKLausanne-500.woff2", weight: "500" },
    { path: "../../public/fonts/TWKLausanne-600.woff2", weight: "600" },
  ],
  variable: "--font-heading",
});

const bodyFont = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Light.woff2", weight: "300" },
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500" },
  ],
  variable: "--font-body",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable}`}>
        <SmoothScroller />
        <ToasterProvider />
        <Navbar />
        {children}
        <SanityLive />
        <FooterVisibility excludePaths={["/admin", "/universe"]} excludeExactPaths={["/work"]} />
      </body>
    </html>
  );
}