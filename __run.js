import { walk } from "estree-walker";
import { AtRule } from "postcss";
import { addImport, findImport, getConfigExpression, setDefault, setPropertyValue } from "../../ast-tools.js";
import { extension, postcssConfigCjsPath, stylesHint } from "../postcss/stuff.js";
import { tailwindConfigCjsPath } from "./stuff.js";

/**
 * @param {import("../../ast-io.js").RecastAST} postcssConfigAst
 * @returns {import("../../ast-io.js").RecastAST}
 */
const updatePostcssConfig = (postcssConfigAst) => {
	const configObject = getConfigExpression({
		cjs: true,
		typeScriptEstree: postcssConfigAst,
	});

	if (configObject.type !== "ObjectExpression") throw new Error("PostCSS config must be an object");

	const pluginsList = setDefault({
		default: {
			type: "ArrayExpression",
			elements: [],
		},
		object: configObject,
		property: "plugins",
	});

	if (pluginsList.type !== "ArrayExpression") throw new Error("`plugins` in PostCSS config needs to be an array");

	const goAfter = ["tailwindcss/nesting", "postcss-nested", "postcss-import"];
	let minIndex = 0;

	const goBefore = ["autoprefixer", "cssnano"];
	let maxIndex = pluginsList.elements.length;

	// Find `tailwindcss` import or add it if it's not there
	let tailwindcssImportedAs = findImport({ cjs: true, package: "tailwindcss", typeScriptEstree: postcssConfigAst }).require;
	if (!tailwindcssImportedAs) {
		tailwindcssImportedAs = "tailwindcss";
		addImport({ cjs: true, package: "tailwindcss", require: tailwindcssImportedAs, typeScriptEstree: postcssConfigAst });
	}

	/** @type {Record<string, string>} Identifier name -> imported package */
	const imports = {};
	walk(postcssConfigAst, {
		enter(node) {
			if (node.type !== "VariableDeclarator") return;

			const declarator = /** @type {import("estree").VariableDeclarator} */ (node);

			if (declarator.id.type !== "Identifier") return;
			const identifier = declarator.id;

			if (!declarator.init) return;
			if (declarator.init.type !== "CallExpression") return;
			const callExpression = declarator.init;

			if (callExpression.callee.type !== "Identifier") return;

			if (callExpression.callee.name !== "require") return;

			if (callExpression.arguments[0].type !== "Literal") return;
			const requireArgValue = callExpression.arguments[0].value;

			if (typeof requireArgValue !== "string") return;
			imports[identifier.name] = requireArgValue;
		},
	});

	for (const [index, plugin] of pluginsList.elements.entries()) {
		if (!plugin) continue;

		/** @type {string | undefined} */
		let determinedPlugin;

		if (plugin.type === "CallExpression") {
			if (plugin.callee.type === "Identifier") {
				determinedPlugin = imports[plugin.callee.name];
			}
		} else if (plugin.type === "Identifier") {
			determinedPlugin = imports[plugin.name];
		}
		// TODO: detect conditional plugins (e.x. !dev && cssnano())

		if (!determinedPlugin) continue;

		if (goAfter.includes(determinedPlugin)) {
			if (index > minIndex) minIndex = index;
		} else if (goBefore.includes(determinedPlugin)) {
			if (index < maxIndex) maxIndex = index;
		}
	}

	if (minIndex > maxIndex) throw new Error("cannot find place to slot `tailwindcss()` as a plugin in the PostCSS config");

	// We have a range of acceptable values
	// Let's use the latest slot because it's probably the most likely to work correctly
	pluginsList.elements.splice(maxIndex, 0, {
		// @ts-expect-error - Force accept the comment - TODO: find a better way to handle this
		type: "Line",
		// @ts-expect-error - Force accept the comment
		value: `Some plugins, like ${goAfter[0]}, need to run before Tailwind`,
	});

	pluginsList.elements.splice(
		maxIndex + 1,
		0,
		/** @type {import("estree").CallExpression} */ {
			type: "CallExpression",
			// @ts-ignore - I am not sure why this is typed wrongly (?)
			arguments: [],
			callee: {
				type: "Identifier",
				name: tailwindcssImportedAs,
			},
			optional: false,
		}
	);

	pluginsList.elements.splice(maxIndex + 2, 0, {
		// @ts-expect-error - Force accept the comment
		type: "Line",
		// @ts-expect-error - Force accept the comment
		value: `But others, like ${goBefore[0]}, need to run after`,
	});

	return postcssConfigAst;
};

