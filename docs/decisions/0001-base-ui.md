# 0001. Base UI, Hugeicons, Bun, Ultracite

## Status

Accepted

## Context

The starter needs a modern design system, a fast package manager, and agent-friendly quality gates without overlapping lint tools.

## Decision

- Use shadcn/ui with the `base-nova` style and Base UI primitives (`@base-ui/react`).
- Do not install or generate Radix UI components.
- Keep Hugeicons as the icon library configured in both `components.json` files.
- Keep Bun workspaces and `bun.lock` as the package manager.
- Use Ultracite with Oxlint, Oxfmt, anti-slop, `@shadcn/lint`, and type-aware linting. Do not install ESLint, Prettier, or Biome.

## Consequences

- Shared components must preserve Base UI APIs such as `render` and Select `items`.
- Agents should add UI through the shadcn CLI from `apps/web` so files land in `packages/ui`.
- Verification commands are invoked with `bun run`.
- Boundary checks fail if `@radix-ui/*` appears in dependencies or imports.
