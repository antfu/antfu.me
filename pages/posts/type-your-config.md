---
title: Type your Config
date: 2021-03-24T16:00:00Z
lang: en
duration: 5min
type: note
---

Configurations can be quite complex, and sometimes you may want to utilize the great type checking that TypeScript provided. Change your `xxx.config.js` to `xxx.config.ts` is not an ideal solutions as you will need to have a Node.js register involved to transpile it into JavaScript and some tools might not support doing that way. Fortunately, TypeScript also support type check in plain JavaScript file with JSDoc. Here is an example of Webpack config with type checks:

```ts
// webpack.config.js
// @ts-check

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  /* ... */
}

module.exports = config
```

Prefect. Everything should work and you can already call it a day.

I have never thought about we can do better, until I saw [Vite's approach](https://vitejs.dev/config/#config-intellisense). In Vite, you can simply have:

```ts
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  /* ... */
})
```

No JSDocs, no need to declare a variable first then export it. And since TypeScript will infer the types even you are using plain JavaScript, it works great with both.

How? The `defineConfig` is literally a pass-through, but brings with types:

```ts
import type { UserConfig } from 'vite'

export function defineConfig(options: UserConfig) {
  return options
}
```

`defineConfig` exists in the runtime, so it works for JavaScript even if the types get truncated. This is really just some small details of DX, but I would wish more tools could adapt this approach and make the type checking more approachable and simpler.
