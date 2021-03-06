<h1 align="center">💨 Add Tailwind CSS to Svelte</h1>

## ❓ What is this?
This is an **experimental** command to run to add Tailwind CSS to your SvelteKit project.

## 🛠 Usage
You must start with a fresh copy of the official SvelteKit template, which is currently created by running this command:
```sh
npm init svelte@next
```

Since Tailwind CSS is a PostCSS plugin, run this command in your project directory to [set up PostCSS for Svelte](https://github.com/svelte-add/postcss):
```sh
npx apply svelte-add/postcss # --no-ssh
```

Finally, run this command in your project directory to set up Tailwind CSS:
```sh
npx apply svelte-add/tailwindcss # --no-ssh
```

After the preset runs,
* You can use Tailwind utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).

* You can use [Tailwind directives like `@apply` and `@screen` or use the `theme` function](https://tailwindcss.com/docs/functions-and-directives) in Svelte `style` blocks or the `src/global.css` file.

* Your Tailwind CSS will be purged for production builds.

* You can apply *another* [Svelte Adder](https://github.com/svelte-add/svelte-adders) to your project for more functionality.

## 😵 Help! I have a question
[Create an issue](https://github.com/svelte-add/tailwindcss/issues/new) and I'll try to help.

## 😡 Fix! There is something that needs improvement
[Create an issue](https://github.com/svelte-add/tailwindcss/issues/new) or [pull request](https://github.com/svelte-add/tailwindcss/pulls) and I'll try to fix.

These are new tools, so there are likely to be problems in this project. Thank you for bringing them to my attention or fixing them for me.

## 📄 License
MIT

---

*Repository preview image generated with [GitHub Social Preview](https://social-preview.pqt.dev/)*

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
