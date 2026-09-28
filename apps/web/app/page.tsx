import { CredibilityStrip } from "@/components/landing/credibility-strip";
import { Faq } from "@/components/landing/faq";
import { FeatureBento } from "@/components/landing/feature-bento";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingMotion } from "@/components/landing/reveal";
import { LandingNav } from "@/components/landing/landing-nav";
import { Principles } from "@/components/landing/principles";

export default function Home() {
  return (
    <LandingMotion>
      <div className="flex min-h-dvh flex-col">
        <LandingNav />
        <main className="flex-1">
          <Hero />
          <CredibilityStrip />
          <HowItWorks />
          <FeatureBento />
          <Principles />
          <Faq />
          <FinalCta />
        </main>
        <LandingFooter />
      </div>
    </LandingMotion>
  );
}
