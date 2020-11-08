const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");

module.exports = {
	purge: {
		content: ["./src/**/*.html", "./src/**/*.svelte"],
		options: {
			defaultExtractor: (content) => [...tailwindExtractor(content), ...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
			keyframes: true,
		},
	},
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
