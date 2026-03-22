import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { LogoBar } from "@/components/landing/logo-bar";
import { DevActivity } from "@/components/landing/dev-activity";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pipeline } from "@/components/landing/pipeline";
import { Themes } from "@/components/landing/themes";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { getGitHubStats } from "@/lib/github-stats";

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <LogoBar />
      <DevActivity {...stats} />
      <Problem />
      <HowItWorks />
      <Features />
      <Pipeline />
      <Themes />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
