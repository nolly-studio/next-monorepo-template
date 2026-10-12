---
name: fix-bug
description: Reproduce a failure, find the root cause, add a regression test, apply the smallest fix, and rerun verification until the original failure is gone. Use for bugs, failing checks, broken UI, and flaky behavior in this repository.
---

# Fix Bug

## Inputs

- The failing symptom, command, stack trace, or reproduction steps

## Workflow

1. Reproduce the failure with the smallest relevant command (`bun run test`, `bun run typecheck`, `bun run verify:e2e`, or a focused Vitest file).
2. Inspect diagnostics before editing code.
3. Identify the owning app or package from [docs/architecture.md](../../../docs/architecture.md).
4. Add a regression test that fails for the bug when practical.
5. Apply the smallest root-cause fix. Do not weaken lint rules or delete coverage to get green.
6. Rerun the original failing command, then `bun run verify:fast`.
7. For significant or recurring issues, add an entry to [docs/lessons-learned.md](../../../docs/lessons-learned.md).

## Success criteria

- The original failure no longer reproduces.
- A regression test or verification command covers the fix.
- No unrelated files were changed.
- The report states the root cause and the commands that passed.
