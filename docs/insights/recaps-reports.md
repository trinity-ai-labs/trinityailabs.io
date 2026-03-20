# Recaps & Reports

Recaps are automated activity summaries that help you track what Trinity has accomplished. Reports export this data as formatted PDFs.

## Accessing Recaps

Click **Recaps** in the sidebar.

## Recap Types

Trinity generates recaps at seven granularities:

### Daily

What happened today — stories completed, gates resolved, issues encountered. These are the building blocks for all higher-level recaps.

Daily recaps are generated automatically (fire-and-forget) after each story's Documenter phase completes.

### Weekly

Aggregated from daily recaps. Shows the week's progress, patterns, and notable events.

### Monthly

Aggregated from weekly recaps. Broader trends and milestone progress.

### Quarterly

Aggregated from monthly recaps. Strategic-level progress and trajectory.

### Yearly

Aggregated from quarterly recaps. Full-year overview.

### Complete

The entire project history in one summary, built from all available recaps.

### PRD

Per-PRD summaries — what was planned, what was built, what's left. These use the `date` column to store the PRD ID rather than a date.

## How Recaps Build

Recaps follow a hierarchical build model:

```
daily → weekly → monthly → quarterly → yearly → complete
```

Each level aggregates its children in parallel and caches the result. Once built, a recap is stored in the database and doesn't rebuild unless you trigger it.

### Lazy Building

Recaps are built on demand — when you navigate to a period that hasn't been summarized yet. The first load may take a moment while the recap generates.

### Triggering Rebuilds

To force a rebuild (e.g., after manual story changes):

- Click the **Rebuild** button on the recap view
- This regenerates the recap from its source data

## Reading Recaps

Each recap includes:

- **Summary** — narrative overview of the period
- **Stories** — what was completed, failed, or is in progress
- **Gates** — decisions made at execution gates
- **Knowledge** — what was added to the vault
- **Issues** — problems encountered and how they were handled

## Searching Recaps

Use the search feature to find specific information across all recaps:

1. Navigate to Recaps
2. Click the search icon
3. Type your query (e.g., "authentication issues" or "what was the login bug")

Search uses an agentic approach — a micro-tier AI triages your query, finds relevant recaps, and synthesizes an answer.

## Smart Picker

The recap picker helps you find available recaps:

- Shows which periods have recaps available
- Filters by type (daily, weekly, monthly, etc.)
- Navigate forward/backward through time periods

## Reports

Reports export recap data as formatted PDF documents.

### Accessing Reports

1. Navigate to **Recaps**
2. Click the **Reports** button
3. Choose your options
4. Click **Download**

### Report Types

#### Executive Report

High-level progress for managers and stakeholders:

- Project status overview
- Milestone progress
- Key decisions and changes
- Risk summary

#### Technical Report

Developer-focused with implementation details:

- Story completion tables
- Git activity summary
- AI usage statistics
- Pipeline performance metrics

### Report Periods

You can generate reports for any recap period:

- Daily, weekly, monthly, quarterly, yearly
- The report pulls data from the corresponding recap

### PDF Format

Reports are generated as A4 PDFs with:

- Professional formatting
- Charts and tables
- Proper headers and footers
- Print-ready layout

## Tips

- **Check daily recaps** — they're the most actionable, showing exactly what happened each day
- **Use weekly for standup prep** — weekly recaps are great for summarizing progress to your team
- **Export executive reports for stakeholders** — they're designed for non-technical audiences
- **Search before rebuilding** — the search feature can often find what you need without regenerating recaps
