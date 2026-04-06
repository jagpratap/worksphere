import antfu from "@antfu/eslint-config";

export default antfu({
  react: true,
  typescript: true,
  formatters: true,
  markdown: false,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
}, {
  files: ["**/*.{js,jsx,ts,tsx}"],
  rules: {
    // Enforce type over interface
    "ts/consistent-type-definitions": ["error", "type"],

    // No any — strict type safety
    "@typescript-eslint/no-explicit-any": "error",

    // Allow const + type same-name pattern (e.g., ROLES const + Role type)
    "ts/no-redeclare": ["error", { ignoreDeclarationMerge: true }],

    // Catch dead code early — prefix unused with _ to keep intentionally
    "ts/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],

    // Warn on console — remove before production, keep during dev
    "no-console": "warn",

    // Allow top-level await (MSW init in main.tsx)
    "antfu/no-top-level-await": "off",

    // Keep code complexity in check
    "max-depth": ["warn", 4],
    "complexity": ["warn", 15],

    // Import sorting — natural order with newline separation
    "perfectionist/sort-imports": ["error", {
      type: "natural",
      order: "asc",
      newlinesBetween: 1,
      newlinesInside: 0,
      partitionByNewLine: false,
    }],
  },
}, {
  // React components and JSX files — PascalCase
  files: ["src/**/*.{jsx,tsx}"],
  ignores: [
    "src/main.tsx",
    "src/vite-env.d.ts",
    "src/components/ui/**/*.tsx",
  ],
  rules: {
    "unicorn/filename-case": ["error", {
      case: "pascalCase",
    }],

    // Vite React Fast Refresh — components-only exports from tsx files
    "react-refresh/only-export-components": ["warn", {
      allowConstantExport: true,
    }],
  },
}, {
  // Non-component files — kebab-case
  files: ["src/**/*.{js,ts}"],
  rules: {
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
    }],
  },
});
