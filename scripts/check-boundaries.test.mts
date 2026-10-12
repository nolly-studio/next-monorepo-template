import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function writePkg(dir: string, pkg: Record<string, unknown>): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
}

function createFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "boundaries-"));

  writeFileSync(
    join(root, "package.json"),
    `${JSON.stringify(
      {
        name: "fixture-root",
        private: true,
        workspaces: ["apps/*", "packages/*"],
      },
      null,
      2
    )}\n`
  );

  writePkg(join(root, "apps/web"), {
    dependencies: {
      "@radix-ui/react-dialog": "^1.0.0",
      "@workspace/ui": "workspace:*",
    },
    name: "web",
    private: true,
  });

  writePkg(join(root, "packages/ui"), {
    exports: {
      "./globals.css": "./src/styles/globals.css",
    },
    name: "@workspace/ui",
    private: true,
  });

  mkdirSync(join(root, "packages/ui/src/styles"), { recursive: true });
  writeFileSync(join(root, "packages/ui/src/styles/globals.css"), "");

  for (const path of [
    "apps/web/components.json",
    "packages/ui/components.json",
  ]) {
    writeFileSync(
      join(root, path),
      `${JSON.stringify({
        aliases: { ui: "@workspace/ui/components" },
        iconLibrary: "hugeicons",
        style: "base-nova",
      })}\n`
    );
  }

  return root;
}

describe("check-boundaries", () => {
  it("fails when a package declares a Radix dependency", () => {
    const root = createFixture();

    try {
      const result = spawnSync("bun", ["run", "scripts/check-boundaries.mts"], {
        cwd: process.cwd(),
        encoding: "utf-8",
        env: {
          ...process.env,
          BOUNDARY_ROOT: root,
        },
      });

      expect(result.status).not.toBe(0);
      expect(`${result.stderr}${result.stdout}`).toContain(
        "@radix-ui/react-dialog"
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });
});
