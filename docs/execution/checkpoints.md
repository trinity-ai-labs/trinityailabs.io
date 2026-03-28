# Checkpoints & Releases

Checkpoints are special stories that act as quality gates and release points in your development pipeline. They pause execution for human review before work continues.

## Two Types of Checkpoints

### Quality Checkpoints

Quality checkpoints (`quality_checkpoint` story type) run an intensive audit of the codebase without creating a release:

1. **Analyze** — scan the codebase for issues
2. **Audit/Fix loop** — multi-perspective audit scaled by difficulty, fix critical issues, repeat until clean
3. **Documentation** — write up findings
4. **Human gate** — wait for your approval before downstream stories continue

Use quality checkpoints mid-phase when you want to ensure code quality before moving on.

### Release Checkpoints

Release checkpoints (`release_checkpoint` story type) do everything quality checkpoints do, plus:

- **Release notes** — generated automatically
- **Per-repo versioning** — each repo gets an auto-incremented semver tag (v0.1 -> v0.2)
- **Preflight checks** — platform-specific quality checks before release

## How They Work

Checkpoints can appear anywhere in the story graph — mid-phase, at phase boundaries, or spanning multiple phases. They're flexible, not mandatory at every phase end.

### Dependency Gating

Downstream stories should depend on the checkpoint story ID. This ensures the checkpoint acts as a gate: no work continues past it until you approve.

### Per-Repo Versioning

Each repo in your project tracks its own version independently via git tags. When a checkpoint targets a repo, it scans existing `v*` tags and auto-increments the minor version.

You can control which repos get tagged using `repo:<name>` tags on checkpoint stories. No repo tags means all repos get tagged.

## Gate Approval

When a checkpoint completes its pipeline and reaches the human gate:

- **Approve** (release checkpoints) — tags affected repos with the new version and marks the story as passed
- **Skip** — marks the story as passed without tagging
- **Provide feedback** — sends the checkpoint back through the feedback pipeline for fixes

## Release Branches

If your project has `use_release_branches` enabled, release checkpoints create a release branch instead of merging directly. On gate approval:

1. Release branch merges to the integration branch
2. Optionally auto-merges to the base branch (`auto_release_to_base`)
3. Optionally deletes the release branch (`delete_release_branch`)

Stories get a `released` flag when their code reaches the base branch via the checkpoint chain.

## Releases

Releases are first-class entities that group one or more PRDs into a shippable unit. When you link PRDs to a release, Trinity automatically creates a release checkpoint story that depends on all stories in the linked PRDs. See the [Releases](/knowledge?book=user-guide&section=execution&chapter=releases&page=releases) page for full details on creating releases, linking PRDs, managing dependencies, and the release lifecycle.

### PRDs vs Releases

Don't confuse these two concepts:

- **PRDs** are plan iterations identified by simple integers (1, 2, 3)
- **Releases** group PRDs into shippable units with semver tags (v0.1, v1.0) managed per-repo by checkpoints

In the UI, plan iterations are always called "PRDs", never "Versions".
