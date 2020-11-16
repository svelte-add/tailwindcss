<h1 align="center">💨 Add Tailwind CSS to Svelte</h1>

## ❓ What is this?
This is an **experimental** command to run to add Tailwind CSS to your Svelte project generated with `create-svelte`.

## 🛠 Usage
You must start with a fresh copy of the official `create-svelte` template, which is currently created by running this command:
```sh
npm init svelte@next
# By the way, please listen to its warnings that SvelteKit is an alpha project
# https://svelte.dev/blog/whats-the-deal-with-sveltekit#When_can_I_start_using_it
```

Once that is set up, run this command in your project directory to set up Tailwind CSS:
```sh
npx use-preset babichjacob/svelte-add-tailwindcss  
```

After the preset runs,
* You can use Tailwind utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).
* You can write PostCSS syntax in the `style` blocks in Svelte files.
    * You can use Tailwind directives like `@apply` and `@screen` or use the `theme` function.

* You can write PostCSS syntax in the `src/routes/_global.pcss` file.
  
  This is your global stylesheet because it will be active on every page of your site.

* Your Tailwind CSS will be purged for production builds.
* All your CSS will be minified for production.

## 😵 Help! I have a question
[Create an issue](https://github.com/babichjacob/svelte-add-tailwindcss/issues/new) and I'll try to help.

## 😡 Fix! There is something that needs improvement
[Create an issue](https://github.com/babichjacob/svelte-add-tailwindcss/issues/new) or [pull request](https://github.com/babichjacob/svelte-add-tailwindcss/pulls) and I'll try to fix.

These are new tools, so there are likely to be problems in this project. Thank you for bringing them to my attention or fixing them for me.

## 📄 License
MIT

---

*Repository preview image generated with [GitHub Social Preview](https://social-preview.pqt.dev/)*

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
