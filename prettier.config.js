/** @type {import("prettier").Config} */
const prettierConfig = {
	// Basic formatting
	printWidth: 80,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: false,
	quoteProps: "as-needed",

	// JSX formatting
	jsxSingleQuote: false,
	bracketSameLine: false,

	// Trailing commas
	trailingComma: "es5",

	// Spacing
	bracketSpacing: true,
	arrowParens: "always",

	// Line endings
	endOfLine: "lf",

	// Tailwind plugin
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["cn", "clsx"],
};

export default prettierConfig;
