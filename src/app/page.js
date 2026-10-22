import CenterDot from '@/components/common/CenterDot'
import AboutExpertiseSection from '@/components/home/AboutExpertiseSection'
import BrandsSection from '@/components/home/BrandsSection'
import CTASection from '@/components/home/CTASection'
import HeroSection from '@/components/home/HeroSection'
import { getCaseStudies } from '@/sanity/lib/queries'
import React from 'react'
import OurWorkShowreel from '@/components/home/OurWorkShowreel'

export const metadata = {
  title: "Point Of—Global Brand & Strategic Design Consultancy",
  description:
    "An independent brand consultancy working globally at the intersection of design, strategy, and culture.",
  keywords: [
    "Point Of",
    "Brand strategy",
    "Branding",
    "Strategic design",
    "Design consultancy",
    "Mumbai",
    "India",
  ],
  alternates: { canonical: "/" },
};

const Home = async () => {
  const all = await getCaseStudies();
  const posts = (all ?? []).slice(0, 5);

  return (
    <>
      <HeroSection />
      <AboutExpertiseSection />
      <OurWorkShowreel posts={posts} />
      {/* <OurWork posts={posts} /> */}
      {/* <Showreel /> */}
      <BrandsSection />
      <CTASection
        heading={<>Every brand has a moment that defines it.
          <br />
          We are the studio that finds it, builds it, <br /> and stays for what comes next.
        </>}
        buttonTitle={"Let's find yours"}
        href="/connect#get-in-touch"
        // Same gap as BrandsSection; bottom is short of the footer's own top padding
        paddingClass="pt-24 sm:pt-28 md:pt-40 lg:pt-48 xl:pt-52 pb-14 sm:pb-18 md:pb-24 lg:pb-28 xl:pb-32"
      />
      {/* Center dot—always fixed at viewport center across all pages */}
      <CenterDot />
    </>
  )
}

export default Home
