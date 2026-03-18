import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Pricing | Trinity AI Labs",
  description:
    "Simple, transparent pricing. Start free, upgrade to Pro for $10/mo. Bring your own AI API keys.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <div className="pt-24">
        <Pricing />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
