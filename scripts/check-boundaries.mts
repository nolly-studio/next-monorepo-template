import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const configuredRoot = process.env.BOUNDARY_ROOT;
const root =
  configuredRoot !== undefined && configuredRoot !== ""
    ? resolve(configuredRoot)
    : resolve(import.meta.dirname, "..");
const errors: string[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(path: string): Record<string, unknown> {
  const value: unknown = JSON.parse(readFileSync(path, "utf-8"));
  if (!isRecord(value)) {
    throw new Error(`Expected JSON object at ${path}`);
  }
  return value;
}

function asStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      result[key] = entry;
    }
  }
  return result;
}

function workspacePackageDirs(): string[] {
  const groups = ["apps", "packages"] as const;
  const dirs: string[] = [];

  for (const group of groups) {
    const groupDir = join(root, group);
    if (!existsSync(groupDir)) {
      continue;
    }

    for (const entry of readdirSync(groupDir)) {
      const dir = join(groupDir, entry);
      if (
        statSync(dir).isDirectory() &&
        existsSync(join(dir, "package.json"))
      ) {
        dirs.push(dir);
      }
    }
  }

  return dirs;
}

function collectDeps(pkg: Record<string, unknown>): Record<string, string> {
  return {
    ...asStringRecord(pkg.dependencies),
    ...asStringRecord(pkg.devDependencies),
    ...asStringRecord(pkg.peerDependencies),
  };
}

function checkRadixDependencies(): void {
  for (const dir of workspacePackageDirs()) {
    const pkg = readJson(join(dir, "package.json"));
    const deps = collectDeps(pkg);

    for (const name of Object.keys(deps)) {
      if (name === "@radix-ui" || name.startsWith("@radix-ui/")) {
        errors.push(
          `${relative(root, dir)}/package.json declares forbidden dependency ${name}`
        );
      }
    }
  }

  const rootPkg = readJson(join(root, "package.json"));
  for (const name of Object.keys(collectDeps(rootPkg))) {
    if (name === "@radix-ui" || name.startsWith("@radix-ui/")) {
      errors.push(`package.json declares forbidden dependency ${name}`);
    }
  }
}

function checkWorkspaceGraph(): void {
  const packages = workspacePackageDirs().map((dir) => {
    const pkg = readJson(join(dir, "package.json"));
    return {
      deps: collectDeps(pkg),
      dir,
      isApp: relative(root, dir).startsWith("apps/"),
      name: String(pkg.name),
    };
  });

  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]));

  for (const pkg of packages) {
    for (const [depName, version] of Object.entries(pkg.deps)) {
      const dep = byName.get(depName);
      if (!dep) {
        continue;
      }

      if (!version.startsWith("workspace:")) {
        errors.push(
          `${pkg.name} depends on workspace package ${depName} without workspace:* (${version})`
        );
      }

      if (!pkg.isApp && dep.isApp) {
        errors.push(
          `${pkg.name} must not depend on application package ${depName}`
        );
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(name: string, stack: string[]): void {
    if (visited.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      errors.push(
        `Circular workspace dependency: ${[...stack, name].join(" -> ")}`
      );
      return;
    }

    visiting.add(name);
    const pkg = byName.get(name);
    if (pkg) {
      for (const depName of Object.keys(pkg.deps)) {
        if (byName.has(depName)) {
          visit(depName, [...stack, name]);
        }
      }
    }
    visiting.delete(name);
    visited.add(name);
  }

  for (const pkg of packages) {
    visit(pkg.name, []);
  }
}

function checkUiExports(): void {
  const uiPkgPath = join(root, "packages/ui/package.json");
  const pkg = readJson(uiPkgPath);
  const exports = asStringRecord(pkg.exports);

  if (Object.keys(exports).length === 0) {
    errors.push("packages/ui/package.json is missing exports");
    return;
  }

  for (const [key, value] of Object.entries(exports)) {
    if (value.includes("*")) {
      const patternDir = dirname(value.replace("./", ""));
      const absoluteDir = join(root, "packages/ui", patternDir);
      if (!existsSync(absoluteDir)) {
        errors.push(
          `packages/ui export ${key} points to missing directory ${patternDir}`
        );
      }
      continue;
    }

    const absolute = join(root, "packages/ui", value.replace("./", ""));
    if (!existsSync(absolute)) {
      errors.push(`packages/ui export ${key} points to missing file ${value}`);
    }
  }
}

function checkComponentsJson(): void {
  const configs = [
    join(root, "apps/web/components.json"),
    join(root, "packages/ui/components.json"),
  ];

  for (const path of configs) {
    if (!existsSync(path)) {
      errors.push(`Missing ${relative(root, path)}`);
      continue;
    }

    const config = readJson(path);
    if (config.style !== "base-nova") {
      errors.push(`${relative(root, path)} must use style base-nova`);
    }
    if (config.iconLibrary !== "hugeicons") {
      errors.push(`${relative(root, path)} must use iconLibrary hugeicons`);
    }

    const aliases = asStringRecord(config.aliases);
    if (aliases.ui !== "@workspace/ui/components") {
      errors.push(
        `${relative(root, path)} ui alias must be @workspace/ui/components`
      );
    }
  }
}

function checkMarkdownLinks(): void {
  const files = [
    join(root, "README.md"),
    join(root, "AGENTS.md"),
    ...listMarkdownFiles(join(root, "docs")),
  ];

  const linkPattern = /\[(?<text>[^\]]+)\]\((?<href>[^)]+)\)/gu;

  for (const file of files) {
    if (!existsSync(file)) {
      continue;
    }

    const content = readFileSync(file, "utf-8");
    for (const match of content.matchAll(linkPattern)) {
      const href = match.groups?.href;
      if (
        href === undefined ||
        href === "" ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:")
      ) {
        continue;
      }

      const [pathPart] = href.split("#");
      if (pathPart === undefined || pathPart === "") {
        continue;
      }

      const target = resolve(dirname(file), pathPart);
      if (!existsSync(target)) {
        errors.push(
          `${relative(root, file)} links to missing path ${pathPart}`
        );
      }
    }
  }
}

function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      files.push(...listMarkdownFiles(path));
    } else if (entry.endsWith(".md")) {
      files.push(path);
    }
  }
  return files;
}

checkRadixDependencies();
checkWorkspaceGraph();
checkUiExports();
checkComponentsJson();
checkMarkdownLinks();

if (errors.length > 0) {
  console.error("Boundary checks failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Boundary checks passed.");
