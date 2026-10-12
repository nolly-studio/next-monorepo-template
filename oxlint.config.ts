import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import shadcn from "ultracite/oxlint/shadcn";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, vitest, shadcn, antiSlop],
  ignorePatterns: [...(core.ignorePatterns ?? []), "scripts/fixtures/**"],
  jsPlugins: shadcn.jsPlugins,
  options: { typeAware: true },
  overrides: [
    {
      files: ["packages/ui/src/components/**/*.{ts,tsx}"],
      rules: {
        "eslint/func-style": "off",
        "eslint/no-use-before-define": "off",
        "eslint/sort-keys": "off",
        "import/consistent-type-specifier-style": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "react/function-component-definition": "off",
        "shadcn/no-arbitrary-values": "off",
        "shadcn/no-restyle": "off",
        "shadcn/require-static-classes": "off",
      },
    },
    {
      files: ["scripts/**/*.{ts,mts}"],
      rules: {
        "anti-slop/no-known-value-widening": "off",
        "anti-slop/no-runtime-typeof": "off",
        "anti-slop/no-unknown-parameters": "off",
        "anti-slop/no-unsafe-dictionary-type": "off",
        "eslint/func-style": "off",
        "eslint/no-use-before-define": "off",
        "eslint/prefer-named-capture-group": "off",
        "unicorn/import-style": "off",
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@radix-ui/*", "@radix-ui/react-*"],
                message:
                  "Use Base UI (@base-ui/react) instead of Radix UI primitives.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["packages/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@radix-ui/*", "@radix-ui/react-*"],
                message:
                  "Use Base UI (@base-ui/react) instead of Radix UI primitives.",
              },
              {
                group: ["**/apps/**", "web", "web/*"],
                message:
                  "Shared packages must not import application code from apps/.",
              },
            ],
          },
        ],
      },
    },
  ],
});
