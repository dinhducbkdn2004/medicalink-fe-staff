import { fixupPluginRules } from "@eslint/compat";
import eslintJS from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

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
				ecmaFeatures: {
					jsx: true,
				},
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
		},
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-unused-vars": "off",
			"no-debugger": "error",

			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/ban-ts-comment": "warn",

			"react/react-in-jsx-scope": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
		},
	},

	eslintConfigPrettier
);
