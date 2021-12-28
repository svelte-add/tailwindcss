export const name = "Tailwind CSS";

/** @typedef {{ forms: boolean, typography: boolean }} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {
	forms: {
		context: "https://github.com/tailwindlabs/tailwindcss-forms",
		default: false,
		question: "Do you want to use the Tailwind CSS Forms plugin?",
	},
	typography: {
		context: "https://github.com/tailwindlabs/tailwindcss-typography",
		default: false,
		question: "Do you want to use the Tailwind CSS Typography plugin?",
	},
};
