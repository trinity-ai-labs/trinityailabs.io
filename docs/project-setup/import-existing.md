# Importing an Existing Project

If you have an existing codebase you want to manage with Trinity, use the Import Existing flow instead of the greenfield onboarding wizard.

## Overview

The import flow is a 6-step process:

1. **Scan** → 2. **Review** → 3. **Secrets** → 4. **Docs** → 5. **Skills** → 6. **Save**

## Step 1: Scan

Trinity performs a comprehensive filesystem analysis of your codebase:

- **Directory tree** — maps the full project structure
- **Git info** — current branch, remote URLs, recent commits
- **Framework detection** — identifies languages, frameworks, and libraries from package files
- **Quality tools** — detects linters, formatters, test frameworks already configured
- **Environment files** — finds `.env` files and identifies required variables
- **CI/CD** — detects GitHub Actions, GitLab CI, or other pipeline configs
- **Security signals** — flags potential vulnerabilities or security issues

The scan runs automatically when you enter this step.

## Step 2: Review

Trinity's AI interprets the scan results and presents a summary for your review:

- **Project summary** — what the project does, its architecture
- **Detected targets** — platforms identified (Web App, API, Mobile, etc.)
- **Tech stack** — languages, frameworks, databases, and tools
- **Repository structure** — single repo, monorepo, or polyrepo

You can edit any field the AI got wrong. This is your chance to correct misinterpretations before they propagate into the project configuration.

## Step 3: Secrets

Environment variables detected from `.env` files are presented grouped by service:

- Review which secrets are needed
- Import values directly from existing `.env` files
- Add or remove entries manually

All secrets are encrypted using AES-256-GCM before storage. They're injected into the execution environment when agents work on your project.

## Step 4: Docs

Trinity generates four vault pages from the scan results:

- **Architecture** — system design and component relationships
- **Tech Stack** — detailed technology inventory
- **Features** — existing features and capabilities
- **Setup** — how to install and run the project

Generation is streamed — you can watch the content appear in real time. These pages form the initial knowledge base that agents will reference during execution.

## Step 5: Skills

Trinity searches for Claude Code skills that match your detected tech stack:

- Skills are auto-selected based on frameworks and tools found in the codebase
- Review the suggested skills and toggle any you want to add or remove
- Skills are scaffolded into your repository's `.claude/skills/` directory

Core skills (check, review, debug, docs, test, etc.) are always included.

## Step 6: Save

The final step commits everything:

- Project configuration is updated with scan results
- `.claude/` directory is scaffolded in your repository
- Analysis report is saved to the vault
- Onboarding state is cleared

After saving, you're taken to the planning dashboard where you can generate your first PRD based on the existing codebase.

## Tips for Importing

- **Clean git state** — make sure your working tree is clean before scanning. Uncommitted changes won't cause problems, but a clean state gives the most accurate scan.
- **Check the review step carefully** — the AI interpretation is usually good but can misidentify targets or tech stack components. Corrections here save time later.
- **Don't skip secrets** — if your project needs API keys to build or test, setting them up now prevents execution gate pauses later.
- **Review generated docs** — the four vault pages are AI-generated summaries. They're good starting points but may need manual refinement for accuracy.
