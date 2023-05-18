---
title: Ship ESM & CJS in one Package
date: 2021-11-29T16:00:00Z
lang: en
duration: 15min
description: A short tutorial of shipping both ESM and CJS dual formats in a single NPM package.
---

[[toc]]

## ESM & CJS

- ESM - [ECMAScript modules](https://nodejs.org/api/esm.html)
- CJS - [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)

In the past decade, due to the lack of a standard module system of JavaScript, CommonJS (a.k.a the `require('xxx')` and `module.exports` syntax) has been the way how Node.js and NPM packages work. Until 2015, when ECMAScript modules finally show up as the standard solution, the community start migrating to native ESM gradually.

```js
// CJS
const circle = require('./circle.js')

console.log(`The area of a circle of radius 4 is ${circle.area(4)}`)
```

```js
// ESM
import { area } from './circle.mjs'

console.log(`The area of a circle of radius 4 is ${area(4)}`)
```

ESM enables named exports, better static analysis, tree-shaking, browsers native support, and most importantly, as a standard, it's basically the future of JavaScript.

Experimental support of native ESM is introduced in Node.js v12, and stabilized in v12.22.0 and v14.17.0. As the end of 2021, many packages now ship in pure-ESM format, or CJS and ESM dual formats; meta-frameworks like [Nuxt 3](https://github.com/nuxt/framework) and [SvelteKit](https://github.com/sveltejs/kit) are now recommending users to use ESM-first environment.

The overall migration of the ecosystem is still in progress, for most library authors, shipping dual formats is a safer and smoother way to have the goods from both worlds. In the rest of this blog post, I will show you why and how.

## Compatibility

If ESM is the better and the future, why don't we all move to ESM then? Even though Node.js is smart enough to allow CJS and ESM packages to work together, the main blocker is that **you can't use ESM packages in CJS**.

If you do:

```ts
// in CJS
const pkg = require('esm-only-package')
```

you will receive the following error

```bash
Error [ERR_REQUIRE_ESM]: require() of ES Module esm-only-package not supported.
```

The root cause is that ESM is asynchronous by nature, meaning you can't import an async module in synchronous context that `require` is for. This commonly means **if you want to use ESM packages, you have to use ESM as well**. Only one exception is that you can use ESM package in CJS using [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports):

```ts
// in CJS
const { default: pkg } = await import('esm-only-package')
```

Since dynamic import will return a Promise, meaning all the sub-sequential callee need to be async as well (so call [Red Functions](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/), or I prefer call it Async Infection). In some case it might work, but generally I won't think this to be an easy approachable solution for users.

On the other hand, if you are able to go with ESM directly, it would be much easier as `import` supports both ESM and CJS.

```ts
// in ESM
import { named } from 'esm-package'
import cjs from 'cjs-package'
```

Some packages now ship [pure-ESM packages](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) advocating the ecosystem to move from CJS to ESM. While this might be the "right thing to do", however, giving the fact that that majority of the ecosystem are still on CJS and the migration is not that easy, I found myself more lean to ship both CJS and ESM formats to make the transition smoother.

### `package.json`

Luckily, Node allows you to have those two formats in a single package at the same time. With the new [`exports`](https://nodejs.org/api/packages.html#conditional-exports) field in `package.json`, you can now specify multiple entries to provide those formats conditionally. Node will resolve to the version based on user's or downstream packages environment.

```json
{
  "name": "my-cool-package",
  "exports": {
    ".": {
      "require": "./index.cjs", // CJS
      "import": "./index.mjs" // ESM
    }
  }
}
```

## Bundling

So now we have two copies of code with slightly different module syntax to maintain, duplicating them is of course not an ideal solution. At this point you might need to consider introducing some build tools or bundling process to build your code into multiple formats. This might remind you the nightmare of configuring complex Webpack or Rollup, well don't worry, my mission today is to introduce you two awesome tools that make your life so much easier.

- [`tsup`](#tsup)
- [`unbuild`](#unbuild)

### tsup

[`tsup`](https://github.com/egoist/tsup) by [@egoist](https://github.com/egoist) is one of my most used tools. The features zero-config building for TypeScript project. The usage is like:

```bash
$ tsup src/index.ts
```

And then you will have `dist/index.js` file ready for you to publish.

To support dual formats, it's just a flag away:

```bash
$ tsup src/index.ts --format cjs,esm
```

Two files `dist/index.js` and `dist/index.mjs` will be generated with it and you are good to go. Powered by [`esbuild`](https://github.com/evanw/esbuild), `tsup` is not only super easy to use but also incredible fast. I highly recommend to give it a try.

Here is my go-to template of `package.json` using `tsup`:

```json
{
  "name": "my-cool-package",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "watch": "npm run build -- --watch src",
    "prepublishOnly": "npm run build"
  }
}
```


### unbuild

If we say `tsup` is a minimal bundler for TypeScript, [`unbuild`](https://github.com/unjs/unbuild) by the [@unjs org](https://github.com/unjs) is a more generalized, customizable and yet powerful. `unbuild` is being used to bundle Nuxt 3 and it's sub packages.

To use it, we create `build.config.ts` file in the root

```ts
// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index'
  ],
  declaration: true, // generate .d.ts files
})
```

and run the `unbuild` command:

```bash
$ unbuild
```

`unbuild` will generate both ESM and CJS for you by default!

#### Stubbing

This is one of the most incredible things that I have found when I first looked into [Nuxt 3's codebase](https://github.com/nuxt/framework). `unbuild` introduced a new idea called Stubbing. Instead of firing up a watcher to re-trigger the bundling every time you made changes to the source code, the stubbing in `unbuild` (so call Passive watcher) does not require you are have another process for that at all. By calling the following command **only once**:

```bash
$ unbuild --stub
```

You are able to play and test out with your library with the up-to-date code!

Want to know the magic? After running the stubbing command, you can check out the generated distribution files:

```ts
// dist/index.mjs
import jiti from 'jiti'

export default jiti(null, { interopDefault: true })('/Users/antfu/unbuild-test/src/index')
```

```ts
// dist/index.cjs
module.exports = require('jiti')(null, { interopDefault: true })('/Users/antfu/unbuild-test/src/index')
```

Instead of the distribution of your code bundle, the dist files are now redirecting to your source code with a wrap of [`jiti`](https://github.com/unjs/jiti) - another treasure hidden in the [@unjs](https://github.com/unjs) org. `jiti` provides the runtime support of TypeScript, ESM for Node by transpiling the modules on the fly. Since it directly goes to your source files, there won't be a misalignment between your source code and bundle dist - thus there is no watcher process needed! This is a huge DX bump for library authors, if you still not getting it, you shall definitely grab it down and play with it yourself.

#### Bundleless Build

Powered by [`mkdist`](https://github.com/unjs/mkdist) - another [@unjs](https://github.com/unjs) package - `unbuild` also handles static assets and file-to-file transpiling. Bundleless build allows you to keep the structure of your source code, made easy for importing submodules on-demand to optimizing performance and more.

Config in `unbuild` will look like: 

```ts
// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // bundling
    'src/index',
    // bundleless, or just copy assets
    { input: 'src/components/', outDir: 'dist/components' },
  ],
  declaration: true,
})
```

One of the coolest features on this is that it handles `.vue` file out-of-box. For example, if I have a component `MyComponent.vue` under `src/components` with following content:

```html
<!-- src/components/MyComponent.vue -->
<template>
  <div>{{ count }}</div>
</template>

<script lang="ts">
const count: number | string = 0

export default {
  data: () => ({ count }),
}
</script>
```

Notice that we are using TypeScript in the Vue file, when we do the build, the component will be copied over but with the TypeScript annotation removed along with a `MyComponent.vue.d.ts` generated.

```html
<!-- dist/components/MyComponent.vue -->
<template>
  <div>{{ count }}</div>
</template>

<script>
const count = 0
export default {
  data: () => ({ count })
}
</script>
```

```ts
// dist/components/MyComponent.vue.d.ts
declare const _default: {
  data: () => {
    count: number | string
  }
}
export default _default
```

This way this allows you to use TypeScript in development while not requiring consumers to also have TypeScript in their setup.

P.S. `unbuild` is working on providing better out-of-box experience by auto infering the entries in `package.json`, [learn more](https://github.com/unjs/unbuild/issues/3).

## Context Misalignment

With either of the tools mentioned above, now we are able to write TypeScript as the single source of truth and made the overall codebase easier to maintain. However, there are still some caveats that you will need to keep an eye on it.

**In ESM, there is NO `__dirname`, `__filename`, `require`, `require.resolve`**. Instead, you will need to use `import.meta.url` and also do some convertion to get the file path string.

So since our code will be compiled to both CJS and ESM, it's better to avoiding using those environment specific context whenever possible. If you do need them, you can refer to my note about [Isomorphic `__dirname`](/posts/isomorphic-dirname):

```ts
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))
```

For `require` and `require.resolve`, you can use

```ts
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
```

Some good news, if you are using `unbuild`, you can turn on the `cjsBridge` flag and `unbuild` will shims those CJS context in ESM automatically for you!.

```ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  cjsBridge: true, // <--
})
```

On the other hand, if you are using `tsup`, it will shims ESM's `import.meta.url` for you in CJS instead.

## Verify your Packages

Once your published your package, you can verify if it follows the best practices using [publint.dev](https://publint.dev/) made by [@bluwy](https://github.com/bluwy). It will also give you suggestions of how to improve them further.

## Final words

This blog post showcased you only a few features of both tools. Do check their docs for more details. And hope you find these setups useful for building your own libraries. If you have any comments or suggestions, ping me on Twitter [@antfu7](https://twitter.com/antfu7). Happy hacking!
