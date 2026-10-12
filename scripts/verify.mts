import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mode = process.argv[2] ?? "full";

function run(label: string, command: string, args: string[]): void {
  console.log(`\n> ${label}`);
  console.log(`$ ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf-8",
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\n${label} failed with exit code ${result.status ?? 1}`);
    process.exit(result.status ?? 1);
  }
}

function changedFiles(): string[] {
  const result = spawnSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMRTUXB", "HEAD"],
    {
      cwd: root,
      encoding: "utf-8",
    }
  );

  if (result.status !== 0) {
    return [];
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function affectedPackages(files: string[]): string[] {
  const packages = new Set<string>();

  for (const file of files) {
    if (file.startsWith("apps/web/")) {
      packages.add("web");
    }
    if (file.startsWith("packages/ui/")) {
      packages.add("@workspace/ui");
    }
    if (file.startsWith("packages/typescript-config/")) {
      packages.add("@workspace/typescript-config");
    }
  }

  return [...packages];
}

function verifyFast(): void {
  const files = changedFiles().filter((file) =>
    /\.(?:[cm]?[jt]sx?|json|jsonc|css|md|mdx)$/u.test(file)
  );

  if (files.length > 0) {
    run("Ultracite (changed files)", "bunx", ["ultracite", "check", ...files]);
  } else {
    console.log("\n> Ultracite (changed files)");
    console.log("No changed source files; skipping focused lint.");
  }

  const packages = affectedPackages(changedFiles());
  if (packages.length > 0) {
    const filterArgs = packages.flatMap((name) => ["--filter", name]);
    run("Typecheck (affected)", "bunx", ["turbo", "typecheck", ...filterArgs]);
    run("Test (affected)", "bunx", ["turbo", "test", ...filterArgs]);
  } else {
    run("Typecheck", "bunx", ["turbo", "typecheck"]);
    run("Test", "bun", ["run", "test"]);
  }
}

function verifyFull(): void {
  run("Ultracite", "bunx", ["ultracite", "check"]);
  run("Typecheck", "bunx", ["turbo", "typecheck"]);
  run("Test", "bun", ["run", "test"]);
  run("Boundaries", "bun", ["run", "scripts/check-boundaries.mts"]);
  run("Build", "bunx", ["turbo", "build"]);
}

function verifyE2E(): void {
  run("Build web", "bunx", ["turbo", "build", "--filter=web"]);
  run("Playwright smoke", "bunx", [
    "playwright",
    "test",
    "--config=playwright.config.ts",
  ]);
}

switch (mode) {
  case "fast": {
    verifyFast();
    break;
  }
  case "e2e": {
    verifyE2E();
    break;
  }
  case "full": {
    verifyFull();
    break;
  }
  default: {
    console.error(`Unknown verify mode: ${mode}`);
    process.exit(1);
  }
}

console.log(`\nverify:${mode === "full" ? "" : mode} passed.`);
