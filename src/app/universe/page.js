import UniverseIntro from "@/components/universe/UniverseIntro";

export const metadata = {
  title: "Universe",
  description:
    "The Point Of Brand System. Everything we are, everything we build with: from manifesto to immersions, strategy and identity.",
  alternates: { canonical: "/universe" },
};

// Slides 01-04; slides 05-11 are their own pages under /universe/[slug]
export default function UniversePage() {
  return <UniverseIntro />;
}
