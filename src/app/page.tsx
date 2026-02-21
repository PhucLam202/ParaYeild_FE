import HeroSection from "@/components/HeroSection";
import KeyMetricsSection from "@/components/KeyMetricsSection";
import CoreFeaturesSection from "@/components/CoreFeaturesSection";
import SupportedParachainsSection from "@/components/SupportedParachainsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import FooterSection from "@/components/FooterSection";
import HeaderSection from "@/components/HeaderSection";

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
