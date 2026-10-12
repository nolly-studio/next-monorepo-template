import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe(cn, () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    const hidden = false;
    expect(cn("text-sm", hidden && "hidden", undefined, "font-medium")).toBe(
      "text-sm font-medium"
    );
  });
});
