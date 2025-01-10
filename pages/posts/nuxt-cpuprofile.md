---
title: CPU Profiling Nuxt
date: 2024-12-31T16:00:00Z
lang: en
duration: 2min
type: note
---

If you want to debug the bundling performance of your Nuxt app to generate CPU profiles.

Node.js provides a built-in [`--cpu-prof`](https://nodejs.org/api/cli.html#--cpu-prof) flag that allows you to generate CPU profiles. However you can't directly pass it in your `nuxi` command, you have to use it with `node` directly.

Instead of running `nuxi dev`, you can run `node` with the direct path to the CLI in `node_modules`:

```bash
# nuxi dev
node --cpu-prof ./node_modules/nuxi/bin/nuxi.mjs dev --fork=false
```

Note that `--fork=false` is important as by [default `nuxi` will start the Nuxt process in a forked process](https://github.com/nuxt/cli/blob/a433fbcebda8cb87d7c0c8199137877b669e1c31/src/commands/dev.ts#L69-L75) which will make the CPU profile not working.

> The simliar technique can be applied to other CLI tools that are not directly using `node` to start the process.

After killing your Nuxt process, you will find two `CPU.***.cpuprofile` files generated in your working directory. I recommend using [CPUpro](https://discoveryjs.github.io/cpupro/) to visualize the profile. If you are using VS Code, I also created [an extension](https://marketplace.visualstudio.com/items?itemName=antfu.cpupro) for you to directly open the `.cpuprofile` file in VS Code easily.
