# Planning Dashboard

The planning dashboard is your central view for managing PRDs and tracking development progress.

## Accessing the Dashboard

Click **Plan** in the sidebar. The dashboard shows the currently active PRD with tabs to switch between PRDs if you have multiple.

## Dashboard Elements

### PRD Tabs

If your project has multiple PRDs, numbered tabs appear at the top. Each PRD represents an iteration of your development plan. Click a tab to switch views.

### Phase Progress

Each phase in your PRD shows:

- **Progress bar** — percentage of stories completed
- **Story counts** — total, completed, running, pending, failed
- **Phase status** — whether execution has reached this phase

### Stats Overview

Summary cards showing:

- **Total stories** across the PRD
- **Completion rate** — percentage done
- **Running** — stories currently in the pipeline
- **Blocked** — stories waiting on dependencies or gates

### Story Graph

A visual dependency graph showing all stories and their relationships. This is invaluable for understanding:

- Which stories are blocking others
- Where parallel work is possible
- The critical path through your plan

You can zoom, pan, and click individual nodes for details. Graph layouts can be saved and restored.

## Dashboard Actions

### Generate PRD

Click **Generate PRD** to create a new plan. This launches the 4-phase planning pipeline:

1. **Architecting** — designs phases and epics
2. **Writing Stories** — creates individual stories
3. **Mapping Dependencies** — sets up the dependency graph
4. **Calibrating** — rates difficulty and surface area

Progress is shown in the sidebar task indicator with phase-aware labels.

### Architect

Opens the Architect flow to add new stories to an existing PRD. See the [Architect guide](/knowledge?book=user-guide&section=planning&chapter=add-feature&page=add-feature) for details.

### Diagnose

Runs a health check on your project. See the [Diagnose guide](/knowledge?book=user-guide&section=planning&chapter=diagnose&page=diagnose) for details.

## Working with the Story Graph

### Reading the Graph

- **Node colors** indicate story status:
  - Gray = pending
  - Blue = running
  - Green = complete
  - Red = failed
  - Yellow = gate / waiting
- **Edges** (arrows) show dependencies — a story can't run until all its incoming dependencies are complete
- **Checkpoint nodes** are visually distinct — they represent release gates

### Saving Layouts

After arranging the graph to your liking:

1. Click the save button on the graph toolbar
2. Give the layout a name
3. Restore saved layouts from the dropdown

Layouts are project-scoped and persist across sessions.

## PRD Management

### Multiple PRDs

Projects can have multiple PRDs, each building on the previous:

- PRD 1 might cover the foundation and core features
- PRD 2 adds advanced features and polish
- PRD 3 handles optimization and launch prep

Later PRDs receive context about what was built in earlier ones, including:

- Completed stories and their outcomes
- Gotchas discovered during execution
- Failed stories and why they failed

### Cross-PRD Dependencies

Stories can depend on stories from other PRDs using the `N:X.Y.Z` format (e.g., `1:1.2.1` depends on story 1.2.1 from PRD 1). This is useful when new features build directly on work from a previous iteration.

### Concurrent PRD Execution

Multiple PRDs can execute simultaneously — each gets its own coordinator instance. This lets you work on independent feature tracks in parallel.
