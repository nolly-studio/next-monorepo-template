---
name: verify-change
description: Verify local changes with the repository quality gates, exercise changed UI behavior, and report only commands that actually ran. Use before declaring work complete or when asked to validate a branch or pull request.
---

# Verify Change

## Inputs

- The changed files or feature area
- Whether UI behavior changed

## Workflow

1. Inspect `git status` and the diff to determine affected packages.
2. Run `bun run verify:fast` while iterating.
3. Run `bun run verify` before completion.
4. If UI, routes, theme, or interactive components changed, run `bun run verify:e2e`.
5. Review the diff for accidental scope, Radix usage, and missing docs updates.
6. Report what changed, what was tested, what passed, and what could not be verified.

## Success criteria

- Required gates for the change passed.
- Runtime UI checks were performed when behavior changed.
- No claim was made about a command that was not executed.
- Failures were fixed or explicitly reported as blockers.
