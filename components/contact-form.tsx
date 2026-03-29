"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  HelpCircle,
  Handshake,
  Building2,
  MessageSquare,
  Loader2,
} from "lucide-react";

const categories = [
  {
    id: "try-trinity",
    label: "Try Trinity",
    description: "Get started with the app",
    icon: Download,
  },
  {
    id: "question",
    label: "General Question",
    description: "Ask us anything",
    icon: HelpCircle,
  },
  {
    id: "partnership",
    label: "Partnership",
    description: "Collaborate with us",
    icon: Handshake,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Custom plans & deployment",
    icon: Building2,
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Share your thoughts",
    icon: MessageSquare,
  },
] as const;

type Category = (typeof categories)[number]["id"];

interface FormData {
  category: Category | null;
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    category: null,
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const totalSteps = 4;

  function canAdvance() {
    switch (step) {
      case 0:
        return form.category !== null;
      case 1:
        return form.name.trim() !== "" && form.email.trim() !== "";
      case 2:
        return form.message.trim() !== "";
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (step === 2) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress bar */}
      {step < 3 && (
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps - 1 }).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-border">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: i <= step ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Step 0: Category */}
      {step === 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-2">What brings you here?</h2>
            <p className="text-muted-foreground">
              Pick the option that best describes your interest.
            </p>
          </div>
          <div className="grid gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const selected = form.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
                      : "border-border hover:border-muted-foreground/30 hover:bg-card/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      selected
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{cat.label}</div>
                    <div className="text-sm text-muted-foreground">{cat.description}</div>
                  </div>
                  {selected && (
                    <Check className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Contact info */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
            <p className="text-muted-foreground">
              So we can get back to you.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Name <span className="text-emerald-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email <span className="text-emerald-500">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Company <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Your company"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Message */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your message</h2>
            <p className="text-muted-foreground">
              Tell us what&apos;s on your mind. We read every message.
            </p>
          </div>
          <div>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="What would you like to tell us?"
              rows={6}
              autoFocus
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] dark:bg-input/30 md:text-sm resize-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Message sent!</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Thanks for reaching out, {form.name.split(" ")[0]}. We&apos;ll get back to you
            shortly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            >
              <Link href="/#downloads">Download Trinity</Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 3 && (
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={next}
            disabled={!canAdvance() || submitting}
            className="font-mono bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : step === 2 ? (
              <>
                Send Message
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
