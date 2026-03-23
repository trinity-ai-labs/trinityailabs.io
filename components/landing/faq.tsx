"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Trinity exactly?",
    answer:
      "Trinity is an autonomous development orchestrator — a desktop app (built with Tauri) that plans your entire project, breaks it into stories, and executes them through a 4-agent AI pipeline in parallel. It's not a code editor or autocomplete tool. It's a system that ships PRs while you sleep.",
  },
  {
    question: "How is this different from Cursor or GitHub Copilot?",
    answer:
      "Cursor and Copilot help you write code faster inside an editor. Trinity operates at the project level — it plans features, manages dependencies between stories, runs multiple agents in parallel across isolated git worktrees, reviews its own code through an auditor agent, and creates PRs automatically. It's a layer above code generation.",
  },
  {
    question: "What AI models does Trinity use?",
    answer:
      "Trinity supports 3 providers: Anthropic (Claude), DeepSeek, and Ollama for local models. It uses a 4-tier model system — reasoning, standard, fast, and micro — so each task uses the right model for the job. You bring your own API keys and pay your provider directly.",
  },
  {
    question: "Do I need to be online for Trinity to work?",
    answer:
      "Yes. Trinity runs locally but needs internet to reach AI providers (Claude, DeepSeek) and for cloud sync. Your code stays on your machine — only prompts and responses go to the AI provider.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "Trinity is available for macOS (Apple Silicon and Intel) and Linux. It's built with Tauri 2, so it's a native desktop app with a small footprint — not an Electron wrapper.",
  },
  {
    question: "Is my code sent to Trinity's servers?",
    answer:
      "No. Your code stays on your machine. Trinity orchestrates AI agents locally. Code is sent only to the AI provider you choose (Anthropic, DeepSeek, or stays local with Ollama). The Pro plan syncs project metadata (stories, plans, status) via Turso — never your source code.",
  },
  {
    question: "What does the $10/mo plan include?",
    answer:
      "Everything — cloud sync across devices, unlimited projects, 5 GB managed cloud storage, full metrics and reporting, team collaboration, and priority support. Need more storage? Add 10 GB packs for $5/mo, or bring your own S3-compatible bucket at no extra cost. One subscription per person. If a team owner pays for your seat, you don't need your own subscription.",
  },
  {
    question: "How does team collaboration work?",
    answer:
      "Create a team, invite members by email, and share projects. All planning data syncs in real-time via Turso. Each team member runs execution on their own machine — Trinity coordinates job claiming so no two people work on the same story. Comments, activity feeds, and change history keep everyone aligned. $10/seat/month — the team owner can pay for members or members can bring their own subscription.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 border-t border-border bg-muted/20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Trinity
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card/50 overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full px-6 py-4 text-left text-sm font-medium hover:text-foreground transition-colors group">
                  {faq.question}
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-4 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
