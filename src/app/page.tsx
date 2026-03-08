import { HeroSection, KeyMetricsSection, CoreFeaturesSection, SupportedParachainsSection, HowItWorksSection, FinalCtaSection } from "@/components/sections";
import { HeaderSection, FooterSection } from "@/components/layout";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeaderSection />

      <HeroSection />
      <div id="metrics">
        <KeyMetricsSection />
      </div>
      <div id="features">
        <CoreFeaturesSection />
      </div>
      <div id="ecosystem">
        <SupportedParachainsSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <FinalCtaSection />
      <FooterSection />
    </main>
  );
}
