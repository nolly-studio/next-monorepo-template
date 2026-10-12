<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Read first

- Architecture: [docs/architecture.md](docs/architecture.md)
- Conventions: [docs/conventions.md](docs/conventions.md)
- Testing: [docs/testing.md](docs/testing.md)
- Lessons: [docs/lessons-learned.md](docs/lessons-learned.md)
- Base UI decision: [docs/decisions/0001-base-ui.md](docs/decisions/0001-base-ui.md)

Read only the documents relevant to your task.

## Stack

- Next.js App Router
- React Server Components by default
- TypeScript strict
- Turborepo + Bun
- shadcn/ui with Base UI (`base-nova`), never Radix
- Hugeicons
- Tailwind CSS v4
- Ultracite + Oxlint + Oxfmt

## Before implementing

1. Inspect existing code and conventions.
2. Identify the correct application or package.
3. Define observable success criteria.
4. Prefer existing components and utilities.
5. Choose the smallest correct implementation.

## During implementation

- Do not add speculative abstractions.
- Do not add dependencies without justification.
- Do not bypass TypeScript errors.
- Do not suppress lint rules to hide problems.
- Do not modify unrelated files.
- Use Base UI primitives for shared UI.
- Add focused tests for changed behavior.

## Verification

Run the appropriate checks:

- `bun run verify:fast`
- `bun run verify`
- `bun run verify:e2e` when UI behavior changes

Fix failures and rerun affected checks.

A passing build is not proof of correct behavior.

Never claim a command passed unless it was run.

## Documentation

Update documentation when contracts, architecture, developer commands, or public behavior changes.

Do not duplicate instructions across documents.

Do not hand-edit generated files that the Next.js or shadcn tooling owns unless the task requires it.

## Learning

After resolving a recurring or non-obvious failure, add a concise entry to `docs/lessons-learned.md`.

## Completion

Report:

- What changed
- What was tested
- What passed
- What could not be verified

Never claim work is complete if required checks fail.

## Skills

Reusable workflows live in `.agents/skills/` (`implement-feature`, `fix-bug`, `verify-change`). Claude Code discovers the same files through `.claude/skills`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
