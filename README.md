# Next.js Monorepo Starter

A minimal, production-ready TypeScript monorepo for Next.js apps. It ships with a shared Base UI design system, Bun workspaces, Turborepo, Ultracite quality gates, and an agent-friendly verification loop.

## Technology stack

- **Monorepo:** Turborepo + Bun workspaces
- **App:** Next.js App Router
- **UI:** shadcn/ui (`base-nova`) on Base UI + Hugeicons + Tailwind CSS v4
- **Quality:** Ultracite (Oxlint + Oxfmt), anti-slop, `@shadcn/lint`, type-aware linting
- **Tests:** Vitest unit tests + Playwright smoke
- **Agents:** `AGENTS.md`, `docs/`, and `.agents/skills/`

## Architecture

```text
apps/web                 Next.js application
packages/ui              Shared design system (@workspace/ui)
packages/typescript-config
docs/                    Architecture, conventions, testing, decisions
.agents/skills/          implement-feature, fix-bug, verify-change
scripts/                 verify and boundary checks
```

Applications may import packages. Packages must not import applications. Shared UI is imported as `@workspace/ui/components/*`.

See [docs/architecture.md](docs/architecture.md) for ownership rules.

## Quick start

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development commands

| Command                   | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `bun run dev`             | Start the Next.js app                          |
| `bun run check`           | Ultracite lint and format checks               |
| `bun run fix`             | Auto-fix Ultracite issues                      |
| `bun run typecheck`       | TypeScript across workspaces                   |
| `bun run test`            | Unit tests                                     |
| `bun run build`           | Production build                               |
| `bun run verify:fast`     | Changed-file checks + affected tests           |
| `bun run verify`          | Full lint, typecheck, tests, boundaries, build |
| `bun run verify:e2e`      | Playwright smoke against the built app         |
| `bun run verify:template` | Clean-room template validation                 |

## Adding shadcn components

Run the CLI from the repository with the web app as the target. Shared components land in `packages/ui`:

```bash
bunx --bun shadcn@latest add button -c apps/web
```

Import them from the package:

```tsx
import { Button } from "@workspace/ui/components/button";
```

Both `apps/web/components.json` and `packages/ui/components.json` use `base-nova` and Hugeicons.

## Shared UI conventions

- Prefer existing shadcn components over custom primitives.
- Use Base UI APIs (`render`, Select `items`). Never add Radix.
- Keep tokens in `packages/ui/src/styles/globals.css`.
- Keep application-specific composition in `apps/web/components/`.

## Adding a new application

1. Create `apps/<name>` with its own `package.json` and TypeScript config that extends `@workspace/typescript-config`.
2. Depend on shared packages with `workspace:*`.
3. Add Turborepo-compatible `dev`, `build`, `typecheck`, and optional `test` scripts.
4. Do not let packages import the new app.

## Adding a shared package

1. Create `packages/<name>` with explicit `exports`.
2. Extend the appropriate config from `packages/typescript-config`.
3. Add it as a `workspace:*` dependency only from apps or other packages that need it.
4. Avoid one-off packages for trivial helpers.

## Linting and formatting

Ultracite is the only lint/format toolchain:

```bash
bun run check
bun run fix
```

Husky + lint-staged run `ultracite fix` on staged files. VS Code settings point at the Oxc extension for format-on-save.

## AI agent guidelines

Start at [AGENTS.md](AGENTS.md). Deeper guidance lives in `docs/`. Reusable workflows:

- `.agents/skills/implement-feature`
- `.agents/skills/fix-bug`
- `.agents/skills/verify-change`

Claude Code discovers the same skills through `.claude/skills` (symlink).

## Deployment notes

`apps/web` is a standard Next.js app. Deploy it with any Next.js-compatible host. Build from the repo root with `bun run build`, or build only the web app with `bunx turbo build --filter=web`. Keep environment secrets out of the repository; `.env*` files are gitignored.

# next-monorepo-template

# next-monorepo-template
