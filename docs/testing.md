# Testing

## Unit tests

Vitest covers reusable package behavior. Current coverage lives in `packages/ui` for helpers such as `cn` and `buttonVariants`.

```bash
bun run test
```

## Verification gates

| Command | When to use |
| --- | --- |
| `bun run verify:fast` | During implementation. Lints changed files and typechecks/tests affected packages. |
| `bun run verify` | Before claiming a change is complete. Runs Ultracite, typecheck, unit tests, boundary checks, and production build. |
| `bun run verify:e2e` | When UI behavior changes. Runs the Playwright smoke against a built Next.js app. |
| `bun run verify:template` | After template-level changes. Clean-room install, shadcn generation, verify, and homepage fetch. |

CI runs `bun run verify` and `bun run verify:e2e`.

## Browser smoke

`e2e/homepage.e2e.ts` asserts that:

1. The homepage heading renders.
2. The theme toggle changes the document theme class.
3. The Base UI dialog opens with an accessible title and can be closed.

A successful TypeScript compile or production build is not sufficient proof of correct UI behavior.

## Boundary fixtures

`scripts/check-boundaries.test.mts` exercises the boundary checker against a temporary bad dependency graph so the real repository stays clean.
