# Metrics Dashboard

The Metrics dashboard provides execution analytics, helping you understand how efficiently Trinity is building your project.

## Accessing Metrics

Click **Metrics** in the sidebar. Data refreshes every 5 seconds.

## Dashboard Tabs

### Overview

The overview tab shows North Star metrics — the most important indicators:

- **Success Rate** — percentage of stories that complete successfully (vs. failing)
- **First-Pass Rate** — percentage of stories that pass on the first attempt without needing retries
- **Cost per Merged Story** — average token cost to complete and merge a story
- **Average Cycle Time** — how long stories take from start to completion

These metrics help you evaluate the overall health of your execution pipeline.

### Pipeline

Visualizes the story execution funnel:

- **Pending → Claimed → Running → Complete/Failed** — how stories flow through the system
- **Queue Wait Time** — how long stories wait before a worker picks them up
- **Gate Wait Time** — how long stories spend waiting at execution gates
- **Failure Reasons** — breakdown of why stories fail

Use this tab to identify bottlenecks. Long queue wait times suggest you need more workers. Long gate wait times mean you should check for pending approvals more frequently.

### Cost

Token usage and cost tracking:

- **Token Breakdown** — input tokens, output tokens, cache hits, wasted tokens (from failed stories)
- **Daily Cost Trend** — how much you're spending per day
- **Total Cost** — cumulative spend in USD

Cost data comes from the `ai_events` table, which tracks every AI operation. Wasted tokens from failed story runs are tracked separately so you can see efficiency.

### Workers

Worker pool health:

- **Utilization** — percentage of time workers are busy vs. idle
- **Total / Busy / Idle** — current worker status breakdown
- **Retry Distribution** — how often stories need to be retried
- **Stale Jobs** — jobs that have been running too long
- **Per-Worker Stats** — individual worker performance

### AI Usage

Agent-level performance:

- **Per-Agent Success Rate** — how often each pipeline phase (analyst, implementer, auditor, documenter) succeeds
- **Handoff Success Rate** — reliability of transitions between agents
- **Average Duration** — how long each agent phase takes

This helps identify if a particular agent phase is causing problems. For example, a low auditor success rate might indicate that the implementer is producing code that needs heavy revision.

### Detail

Per-PRD rollups:

- **Completion Percentage** — how far along each PRD is
- **Token Usage** — cost per PRD
- **Cycle Time** — average story duration per PRD
- **Story Breakdown** — status distribution for each PRD

## Understanding the Metrics

### Success Rate

A healthy project typically has a success rate above 80%. Lower rates suggest:

- Stories are too vague (improve acceptance criteria)
- Dependencies are missing (stories fail because required code doesn't exist)
- External services aren't configured (missing secrets)

### First-Pass Rate

This measures how often stories succeed without retries. A high first-pass rate (>70%) indicates:

- Good planning — stories are well-scoped
- Clean codebase — agents can work effectively
- Accurate difficulty ratings — appropriate resources are allocated

### Cost per Story

This varies significantly by difficulty:

- Difficulty 1-2: lower cost (uses standard-tier models)
- Difficulty 3-5: higher cost (uses reasoning-tier models)
- Checkpoints: highest cost (multi-pass audits)

### Cycle Time

Average time from story start to completion. Affected by:

- Story difficulty and surface area
- Number of auditor passes
- Gate wait time
- Worker availability

## Timezone Handling

The database stores all timestamps in UTC. The metrics dashboard converts to your local timezone for daily groupings, so the "Daily Cost Trend" chart reflects your actual days.

## Tips

- **Monitor the pipeline tab** after starting execution — it shows real-time flow
- **Check cost trends weekly** — catch unexpected spending spikes early
- **Use worker health** to tune parallelism — if utilization is consistently low, reduce workers; if queue wait is high, add more
- **Compare PRD rollups** — later PRDs should ideally have better metrics as the knowledge base grows and gotchas accumulate
