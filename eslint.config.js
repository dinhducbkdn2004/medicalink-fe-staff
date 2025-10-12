import { fixupPluginRules } from "@eslint/compat";
import eslintJS from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import typescriptEslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

const patchedReactHooksPlugin = fixupPluginRules(eslintPluginReactHooks);

export default typescriptEslint.config(
	{
		ignores: [
			"dist/**",
			"node_modules/**",
			"*.config.js",
			"*.config.ts",
			"vite.config.ts",
			"commitlint.config.cjs",
			"prettier.config.js",
		],
	},

	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2024,
				sourceType: "module",
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.browser,
				...globals.es2024,
			},
		},
		extends: [
			eslintJS.configs.recommended,
			...typescriptEslint.configs.recommended,
			eslintPluginReact.configs.flat["jsx-runtime"],
		],
		plugins: {
			"react-hooks": patchedReactHooksPlugin,
			"unused-imports": unusedImports,
		},
		rules: {
			/* --- Clean code --- */
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "error",

			/* --- Unused import & vars --- */
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",

			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			/* --- React --- */
			"react/react-in-jsx-scope": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",

			/* --- TypeScript --- */
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/ban-ts-comment": "warn",
		},
	},

	eslintConfigPrettier
);
