import { Preset } from "apply";

const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

const addTailwind = (otherPlugins) => `plugins: [
		// Some plugins, like postcss-nested, need to run before Tailwind
		
		tailwindcss(),
		
		// But others, like autoprefixer, need to run after

		${otherPlugins}]`;


Preset.setName("svelte-add/tailwindcss");

Preset.extract().withTitle("Adding Tailwind CSS config file");

Preset.editJson("package.json").merge({
	devDependencies: {
		"tailwindcss": "^2.0.2",
	},
}).withTitle("Adding needed dependencies");

Preset.edit(["postcss.config.js"]).update((match) => {
	let result = match;
	result = `const tailwindcss = require` + `("tailwindcss");\n${result}`;
	
	const matchPlugins = /plugins:[\s\n]\[[\s\n]*((?:.|\n)+)[\s\n]*\]/m;
	result = result.replace(matchPlugins, (_match, otherPlugins) => addTailwind(otherPlugins));
	
	return result;
}).withTitle("Adding Tailwind CSS as a PostCSS plugin");

Preset.edit(["src/routes/_global.pcss"]).update((match) => {
	const marker = "/* Write your global styles here, in PostCSS syntax */";
	return match.replace(marker, `${marker}\n${globalCSS}`);
}).withTitle("Adding Tailwind directives to the global PostCSS file");

Preset.edit(["src/routes/index.svelte"]).update((match) => {
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
}).withTitle("Making src/routes/index.svelte use Tailwind's @apply as an example");

Preset.edit(["src/components/Counter.svelte"]).update((match) => {
	let result = match;
	result = result.replace(`padding: 1em 2em`, `/* Tailwind's creator recommends against @apply.\n\t\tThis is all just proof that it works in your Svelte style blocks. */\n\t\t@apply py-4 px-8`);
	result = result.replace(`color: #ff3e00`, `@apply text-red-500`);
	result = result.replace(`background-color: rgba(255, 62, 0, 0.1)`, `@apply bg-red-500 bg-opacity-10`);
	result = result.replace(`border-radius: 2em`, `@apply rounded-full`);
	result = result.replace(`border: 2px solid rgba(255, 62, 0, 0)`, `@apply border-2 border-transparent`);
	result = result.replace(`outline: none`, `@apply outline-none`);
	result = result.replace(`width: 200px`, `@apply w-48`);

	result = result.replace(`border: 2px solid #ff3e00`, `@apply border-opacity-100`);

	result = result.replace(`background-color: rgba(255, 62, 0, 0.2)`, `@apply bg-red-500 bg-opacity-20`);

	return result;
}).withTitle("Making src/components/Counter.svelte use Tailwind's @apply as an example");

Preset.installDependencies().ifUserApproves();
