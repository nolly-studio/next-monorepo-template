import { describe, expect, it } from "vitest";

import { buttonVariants } from "./button";

describe(buttonVariants, () => {
  it("includes the default variant classes", () => {
    expect(buttonVariants()).toContain("bg-primary");
  });

  it("applies the outline variant", () => {
    expect(buttonVariants({ variant: "outline" })).toContain("border-border");
  });

  it("applies the icon size", () => {
    expect(buttonVariants({ size: "icon" })).toContain("size-8");
  });
});
