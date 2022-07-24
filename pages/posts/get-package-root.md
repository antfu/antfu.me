---
title: Get Package Root
date: 2021-07-14T16:00:00Z
lang: en
duration: 1min
---

When you want to get the real file path of a certain package, you could use `require.resolve` to fetch their main entry path.

```bash
> require.resolve('vite')
'/Users/.../node_modules/vite/dist/node/index.js'

> require.resolve('windicss')
'/Users/.../node_modules/windicss/index.js'
```

However, when you want to get the root directory of the package, you will find the result of `require.resolve` could vary based on different packages' configurations.

A trick for this is to resolve the `package.json` instead, as the `package.json` is always located at the root of the package. Combining with `path.dirname`, you could always get the package root.

```bash
> path.dirname(require.resolve('vite/package.json'))
'/Users/.../node_modules/vite'
```

Update: or you can use my package [`local-pkg`](https://github.com/antfu/local-pkg) now :)
