import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { ComponentDemo } from "@/components/component-demo";
import { ThemeToggle } from "@/components/theme-toggle";

const docs = [
  {
    href: "https://ui.shadcn.com/docs/monorepo",
    label: "shadcn monorepo",
  },
  {
    href: "https://base-ui.com/react/overview/quick-start",
    label: "Base UI",
  },
  {
    href: "https://nextjs.org/docs",
    label: "Next.js",
  },
  {
    href: "https://turbo.build/repo/docs",
    label: "Turborepo",
  },
] as const;

const Page = () => (
  <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 p-6 md:p-10">
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">TypeScript monorepo</p>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Next.js starter template
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          A minimal Bun + Turborepo foundation with a shared Base UI design
          system, strict TypeScript, and agent-friendly verification.
        </p>
      </div>
      <ThemeToggle />
    </header>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Shared UI</CardTitle>
          <CardDescription>
            Components live in{" "}
            <code className="font-mono text-xs">packages/ui</code> and import as{" "}
            <code className="font-mono text-xs">
              @workspace/ui/components/*
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentDemo />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Add components with{" "}
            <code className="font-mono">
              bunx shadcn@latest add &lt;name&gt; -c apps/web
            </code>
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>
            Start from the README and{" "}
            <code className="font-mono text-xs">AGENTS.md</code> for stack
            details and agent workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {docs.map((item) => (
              <li key={item.href}>
                <a
                  className="text-primary text-sm underline-offset-4 hover:underline"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default Page;
