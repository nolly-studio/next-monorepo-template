import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";

import "@workspace/ui/globals.css";

export const metadata: Metadata = {
  description:
    "A production-ready TypeScript monorepo starter with Next.js, shadcn/ui Base UI, and Ultracite.",
  title: {
    default: "Next.js Monorepo Starter",
    template: "%s · Next.js Monorepo Starter",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html
    className={cn(
      "font-sans antialiased",
      GeistSans.variable,
      GeistMono.variable
    )}
    lang="en"
    suppressHydrationWarning
  >
    <body>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
