# Architecture

## Workspaces

| Path                         | Role                                      |
| ---------------------------- | ----------------------------------------- |
| `apps/web`                   | Deployable Next.js App Router application |
| `packages/ui`                | Shared design system (`@workspace/ui`)    |
| `packages/typescript-config` | Shared TypeScript configs                 |

Applications may depend on packages. Packages must not depend on applications.

## Dependency rules

- Workspace dependencies use the `workspace:*` protocol.
- Import shared UI through package exports:

```tsx
import { Button } from "@workspace/ui/components/button";
```

- Do not reach into another package with relative paths such as `../../packages/ui/src/...`.
- Do not import `apps/web` from `packages/*`.

## Design system ownership

- Reusable UI components live in `packages/ui/src/components/`.
- Shared tokens and Tailwind setup live in `packages/ui/src/styles/globals.css`.
- Application-specific composition belongs in `apps/web/components/`.
- Add shadcn components from the web app so the CLI routes shared UI into `packages/ui`:

```bash
bunx --bun shadcn@latest add button -c apps/web
```

## Public exports

`@workspace/ui` exposes intentional entry points only:

- `@workspace/ui/globals.css`
- `@workspace/ui/postcss.config`
- `@workspace/ui/components/*`
- `@workspace/ui/hooks/*`
- `@workspace/ui/lib/*`

## Verification ownership

| Concern | Owner |
| --- | --- |
| Lint and format | Root Ultracite (`oxlint.config.ts`, `oxfmt.config.ts`) |
| Typecheck and unit tests | Turborepo tasks per workspace |
| Import and package boundaries | `scripts/check-boundaries.mts` plus Oxlint restrictions |
| Browser smoke | Playwright (`e2e/`) |
| Full gate | `bun run verify` |
