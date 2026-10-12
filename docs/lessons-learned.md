# Lessons learned

Record generalizable repository-specific lessons here. Skip one-off trivia.

## Entry format

### Title

- **Failure:** what broke or what an agent repeatedly got wrong
- **Cause:** the underlying reason
- **Approach:** the correct fix or workflow
- **Regression:** the test or verify command that now catches it

## Entries

### Ultracite AGENTS.md overwrite

- **Failure:** `ultracite init --agents universal` replaces the project `AGENTS.md` with a long Ultracite standards dump.
- **Cause:** Ultracite treats that file as its agent target.
- **Approach:** Keep a short project-owned `AGENTS.md` that links to `docs/` and retain the Next.js generated block. Put durable Ultracite usage notes under verification docs rather than duplicating the full standards text.
- **Regression:** Documentation link checks in `bun run scripts/check-boundaries.mts`

### Self-hosted Geist instead of Google Fonts

- **Failure:** `next/font/google` Geist fetches from fonts.googleapis.com and fails offline builds.
- **Cause:** Google Fonts requires network at build time.
- **Approach:** Use the `geist` package (`geist/font/sans`, `geist/font/mono`) which self-hosts via `next/font/local`, and map `--font-sans` / `--font-mono` to `--font-geist-sans` / `--font-geist-mono`.
- **Regression:** `bunx turbo build --filter=web` without network access to fonts.googleapis.com

### Generated shadcn components and Ultracite

- **Failure:** Fresh `shadcn add` output fails `ultracite check` on `sort-keys`, function style, and import style.
- **Cause:** Registry components use function declarations and variant key order that Ultracite's defaults reject.
- **Approach:** Scope relaxations to `packages/ui/src/components/**` in `oxlint.config.ts`, and run `bun run fix` after generating components in clean-room checks.
- **Regression:** `bun run verify:template`
