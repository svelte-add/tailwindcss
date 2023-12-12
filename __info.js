import { extension } from "../postcss/stuff.js";
import { prettierConfigPath } from "./stuff.js";

export const name = "Tailwind CSS";

export const emoji = "💨";

export const usageMarkdown = ["You can use Tailwind utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).", 'You can use [Tailwind directives like `@apply` and `@screen` or use the `theme` function](https://tailwindcss.com/docs/functions-and-directives) in Svelte `style lang="postcss"` blocks or the `src/app.pcss` file.', "You can [configure Tailwind](https://tailwindcss.com/docs/configuration) in the `tailwind.config.cjs` file.", "Your Tailwind CSS will be purged for production builds."];

/** @type {import("../..").Gatekeep} */
export const gatekeep = async () => {
	return { able: true };
};

/** @typedef {{ forms: boolean, typography: boolean, daisyui: boolean }} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {
	forms: {
		context: "https://github.com/tailwindlabs/tailwindcss-forms",
		default: false,
		descriptionMarkdown: "whether or not to install and set up the [Tailwind CSS Forms plugin](https://github.com/tailwindlabs/tailwindcss-forms).",
		question: "Do you want to use the Tailwind CSS Forms plugin?",
	},
	typography: {
		context: "https://github.com/tailwindlabs/tailwindcss-typography",
		default: false,
		descriptionMarkdown: "whether or not to install and set up the [Tailwind CSS Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography).",
		question: "Do you want to use the Tailwind CSS Typography plugin?",
	},
	daisyui: {
		context: "It provides component classes for Tailwind CSS. https://daisyui.com/",
		default: false,
		descriptionMarkdown: "whether or not to install and set up [daisyUI](https://github.com/saadeghi/daisyui) as a Tailwind plugin.",
		question: "Do you want to use daisyUI?",
	},
};

/** @type {import("../..").Heuristic[]} */
export const heuristics = [
	{
		description: "`tailwindcss` is installed",
		async detector({ folderInfo }) {
			return "tailwindcss" in folderInfo.allDependencies;
		},
	},
	{
		description: "`postcss.config.cjs` has `tailwindcss` as a plugin",
		async detector({ readFile }) {
			const { text } = await readFile({ path: "/postcss.config.cjs" });
			return text.includes("tailwindcss");
		},
	},
	{
		description: "`tailwind.config.cjs` exists and `tailwind.config.js` does not exist",
		async detector({ readFile }) {
			const cjs = await readFile({ path: "/tailwind.config.cjs" });
			const js = await readFile({ path: "/tailwind.config.js" });

			return cjs.exists && !js.exists;
		},
	},
	{
		description: `\`@tailwind\` directives are used in \`src/app.${extension}\``,
		async detector({ readFile }) {
			const { text } = await readFile({ path: `/src/app.${extension}` });
			if (!text.includes("@tailwind base")) return false;
			if (!text.includes("@tailwind components")) return false;
			if (!text.includes("@tailwind utilities")) return false;

			return true;
		},
	},
	{
		description: "prettier is configured (if installed)",
		async detector({ folderInfo, readFile }) {
			// skip if prettier is not installed
			const isInstalled = "prettier" in folderInfo.allDependencies;
			if (!isInstalled) return true;

			// check plugins
			const tailwindPlugin = "prettier-plugin-tailwindcss" in folderInfo.allDependencies;
			if (!tailwindPlugin) return false;

			const prettierConfig = await readFile({ path: prettierConfigPath });
			if (!prettierConfig) return false;

			const { text } = prettierConfig;
			const { plugins } = JSON.parse(text);
			return plugins.includes("prettier-plugin-tailwindcss");
		},
	},
];
