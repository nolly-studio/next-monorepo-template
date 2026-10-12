# Conventions

## Implementation

1. Inspect existing code before adding new files or dependencies.
2. Prefer the smallest correct change in the owning app or package.
3. Reuse `@workspace/ui` components and utilities before inventing new ones.
4. Keep React Server Components as the default. Add `"use client"` only at the boundary that needs browser APIs or interactivity.
5. Prefer composition over wrappers and factories.

## UI

- Use shadcn components built on Base UI (`@base-ui/react`).
- Never introduce Radix UI packages or imports.
- Use Hugeicons through the project's configured icon library.
- Prefer semantic design tokens (`bg-background`, `text-muted-foreground`) over raw colors.
- Use `gap-*` for spacing. Use `size-*` when width and height are equal.
- For Base UI triggers that should render as another component, use `render` rather than `asChild`.

## TypeScript

- Keep `strict` enabled.
- Avoid `any`, unjustified non-null assertions, and type assertions that hide real incompatibilities.
- When an assertion is required and accepted by anti-slop rules, document it with a `SAFETY:` comment.

## Self-correction

When a check fails:

1. Reproduce the failure.
2. Read the diagnostic.
3. Apply the smallest plausible root-cause fix.
4. Rerun the focused check, then the relevant verify gate.
5. Add a regression test for significant bugs.
6. Record a lesson only when the failure is recurring or repository-specific.

Never weaken lint rules, delete tests, or edit snapshots solely to make validation pass.