/**
 * @param {import("../../ast-io.js").RecastAST} tailwindConfigAst
 * @param {boolean} tailwind3
 * @returns {import("../../ast-io.js").RecastAST}
 */
const updateTailwindConfig = (tailwindConfigAst, tailwind3) => {
	const configObject = getConfigExpression({
		cjs: true,
		typeScriptEstree: tailwindConfigAst,
	});

	if (configObject.type !== "ObjectExpression") throw new Error("Tailwind config must be an object");

	if (!tailwind3) {
		setPropertyValue({
			object: configObject,
			property: "mode",
			value: {
				type: "Literal",
				value: "jit",
			},
		});
	}

	/** @type {import("estree").ArrayExpression} */
	const content = {
		type: "ArrayExpression",
		elements: [
			{
				type: "Literal",
				value: "./src/**/*.{html,js,svelte,ts}",
			},
		],
	};
	setDefault({
		default: content,
		object: configObject,
		property: tailwind3 ? "content" : "purge",
	});

	/** @type {import("estree").ObjectExpression} */
	const emptyTheme = {
		type: "ObjectExpression",
		properties: [],
	};
	const themeConfig = setDefault({
		default: emptyTheme,
		object: configObject,
		property: "theme",
	});
	if (themeConfig.type !== "ObjectExpression") throw new Error("`theme` in Tailwind config must be an object");

	/** @type {import("estree").ObjectExpression} */
	const emptyThemeExtend = {
		type: "ObjectExpression",
		properties: [],
	};
	setDefault({
		default: emptyThemeExtend,
		object: themeConfig,
		property: "extend",
	});

	/** @type {import("estree").ArrayExpression} */
	const emptyPlugins = {
		type: "ArrayExpression",
		elements: [],
	};
	setDefault({
		default: emptyPlugins,
		object: configObject,
		property: "plugins",
	});

	return tailwindConfigAst;
};

/**
 *
 * @param {import("../../ast-io.js").PostCSSAst} postcss
 * @returns {import("../../ast-io.js").PostCSSAst}
 */
const updateGlobalStylesheet = (postcss) => {
	const base = new AtRule({
		name: "tailwind",
		params: "base",
	});

	const components = new AtRule({
		name: "tailwind",
		params: "components",
	});

	const utilities = new AtRule({
		name: "tailwind",
		params: "utilities",
	});

	postcss.append(components);
	postcss.append(utilities);

	const imports = postcss.nodes.filter((node) => node.type === "atrule" && node.name === "import");
	const lastImport = imports[imports.length - 1];

	if (lastImport) {
		lastImport.after(base);
	} else {
		const [stylesHintComment] = postcss.nodes.filter((node) => node.type === "comment" && node.text === stylesHint);

		if (stylesHintComment) {
			stylesHintComment.after(base);
		} else {
			postcss.prepend(base);
		}
	}

	return postcss;
};

/** @type {import("../../index.js").AdderRun<import("./__metadata.js").Options>} */
export const run = async ({ install, options, updateCss, updateJavaScript }) => {
	await updateJavaScript({
		path: tailwindConfigCjsPath,
		async script({ typeScriptEstree }) {
			return {
				typeScriptEstree: updateTailwindConfig(typeScriptEstree, options.v3),
			};
		},
	});

	await updateJavaScript({
		path: postcssConfigCjsPath,
		async script({ typeScriptEstree }) {
			return {
				typeScriptEstree: updatePostcssConfig(typeScriptEstree),
			};
		},
	});

	await updateCss({
		path: `/src/app.${extension}`,
		async style({ postcss }) {
			return {
				postcss: updateGlobalStylesheet(postcss),
			};
		},
	});

	await install({ package: "tailwindcss", versionOverride: options.v3 ? "next" : undefined });
};
