module.exports = {
	// TypeScript và React files
	"src/**/*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],

	// JavaScript files
	"src/**/*.{js,jsx}": ["prettier --write"],

	// JSON, CSS, Markdown files
	"src/**/*.{json,css,md}": ["prettier --write"],
};
