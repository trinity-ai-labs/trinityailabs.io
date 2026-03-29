import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { ContactForm } from "@/components/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Trinity AI Labs",
  description:
    "Get in touch with the Trinity team. Questions, partnerships, enterprise plans, or feedback — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Nav />

      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Gradient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Have a question, want to partner, or just want to say hi? We&apos;d
              love to hear from you.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
