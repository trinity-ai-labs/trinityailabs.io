# Execution Gates

Gates are checkpoints where Trinity pauses the pipeline and asks for your input. They ensure you maintain control over critical decisions during automated execution.

## How Gates Work

When an agent detects a situation that needs human judgment, it raises a gate. The story pauses, and a notification appears on the Run page. The pipeline won't continue until you respond.

## Gate Types

### Deviation Approval

**When:** The analyst detects that a technology specified in the roadmap has a genuine problem — security vulnerability, end-of-life, or incompatibility with other stack components.

**What you see:** The agent's analysis of the problem, the proposed alternative technology, and reasoning for the substitution.

**Actions:**
- **Approve** — accept the proposed substitution, and the implementer uses the alternative
- **Reject** — keep the original technology, and the implementer proceeds as planned

**Important:** Deviations are only raised for genuine blockers (security, EOL, incompatibility). Personal preference or "this is better" are not valid grounds for deviation.

### Missing Assets

**When:** The analyst's plan references placeholder images (wireframes, icons, photos) but the project has fewer than 3 uploaded image assets.

**What you see:** Which assets the story expects and what's currently uploaded.

**Actions:**
- **Upload assets** — add the missing files, then resume
- **Skip** — proceed without the assets (agents will use placeholders)

**Tip:** You can disable this gate globally or per-project with the `skipAssetCheck` setting.

### Missing Business Details

**When:** The analyst flags that the story needs business information (company name, contact email, branding) but the project's business details are incomplete.

**What you see:** Which business details are missing and why the story needs them.

**Actions:**
- **Fill in details** — update business details in project settings, then resume
- **Skip** — proceed without business details

**Tip:** Disable with the `skipBusinessDetailsCheck` setting.

### Missing Secret

**When:** A story requires an API key or credential that isn't configured in the project's secrets.

**What you see:** Which service needs a key and why.

**Actions:**
- **Add the secret** — configure the key in project settings, then resume
- **Skip** — proceed without (the story will likely fail at the service call)

### Story Blocked

**When:** A dependency cannot be met — typically a required story has failed or been skipped.

**What you see:** Which dependency is blocking and its current status.

**Actions:**
- **Resolve the blocker** — fix or retry the failed dependency
- **Skip** — mark the story as skipped

### External Dependencies

**When:** The story requires something outside Trinity's control — a third-party service to be provisioned, manual configuration, etc.

**What you see:** What external action is needed.

**Actions:**
- **Complete the action** — do what's needed externally, then resume
- **Skip** — proceed without

### Checkpoint Approval

**When:** A checkpoint story completes its audit and is ready for release.

**What you see:**
- Release notes
- Audit findings and fixes
- Per-repo version tags that will be created
- Preflight check results

**Actions:**
- **Approve** — creates version tags, merges to the integration branch, marks the checkpoint as passed
- **Skip** — marks the checkpoint as passed without tagging or releasing

### Quality Checkpoint Approval

**When:** A quality checkpoint completes its audit.

**What you see:** Audit findings, fixes applied, and remaining issues.

**Actions:**
- **Approve** — marks the checkpoint as passed
- **Skip** — same as approve but indicates you're acknowledging unresolved issues

**Auto-approve:** Enable "Auto-Approve Quality Checkpoints" in project settings (or globally) to skip the manual approval step. The gate is still created for audit trail, but immediately approved so execution continues without pausing. Release checkpoints always require manual approval regardless of this setting.

## Gate Feedback

For all gate types, you can provide **feedback** instead of a simple approve/skip:

1. Click the gate on the Run page
2. Write your feedback in the text area
3. Optionally attach files (screenshots, specs, design changes)
4. Submit

Feedback triggers a **feedback pipeline** that:

1. Triages your input
2. Re-runs the analyst with your feedback as context
3. Has the implementer make changes
4. Runs the simplify loop again
5. The documenter commits the updates

This lets you iterate on agent output without manually editing code.

## Gate Best Practices

- **Respond promptly** — gates block the pipeline, slowing down dependent stories
- **Provide specific feedback** — "Make the button blue" is better than "This doesn't look right"
- **Use skip judiciously** — skipping gates can lead to issues downstream
- **Check gate history** — each gate shows how many times it's been re-entered (gate_reentry_count)

## Gate Attachments

When providing feedback, you can attach files:

- Screenshots of desired behavior
- Updated wireframes or designs
- API specs or documentation
- Any file the agent might need

Attachments are scoped to the gate — they're cleaned up when the gate is resolved (approved, skipped, or merged).
