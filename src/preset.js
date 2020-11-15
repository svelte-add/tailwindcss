const { Preset } = require("use-preset");

module.exports = Preset.make("svelte-add-tailwindcss")
	.copyTemplates("ask")
	.editJson("package.json")
		.merge({
			devDependencies: {
				"@snowpack/plugin-build-script": "^2.0.11",
				"cssnano": "^4.1.10",
				"postcss": "^8.1.7",
				"postcss-load-config": "^3.0.0",
				"postcss-cli": "^8.2.0",
				// https://github.com/babichjacob/svelte-add-tailwindcss/issues/1
				"snowpack": "2.17.0",
				"svelte-preprocess": "^4.5.2",
				"tailwindcss": "^2.0.0-alpha.20",
			},
			// https://github.com/babichjacob/svelte-add-tailwindcss/issues/1
			resolutions: {
				"snowpack": "2.17.0",
			}
		})
		.chain()
	.edit(["svelte.config.js"])
		.replace(/^(.+)$/s)
		.with({
			replacer: (match) => {
				let result = match;

				if (match.includes("preprocess:")) {
					result = result.replace("preprocess: sveltePreprocess()", `preprocess: [ sveltePreprocess({ defaults: { style: "postcss" }, postcss: true }) ]`)
				} else {
					result = `const sveltePreprocess = require` + `("svelte-preprocess");\n${result}`;
					result = result.replace("adapter:", `preprocess: [ sveltePreprocess({ defaults: { style: "postcss" }, postcss: true }) ],\n\tadapter:`);
				}

				return result;
			}
		})
		.chain()
	.edit(["snowpack.config.js"])
		.replace(/^(.+)$/s)
		.with({
			replacer: (match) => {
				let result = match;

				if (match.includes("plugins:")) {
					result = result.replace(`plugins: ['@snowpack/plugin-typescript']`, `plugins: ['@snowpack/plugin-typescript', ["@snowpack/plugin-build-script", { "cmd": "postcss", "input": [".css", ".pcss"], "output": [".css"] }]]`)
				} else {
					result = result.replace("extends:", `plugins: [["@snowpack/plugin-build-script", { "cmd": "postcss", "input": [".css", ".pcss"], "output": [".css"] }]],\n\textends:`);
				}

				return result;
			}
		})
		.chain()
	.edit(["src/routes/index.svelte"])
		.replace(/^(.+)$/s)
		.with({
			replacer: (match) => {
				let result = match;
				result = result.replace(`<a href`, `<a class="text-blue-600 underline" href`);
				
				result = result.replace(`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`, `/* Tailwind's creator recommends against @apply.\n\t\tThis is all just proof that it works in your Svelte style blocks. */\n\t\t@apply font-sans`);
				
				result = result.replace(`text-align: center`, `@apply text-center`);
				result = result.replace(`padding: 1em`, `@apply p-4`);
				result = result.replace(`margin: 0 auto`, `@apply mx-auto`);
				
				result = result.replace(`color: #ff3e00`, `@apply text-red-600`);
				result = result.replace(`text-transform: uppercase`, `@apply uppercase`);
				result = result.replace(`font-size: 4rem`, `@apply text-6xl`);
				result = result.replace(`font-weight: 100`, `@apply font-thin`);
				result = result.replace(`line-height: 1.1`, `@apply leading-tight`);
				result = result.replace(`margin: 4rem auto`, `@apply my-16 mx-auto`);
				result = result.replace(`max-width: 14rem`, `@apply max-w-xs`);
				
				result = result.replace(`max-width: 14rem`, `@apply max-w-xs`);
				result = result.replace(`margin: 2rem auto`, `@apply my-8 mx-auto`);
				result = result.replace(`line-height: 1.35`, `@apply leading-snug`);

				result = result.replace(`@media (min-width: 480px)`, `@screen sm`);
				
				result = result.replace(`max-width: none`, `@apply max-w-none`);

				result = result.replace(`max-width: none`, `@apply max-w-none`);

				return result;
			}	
		})
		.chain()
	.edit(["src/components/Counter.svelte"])
		.replace(/^(.+)$/s)
		.with({
			replacer: (match) => {
				let result = match;
				result = result.replace(`padding: 1em 2em`, `/* Tailwind's creator recommends against @apply.\n\t\tThis is all just proof that it works in your Svelte style blocks. */\n\t\t@apply py-4 px-8`);
				result = result.replace(`color: #ff3e00`, `@apply text-red-500`);
				result = result.replace(`background-color: rgba(255, 62, 0, 0.1)`, `@apply bg-red-500 bg-opacity-10`);
				result = result.replace(`border-radius: 2em`, `@apply rounded-full`);
				result = result.replace(`border: 2px solid rgba(255, 62, 0, 0)`, `@apply border-2 border-transparent`);
				result = result.replace(`outline: none`, `@apply outline-none`);
				result = result.replace(`width: 200px`, `@apply w-48`);
				result = result.replace(`font-variant-numeric: tabular-nums`, `@apply tabular-nums`);

				result = result.replace(`border: 2px solid #ff3e00`, `@apply border-opacity-100`);

				result = result.replace(`background-color: rgba(255, 62, 0, 0.2)`, `@apply bg-opacity-20`);

				return result;
			}	
		})
		.chain()
	.installDependencies()
