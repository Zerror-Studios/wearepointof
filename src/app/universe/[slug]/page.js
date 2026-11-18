import { notFound } from "next/navigation";
import UniverseSlidePage from "@/components/universe/UniverseSlidePage";
import { slidePages, findSlide, slidePageTitle } from "@/helper/universeData";

// Pre-render one page per slide from 05 on
export function generateStaticParams() {
  return slidePages.map((s) => ({ slug: s.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slide = findSlide(slug);
  if (!slide) return {};
  return {
    title: slidePageTitle(slide),
    description: `${slide.label}: part ${slide.n} of the Point Of Brand System.`,
    alternates: { canonical: `/universe/${slug}` },
  };
}

export default async function UniverseSlideRoute({ params }) {
  const { slug } = await params;
  if (!slidePages.some((s) => s.id === slug)) notFound();
  return <UniverseSlidePage slug={slug} />;
}
