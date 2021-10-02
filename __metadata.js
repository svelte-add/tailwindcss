export const name = "Tailwind CSS";

/** @typedef {{ v3: boolean }} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {
	v3: {
		context: "It is currently in alpha.",
		default: false,
		question: "Do you want to use Tailwind 3?",
	},
};
