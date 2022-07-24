---
title: Isomorphic `__dirname`
date: 2021-08-30T16:00:00Z
lang: en
duration: 1min
---

In ESM, you might found your old friends `__dirname` and `__filename` are no longer available. When you search for [solutions](https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag), you will find that you will need to parse `import.meta.url` to get the equivalents. While most of the solutions only show you the way to get them in ESM only, If you like me, who write modules in TypeScript and transpile to both CJS and ESM at the same time using tools like [`tsup`](https://tsup.egoist.sh/). Here is the isomorphic solution: 

```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))
```
