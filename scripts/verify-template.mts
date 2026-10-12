import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const sourceRoot = resolve(import.meta.dirname, "..");
const tempRoot = mkdtempSync(join(tmpdir(), "next-monorepo-template-"));

function run(
  label: string,
  command: string,
  args: string[],
  cwd = tempRoot
): void {
  console.log(`\n> ${label}`);
  console.log(`$ ${command} ${args.join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf-8",
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`\n${label} failed with exit code ${result.status ?? 1}`);
    rmSync(tempRoot, { force: true, recursive: true });
    process.exit(result.status ?? 1);
  }
}

try {
  console.log(`Copying template to ${tempRoot}`);
  run(
    "Copy workspace",
    "rsync",
    [
      "-a",
      "--exclude",
      "node_modules",
      "--exclude",
      ".git",
      "--exclude",
      ".next",
      "--exclude",
      ".turbo",
      "--exclude",
      "test-results",
      "--exclude",
      "playwright-report",
      "--exclude",
      "coverage",
      `${sourceRoot}/`,
      `${tempRoot}/`,
    ],
    sourceRoot
  );

  run("Install", "bun", ["install", "--frozen-lockfile"]);
  run("Add badge component", "bunx", [
    "--bun",
    "shadcn@latest",
    "add",
    "badge",
    "-c",
    "apps/web",
    "--yes",
  ]);

  const badgePath = join(tempRoot, "packages/ui/src/components/badge.tsx");
  if (!existsSync(badgePath)) {
    throw new Error(`Expected generated component at ${badgePath}`);
  }
  console.log(`Confirmed component landed at ${badgePath}`);

  run("Format generated component", "bun", ["run", "fix"]);
  run("Verify", "bun", ["run", "scripts/verify.mts", "full"]);
  run("Build web", "bunx", ["turbo", "build", "--filter=web"]);
  run("Start check", "bun", [
    "-e",
    `
    import { spawn } from "node:child_process";
    const child = spawn("bun", ["run", "--filter", "web", "start", "--", "-H", "127.0.0.1", "-p", "3000"], {
      cwd: ${JSON.stringify(tempRoot)},
      stdio: ["ignore", "pipe", "pipe"],
    });
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      try {
        const response = await fetch("http://127.0.0.1:3000");
        if (response.ok) {
          const html = await response.text();
          if (!html.includes("Next.js starter template")) {
            throw new Error("Homepage content missing");
          }
          child.kill("SIGTERM");
          console.log("Homepage responded successfully");
          process.exit(0);
        }
      } catch {
        await Bun.sleep(500);
      }
    }
    child.kill("SIGTERM");
    throw new Error("Timed out waiting for the app to respond");
    `,
  ]);

  console.log("\nverify:template passed.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  rmSync(tempRoot, { force: true, recursive: true });
}
