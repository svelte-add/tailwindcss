export const name = "Tailwind CSS";

/** @typedef {{ v3: boolean, forms: boolean, typography: boolean }} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {
	v3: {
		context: "It is currently in alpha.",
		default: false,
		question: "Do you want to use Tailwind 3?",
	},
	forms: {
		context: "https://github.com/tailwindlabs/tailwindcss-forms",
		default: false,
		question: "Do you want to install the Tailwind CSS Forms plugin?",
	},
	typography: {
		context: "https://github.com/tailwindlabs/tailwindcss-typography",
		default: false,
		question: "Do you want to install the Tailwind CSS Typography plugin?",
	},
};
