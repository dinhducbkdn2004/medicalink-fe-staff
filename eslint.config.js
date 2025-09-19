import { fixupPluginRules } from "@eslint/compat";
import eslintJS from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

const patchedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks);
const patchedImportPlugin = fixupPluginRules(eslintPluginImport);

const eslintConfig = typescriptEslint.config(
  // Base JS rules
  {
    name: "base",
    extends: [eslintJS.configs.recommended],
    rules: {
      "no-duplicate-imports": "error",
      "no-unused-vars": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // TypeScript rules
  {
    name: "typescript",
    extends: [...typescriptEslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
    },
    plugins: {
      import: patchedImportPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },

  // React rules
  {
    name: "react",
    extends: [eslintPluginReact.configs.flat["jsx-runtime"]],
    plugins: {
      "react-hooks": patchedReactHooksPlugin,
    },
    rules: {
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "warn",
      ...patchedReactHooksPlugin.configs.recommended.rules,
    },
  },

  // Accessibility rules
  {
    name: "jsx-a11y",
    ...jsxA11yPlugin.flatConfigs.recommended,
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
    },
  },

  // API rules (relaxed for API files)
  {
    name: "api",
    files: ["src/api/**/*.ts", "src/api/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },

  // Prettier (disable formatting conflicts)
  eslintConfigPrettier
);

// Apply to source files
eslintConfig.map((config) => {
  config.files = ["src/**/*.ts", "src/**/*.tsx"];
});

export default eslintConfig;
