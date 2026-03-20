# Onboarding Wizard

The onboarding wizard guides you through setting up a new (greenfield) project. It's a 9-step conversational process that helps Trinity understand your project deeply enough to generate good plans.

## Overview

The wizard progresses through these steps:

1. **Explore** → 2. **Clarify** → 3. **Design** → 4. **Phasing** → 5. **Structure** → 6. **Review** → 7. **Ready** → 8. **Setup** → 9. **Skills**

Your progress is saved automatically — you can close the browser and return later without losing any work.

## Step 1: Explore

This is a free-form conversation where you describe what you want to build. Talk naturally about:

- What the product does
- Who it's for
- Key features you have in mind
- Any technical preferences or constraints

Trinity will ask follow-up questions to fill in gaps. The more context you provide, the better the resulting plan will be.

**Tip:** You can go off on tangents — Trinity detects when you're asking about something unrelated to the project setup and handles it without disrupting the onboarding flow.

## Step 2: Clarify

Trinity asks one question at a time about specific technical details:

- Target platforms (Web App, Mobile, Desktop, CLI, API, Website)
- Frameworks and languages
- Database preferences
- Authentication approach
- Key integrations

Each question offers options with explanations. If an option carries risk (e.g., using an experimental framework), you'll see a risk badge.

**Tip:** Trinity prefers free and open-source options. Paid services are clearly flagged when suggested.

## Step 3: Design

This step has two sub-phases:

### Questioning

Visual and UX questions about your project:

- Color scheme preferences
- Layout style
- Component library choices
- Responsive design approach

### Suggestions

Trinity suggests specific tools and frameworks for each target platform. You can:

- Accept suggestions
- Ask questions about any option (a chat lets you discuss trade-offs)
- Compare options side-by-side
- Override with your own preferences

## Step 4: Phasing

If your project has multiple targets (e.g., Web App + Mobile + API), Trinity asks about build order:

- Which target to build first?
- Can any targets be built in parallel?
- Are there dependencies between targets?

This step is skipped for single-target projects.

## Step 5: Structure

Choose how your project is organized:

- **Single repo** — everything in one repository
- **Monorepo** — multiple packages in one repository (e.g., apps/web, apps/mobile, packages/shared)
- **Polyrepo** — separate repositories per target

Trinity generates an ASCII folder tree preview for each option. The chosen structure determines how the `repos` configuration is set up.

## Step 6: Review

Review the generated roadmap section by section:

- **Vision** — project goals and target audience
- **Phases** — development stages with milestones
- **Milestones** — specific deliverables and their order

You can request changes to any section. Trinity regenerates individual sections without affecting the others.

## Step 7: Ready

A readiness check that verifies:

- Git repository is accessible
- Required services are identified (databases, auth providers, etc.)
- API keys needed for those services

This step also performs service discovery — scanning your planned tech stack to determine which external services need configuration.

## Step 8: Setup

Configure API keys for each detected service. Trinity generates step-by-step setup guides dynamically for any service — whether it's a database, auth provider, email service, or anything else.

Keys are encrypted and stored securely. They're injected into the execution environment when agents run stories.

**Tip:** You can skip services you don't need immediately — they'll be flagged as execution gates later if a story requires them.

## Step 9: Skills

Configure which Claude Code skills are available to agents working on your project. Skills provide specialized knowledge for tasks like:

- Code review patterns
- Testing approaches
- Documentation standards
- Architecture decisions

Trinity auto-selects relevant skills based on your tech stack. You can add or remove skills as needed.

## After Onboarding

Once complete, you're taken to the planning dashboard where you can generate your first PRD. Your onboarding state is preserved (not deleted) so you can reference your setup decisions later in project settings.

## Business Details

During setup, Trinity extracts business details from your onboarding conversation:

- Company name
- Contact email and phone
- Address
- Tagline
- Social media links

These are used by execution gates that check for business details (e.g., stories that need company branding). You can edit them later in Project Settings → Business tab.
