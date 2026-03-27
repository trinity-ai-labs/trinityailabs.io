# Running Execution

Execution is where Trinity's AI agents build your project. The coordinator manages the process, assigning stories to workers that execute them through the agent pipeline.

## Starting Execution

1. Navigate to **Run**
2. Select which release to execute (if you have multiple)
3. Click **Start**

The run dialog lets you configure this execution:

- **Story** — pick a specific story or let Trinity choose the next best
- **Workers** — 1-5 parallel workers (each in its own git worktree)
- **Max Stories** — stop after N stories, or run unlimited
- **Mode** — Manual (override defaults) or Autopilot (auto-skip gates, make assumptions)

### Manual Mode Overrides

In manual mode you can override project defaults for this run:

- Auto-clarify, Auto-create PR, Auto-merge, Squash merge, Delete branch after merge
- **Auto-approve quality checkpoints** — quality checkpoints run full QA but auto-approve the gate
- Checkpoint pipeline tuning: audit perspectives (2-7) and max fix loops (2-5)

### Autopilot Mode

Runs without stopping. Makes reasonable assumptions for unclear requirements and auto-skips all gates.

## The Coordinator

Each release gets its own coordinator instance. The coordinator:

- **Scans** for stories that are ready to execute
- **Assigns** stories to available workers
- **Monitors** worker health and progress
- **Auto-stops** after consecutive idle scans (no more runnable stories)

### Coordinator States

- **Running** — actively scanning and assigning work
- **Stopped** — manually stopped or auto-stopped after idle
- **Starting** — initializing workers and scanning

## Workers

Workers are the processes that actually execute stories. Each worker:

1. Claims a job from the queue (atomic, preventing duplicates)
2. Creates a git worktree for isolated code changes
3. Runs the story through the 4-phase agent pipeline
4. Handles PR creation and merging on success

### Worker Configuration

- **Max workers** — how many stories can execute in parallel (configurable in project settings)
- **Worker health** — the coordinator monitors workers and marks stale ones as dead

### Worker Status

- **Idle** — waiting for a story assignment
- **Busy** — executing a story
- **Dead** — crashed or timed out (cleaned up on restart)

## The Agent Pipeline

Each story flows through four phases:

### 1. Analyst (Read-Only)

The analyst reads the codebase and plans the implementation:

- Analyzes project structure and relevant files
- Creates an implementation plan
- Detects required services
- Checks execution gates (may pause here)

This phase doesn't modify any code.

### 2. Implementer (Doer)

The implementer writes the code:

- Follows the analyst's plan
- Creates or modifies files
- Writes tests
- Does NOT commit (that's the Documenter's job)

### 3. Auditor (Simplify Loop)

The auditor reviews and improves the code through multiple passes:

- Number of passes scales with story difficulty and surface area (1-7 passes)
- Each pass simplifies, refactors, and catches issues
- Early exit if a pass finds nothing to improve
- Final pass includes a full code review and build verification

### 4. Documenter (Doer)

The documenter wraps up:

- Commits all changes
- Creates pull requests
- Writes learnings to the knowledge base
- Updates audit tracking if applicable
- Triggers a daily recap update

## Git Worktrees

Each running story gets its own git worktree — an isolated copy of the repository. This means:

- Multiple stories can run in parallel without conflicts
- Failed stories don't affect other work
- The main branch stays clean until code is merged

Worktrees are created in `~/.trinity/projects/{slug}/` and cleaned up after merge.

## Monitoring Execution

### Run Page

The Run page shows:

- **Active stories** — what's currently executing and which pipeline phase
- **Queue** — stories waiting for workers
- **Gates** — stories paused for your input
- **Completed** — recently finished stories
- **Failed** — stories that encountered errors

### Task Indicator

The sidebar task indicator shows what's happening:

- Which release is executing
- Current pipeline phase for active stories
- Gate notifications

## Stopping Execution

Click **Stop** on the Run page to stop the coordinator. This:

- Stops scanning for new stories
- Lets currently running stories finish
- Workers complete their current job before going idle

It does NOT cancel in-progress stories. To force-stop everything, use the kill option.

## Concurrent Release Execution

You can run multiple releases simultaneously. Each gets independent:

- Coordinator instance
- Worker pool
- Job queue

This is useful for parallel releases that don't depend on each other.

## Retry and Recovery

If a story fails:

- Check the agent handoffs for error details
- The story can be retried (reset to pending)
- The coordinator will pick it up again on the next scan

If Trinity crashes or restarts:

- Stale execution state is automatically cleaned up
- Running coordinators are stopped
- Orphaned tasks are failed with recovery messages
- You can restart execution normally
