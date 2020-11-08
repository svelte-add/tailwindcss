const { Preset } = require("use-preset");

module.exports = Preset.make("svelte-add-tailwindcss")
	.copyTemplates("ask")
	.editJson("package.json")
		.merge({
			devDependencies: {
				"@snowpack/plugin-build-script": "^2.0.11",
				"cssnano": "^4.1.10",
				"postcss": "^8.1.6",
				"postcss-load-config": "^3.0.0",
				"postcss-cli": "^8.2.0",
				"tailwindcss": "^2.0.0-alpha.9",
				"svelte-preprocess": "^4.5.2",
			},
		})
		.chain()
	.edit(["svelte.config.js"])
		.replace(`preprocess: sveltePreprocess()`)
		.with(`preprocess: [ sveltePreprocess({ defaults: { style: "postcss" }, postcss: true }) ]`)
		.chain()
	.edit(["snowpack.config.js"])
		.replace(`plugins: ['@snowpack/plugin-typescript']`)
		.with(`plugins: ['@snowpack/plugin-typescript', ["@snowpack/plugin-build-script", { "cmd": "postcss", "input": [".css", ".pcss"], "output": [".css"] }]]`)
		.chain()
	.edit(["src/routes/index.svelte"])
		.replace(`<a href`)
		.with(`<a class="text-blue-600 underline" href`)
		.chain()
	.edit(["src/routes/index.svelte"])
		.replace(`color: #ff3e00;`)
		.with(`@apply text-red-600;`)
		.chain()
	.installDependencies()
