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
];
