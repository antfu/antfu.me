---
title: Types for Submodules
date: 2021-02-29T16:00:00Z
lang: en
duration: 5min
type: note
---

When you build multiple entries in a single package, you exports them with `exports` syntax. Like

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./foo": {
      "types": "./dist/foo.d.ts",
      "import": "./dist/foo.mjs",
      "require": "./dist/foo.cjs"
    }
  }
}
```

Then tho you provide `types` field for the sub modules, most of the users still got the error:

```txt
Cannot find module 'my-pkg/foo' or its corresponding type declarations.
```

Well that's because the `types` field in `exports` will only be resolved when you add `"moduleResolution": "NodeNext"` to the `tsconfig.json` file. Which might cause more issue since not all the packages are up to date.

So when you trying to import `my-pkg/foo`, TypeScript actually looking for the `foo.d.ts` file under your package root instead of your `dist` folder. One solution I been used for a long time is to create a redirection file that published to npm, like:

```ts
// foo.d.ts
export { default } from './dist/foo.d.ts'
export * from './dist/foo.d.ts'
```

Which solve the problem, but also making your root directory quite messy.

Until [@tmkx](https://github.com/tmkx) [shared me](https://github.com/antfu/unplugin-auto-import/pull/120) this solution:

```json
{
  "typesVersions": {
    "*": {
      "*": [
        "./dist/index.d.ts",
        "./dist/*"
      ]
    }
  }
}
```

Good day! [Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions)
