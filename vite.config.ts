import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		tanstackRouter({}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		strictPort: true,
	},
});
