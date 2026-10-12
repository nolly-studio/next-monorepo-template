"use client";

import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label="Toggle theme"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
            size="icon"
            variant="outline"
          />
        }
      >
        <HugeiconsIcon
          className="dark:hidden"
          icon={Sun02Icon}
          strokeWidth={2}
        />
        <HugeiconsIcon
          className="hidden dark:block"
          icon={Moon02Icon}
          strokeWidth={2}
        />
      </TooltipTrigger>
      <TooltipContent>Toggle theme (or press d)</TooltipContent>
    </Tooltip>
  );
};
