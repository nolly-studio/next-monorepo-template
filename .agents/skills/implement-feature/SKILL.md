---
name: implement-feature
description: Implement a feature in this Bun + Next.js monorepo by finding the owning workspace, reusing existing UI and conventions, defining acceptance criteria, and running focused verification. Use whenever adding product behavior, UI, or shared package APIs.
---

# Implement Feature

## Inputs

- The user request and any acceptance criteria
- The files or routes that should change

## Workflow

1. Read [docs/architecture.md](../../../docs/architecture.md) and [docs/conventions.md](../../../docs/conventions.md) if ownership is unclear.
2. Search the repo for an existing component, helper, or pattern before creating new ones.
3. Place application code in `apps/web` and reusable UI in `packages/ui`.
4. Prefer Server Components. Keep client islands small.
5. Import shared UI from `@workspace/ui/components/*`.
6. Add or update focused Vitest coverage for changed reusable behavior.
7. Run `bun run verify:fast`. If UI behavior changed, also run `bun run verify:e2e` before finishing.
8. Update docs only when contracts, commands, or architecture changed.

## Success criteria

- The requested behavior works in the owning workspace.
- No new Radix dependency or import was introduced.
- Focused verification passed.
- The completion report lists commands that were actually run.
