import { HeroSection, KeyMetricsSection, CoreFeaturesSection, PoolsExplorerSection, ParachainSection, FinalCtaSection } from "@/components/sections";
import { HeaderSection, FooterSection } from "@/components/layout";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <div className="layout-container flex h-full grow flex-col max-w-[1600px] mx-auto w-full">
        <main className="flex-1 px-6 md:px-20 py-10 flex flex-col items-center">
          <HeroSection />
          <KeyMetricsSection />
          <CoreFeaturesSection />
          <PoolsExplorerSection />
          <ParachainSection />
          <FinalCtaSection />
        </main>

        <FooterSection />
      </div>
    </>
  );
}
