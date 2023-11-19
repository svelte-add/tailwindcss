<h1 align="center">💨 Add Tailwind CSS to Svelte</h1>

[![GitHub issues by-label](https://img.shields.io/github/issues/svelte-add/svelte-add/confirmed%20bug?color=%23DC2626)](https://github.com/svelte-add/svelte-add/issues?q=is%3Aopen+is%3Aissue+label%3A%22confirmed+bug%22)
[![GitHub issues by-label](https://img.shields.io/github/issues/svelte-add/svelte-add/support%20question?color=%23FACC15)](https://github.com/svelte-add/svelte-add/issues?q=is%3Aopen+is%3Aissue+label%3A%22support+question%22)

This is an adder for `svelte-add`; you should [read its `README`](https://github.com/svelte-add/svelte-add#readme) before continuing here.

## ➕ Adding Tailwind CSS

This adder's codename is `tailwindcss`, and can be used like so:

```sh
npx svelte-add@latest tailwindcss
```

### 🏞 Supported environments

This adder supports SvelteKit and Vite-powered Svelte apps (all the environments `svelte-add` currently supports).

### ⚙️ Options

- `forms` (default `false`): whether or not to install and set up the [Tailwind CSS Forms plugin](https://github.com/tailwindlabs/tailwindcss-forms).

- `typography` (default `false`): whether or not to install and set up the [Tailwind CSS Typography plugin](https://github.com/tailwindlabs/tailwindcss-typography).

- `daisyui` (default `false`): whether or not to install and set up [daisyUI](https://github.com/saadeghi/daisyui) as a Tailwind plugin.

```sh
npx svelte-add@latest tailwindcss --tailwindcss-forms --tailwindcss-typography --tailwindcss-daisyui
```

## 🛠 Using Tailwind CSS

After the adder runs,

- You can use Tailwind utility classes like `bg-blue-700` in the markup (components, routes, `app.html`).

- You can use [Tailwind directives like `@apply` and `@screen` or use the `theme` function](https://tailwindcss.com/docs/functions-and-directives) in Svelte `style lang="postcss"` blocks or the `src/app.pcss` file.

- You can [configure Tailwind](https://tailwindcss.com/docs/configuration) in the `tailwind.config.cjs` file.

- Your Tailwind CSS will be purged for production builds.
