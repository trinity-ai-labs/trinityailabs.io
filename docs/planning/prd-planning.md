# PRD Planning Pipeline

The planning pipeline transforms your project vision into a structured, executable plan. Understanding how it works helps you get better results.

## How PRD Generation Works

When you click **Generate PRD**, Trinity runs a 4-phase pipeline. Each phase focuses deeply on one concern, producing better results than a single pass.

### Phase 1: Architect

The architect phase designs the high-level structure:

- **Phases** — major development stages with clear objectives
- **Epics** — groups of related work within each phase
- **Rationale** — why things are organized this way

No stories are created yet — this phase focuses on getting the overall shape right.

### Phase 2: Story Writer

The story writer creates individual stories within the epic structure:

- **Story descriptions** — clear, specific descriptions of what to build
- **Acceptance criteria** — measurable conditions for completion
- **Story type** — regular story, checkpoint, or quality checkpoint

Each story is scoped to be independently executable by an agent.

### Phase 3: Dependency Mapper

The dependency mapper analyzes the stories and adds:

- **Dependencies** — which stories must complete before others can start
- **Checkpoints** — release gates placed at strategic points in the plan
- **Story type refinements** — marking checkpoint vs regular stories

This phase ensures stories execute in a valid order and that release gates are placed where they provide the most value.

### Phase 4: Calibrator

The calibrator rates each story comparatively:

- **Difficulty** (1-5) — how complex the implementation is
- **Surface area** (small/medium/large) — how much of the codebase is touched

These ratings affect execution behavior — higher difficulty stories get more review passes, and the model tier may be upgraded for complex work.

## Post-Pipeline Validation

After all four phases complete, Trinity runs validation:

- **Vague AC detection** — flags acceptance criteria that are too generic (e.g., "works correctly")
- **Coverage check** — verifies the plan covers all aspects of the roadmap
- **Dependency validation** — ensures no circular dependencies or missing references

Issues found are automatically fixed when possible.

## Continuation Context

When generating PRD 2+, the pipeline receives context about previous work:

- Stories from earlier PRDs (completed, failed, skipped)
- Gotchas discovered during execution
- Execution summaries

This lets the new PRD build on existing work without duplicating effort or repeating mistakes.

## Plan Review Best Practices

After generation, review your PRD before starting execution:

### Check Story Scope

Each story should be:

- **Specific** — clearly defined, not vague
- **Independent** — executable on its own (given its dependencies)
- **Testable** — acceptance criteria that an agent can verify

### Verify Dependencies

Look for:

- Stories that should depend on each other but don't
- Unnecessary dependencies that would serialize work that could run in parallel
- Missing checkpoint stories at important milestones

### Adjust Difficulty Ratings

The calibrator does a good job, but you know your codebase best:

- A story touching unfamiliar third-party APIs might deserve a higher rating
- A story that's similar to existing code might deserve a lower rating

### Check Checkpoint Placement

Checkpoints are release gates. Make sure they're at natural boundaries:

- End of a meaningful feature set
- Before a major architectural shift
- At milestones where you'd want to verify everything works together

## Editing Stories

You can edit stories directly in the planning dashboard:

- Click a story to open its detail view
- Edit the description, acceptance criteria, or metadata
- Changes are saved immediately

You can also:

- **Skip stories** you don't want executed
- **Adjust dependencies** by editing the depends_on field
- **Change difficulty/surface area** ratings
