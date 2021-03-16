import { Preset, color } from "apply";

const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

const addTailwind = (otherPlugins) => `plugins: [
		// Some plugins, like postcss-nested, need to run before Tailwind
		
		tailwindcss,
		
		// But others, like autoprefixer, need to run after

		${otherPlugins}]`;


Preset.setName("svelte-add/tailwindcss");

const JIT = "jit";
Preset.option(JIT, false);

const VITE = "vite";
const SNOWPACK = "snowpack";
const BUILD_TOOL = "buildTool";
Preset.option(BUILD_TOOL, VITE);

const NEEDS_POSTCSS = "needsPostcss";
Preset.hook((preset) => { preset.context[NEEDS_POSTCSS] = true }).withoutTitle();
Preset.edit(["postcss.config.cjs"]).update((match, preset) => {
	preset.context[NEEDS_POSTCSS] = false;
	return match;
}).withoutTitle();
Preset.apply("svelte-add/postcss").with((preset) => [...preset.args, "--build-tool", preset.options[BUILD_TOOL], "--no-ssh"]).if((preset) => preset.context[NEEDS_POSTCSS]).withTitle("Adding PostCSS because it's missing from this project");

Preset.extract().withTitle("Adding Tailwind CSS config file");

Preset.group((preset) => {
	preset.editJson("package.json").merge({
		devDependencies: {
			"tailwindcss": "^2.0.3",
		},
	});

	preset.editJson("package.json").merge({
		devDependencies: {
			"@tailwindcss/jit": "^0.1.1",
		},
	}).ifOption(JIT);
}).withTitle("Adding needed dependencies");

Preset.edit(["postcss.config.cjs"]).update((match, preset) => {
	let result = match;
	const tailwindcss = preset.options[JIT] ? "@tailwindcss/jit" : "tailwindcss";
	result = `const tailwindcss = require("${tailwindcss}");\n${result}`;
	
	const matchPlugins = /plugins:[\s\r\n]\[[\s\r\n]*((?:.|\r?\n)+)[\s\r\n]*\]/m;
	result = result.replace(matchPlugins, (_match, otherPlugins) => addTailwind(otherPlugins));
	
	return result;
}).withTitle("Adding Tailwind CSS as a PostCSS plugin");

Preset.group((preset) => {
	const MARKER = "/* Write your global styles here, in PostCSS syntax */";

	const replacer = (match) => match.replace(MARKER, `${MARKER}\n${globalCSS}`);

	preset.edit(["src/routes/_global.pcss"]).update(replacer).ifOptionEquals(BUILD_TOOL, SNOWPACK);
	preset.edit(["src/global.css"]).update(replacer).ifOptionEquals(BUILD_TOOL, VITE);
}).withTitle("Adding Tailwind directives to the global PostCSS stylesheet");

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

Preset.instruct(`Run ${color.magenta("npm install")}, ${color.magenta("pnpm install")}, or ${color.magenta("yarn")} to install dependencies`);
