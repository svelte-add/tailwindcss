
const cssnano = require("cssnano");
const tailwindcss = require("tailwindcss");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
	plugins: [
		tailwindcss(),

		// Plugins for polyfills and the like (such as postcss-preset-env) should generally go here
		// but a few have to run *before* Tailwind

		!dev && cssnano({
			preset: "default",
		}),
	],
};
