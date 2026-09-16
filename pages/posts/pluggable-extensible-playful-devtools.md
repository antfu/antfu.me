---
title: Pluggable, Extensible, and Playful DevTools
date: 2026-09-16T00:00:00Z
lang: en
duration: 15min
---

[[toc]]

<CrossPost link="https://devfra.me/posts/pluggable-extensible-playful-devtools" website="Devframe Documentation" />

Over the years, I have built quite a few DevTools: {UnoCSS Inspector}, {Vite Plugin Inspect}, {Vitest UI}, {Nuxt DevTools}, {ESLint Config Inspector}, and {Node Modules Inspector}, among others.

They look quite different, but fundamentally they all try to do the same thing: make implicit state visible. Instead of guessing why a CSS utility was generated, how a module was transformed, or which configuration applies to a file, we can see the process directly and interact with it.

Despite their different purposes, these tools share a surprising amount of infrastructure: client-server communication, state synchronization, serialization, static asset hosting, and a web interface. Each one also needs to decide how it is packaged, distributed, mounted to a server, and connected to its host. In practice, every tool ends up rebuilding many of the same pieces in isolation.

The same pattern appears across the ecosystem. Frameworks and build tools are building their own DevTools, often with overlapping capabilities such as data inspectors, asset viewers, build analyzers, terminals, and editor integrations. Yet most of them are tied to a specific framework and to the details of its development server: how it serves assets, handles requests, and upgrades connections. As a result, similar features are rebuilt and improved separately.

What if we could **free DevTools from those boundaries**? If each capability were reusable and modular, it could benefit every supported host. Instead of spreading the work across several versions of the same idea, communities could join forces on one tool and make it much better together.

This is the vision of a **Universal DevTools Ecosystem** I started sharing back in 2023, in [Now, and the Future of Nuxt DevTools](https://github.com/antfu/talks/tree/main/2023-10-18) and [Anthony's Roads to Open Source - The Set Theory](https://github.com/antfu/talks/tree/main/2023-10-28):

<UniversalDevToolsEcosystem />

The diagram was aspirational. The direction felt right, but finding the boundary that could make it work was much harder.

The idea stayed with me as the work moved from Nuxt DevTools to Vite DevTools. When I joined Vercel and started working on Vite DevTools, I finally had the opportunity to explore it on a broader scale. Vite gave us a concrete home to prove the experience, but the goal was always to open it to other build toolchains. Each iteration taught us something new, while LLMs made it much faster to explore and validate the design. Gradually, the right boundary started to emerge.

Today, the vision is finally becoming something not far away. Let me introduce you to **Devframe**.

## Devframe

[**Devframe**](https://devfra.me/) is a framework-neutral foundation for defining a DevTool once, then bringing it to different hosts, standalone surfaces, and agents.

<img src="/images/devframe/devframe-with-title.svg" alt="Devframe Logo" width="200" class="bg-[#8881] rounded-xl p8" />

You can think of Devframe as a framework for building DevTools, in the same way Nuxt or Next.js provides a framework for building web applications. At the integration layer, it plays a role similar to [`unplugin`](https://github.com/unjs/unplugin): while `unplugin` gives plugins a common interface across bundlers, Devframe gives DevTools a common definition across hosts.

A Devframe definition describes one tool: its capabilities, RPC functions, shared state, web interface, diagnostics, and agent-facing surface. From that definition, Devframe creates a Web Standard request handler that can be mounted almost anywhere.

### One Definition, One Standard Handler, Many Adapters

Every Devframe starts with [`defineDevframe()`](https://devfra.me/guide/devframe-definition). At its core, it associates a tool's identity with the capabilities it provides:

```ts
// my-tool.ts
import { defineDevframe } from 'devframe'
import { inspectProject } from './rpc'

export default defineDevframe({
  id: 'my-tool',
  name: 'My Tool',
  // Package metadata and client entry omitted...
  setup(ctx) {
    ctx.scope('my-tool').rpc.register(inspectProject)
  },
})
```

The definition is independent of its presentation. [`initDevframe()`](https://devfra.me/adapters/initiate) turns it into a live instance:

```ts
// server.ts
import { initDevframe } from 'devframe/initiate'
import myDevframe from './my-tool'

const myTool = initDevframe(myDevframe, {
  base: '/__my-tool/',
})

myTool.handler
// Web Standard Request -> Response handler
// (request: Request) => Promise<Response)

myTool.nodeMiddleware
// Traditional connect-style middleware
// (req: IncomingMessage, res: ServerResponse, next: () => void) => void
```

The handler becomes the tool's boundary. Behind it, Devframe serves the web interface, connection metadata, live RPC, authentication, and optional MCP endpoint under one namespace. The tool is no longer tied to a particular development server API; all the host needs to understand is the Web Standard `Request` and `Response`. _This handler-first model is greatly inspired by [Comark Content](https://content.comark.dev/getting-started/installation#mount-the-handler)._

Modern frameworks, runtimes, and build tools already converge around this boundary. Hono and Nitro work with Web Standard requests directly. Next.js and SvelteKit expose route handlers. Vite and Rsbuild accept Connect-style middleware, for which the same instance provides `nodeMiddleware`:

<DevframeMountExamples />

That is almost the entire portability trick. Any framework or build tool that supports Web Standard handlers or Connect-style middleware can mount the same Devframe and gain access to the same ecosystem.

### Adapters as Conveniences

The handler is the smallest common denominator. For common entry points, [higher-level adapters](https://devfra.me/adapters/) package it into familiar forms. The same definition can become a standalone CLI, a dedicated dev server, a Vite DevTools plugin, an MCP server, or a static report:

```ts
import { createPluginFromDevframe } from '@vitejs/devtools-kit/node'
import { createBuild } from 'devframe/adapters/build'
import { createCac } from 'devframe/adapters/cac'
import { createDevServer } from 'devframe/adapters/dev'
import { createMcpServer } from 'devframe/adapters/mcp'
import myDevframe from './my-tool'

// Pick the entry points your package needs:
export const runCli = () => createCac(myDevframe).parse()
export const startServer = () => createDevServer(myDevframe)
export const vitePlugin = createPluginFromDevframe(myDevframe)
export const startMcp = () => createMcpServer(myDevframe, { transport: 'stdio' })
export const buildReport = () => createBuild(myDevframe, { outDir: 'dist-static' })
```

A package can ship several of these entry points at once. For example, a build inspector could offer a standalone CLI for any project, generate static reports in CI, appear as a dock inside Vite DevTools, and let an agent query the active build—all backed by the same definition.

We are already using this model in {Node Modules Inspector}, {ESLint Config Inspector}, and {Vite Plugin Inspect}. They remain focused tools with their own interfaces, while sharing Devframe underneath. You can find more examples on the [Built with Devframe](https://github.com/devframes/devframe/tree/main/examples/built-with) page.

The frontend is up to each tool as well. Devframe handles the protocol and runtime, while the tool can choose whichever UI framework and design system suits it. To dogfood that promise, the [built-in plugins](#built-in-plugins) span Vue, Svelte, Solid, React, and Next.js.

<DevframeArchitecture />

### Visual and Agentic

As agents become part of our development workflows, a DevTool no longer has to be only a panel for humans. Our goal is for it to also offer a structured interface to its internal state and capabilities—something agents and other tools can access programmatically.

The two interfaces play to different strengths rather than replacing each other. Visualizations are effective for exploration, overview, and comparison. Agents can retrieve focused context, correlate it with the codebase, and carry out multi-step actions. The presentation changes, but the source of truth stays the same.

In Devframe, RPC functions stay private by default and must be explicitly exposed to agents. The [MCP adapter](https://devfra.me/adapters/mcp) translates those functions, readable resources, and selected shared state into an agent-consumable surface. Descriptions, schemas, and safety metadata help agents understand when and how each capability should be used.

There is another interesting piece here. Devframe integrates with Vercel's [`json-render`](https://github.com/vercel-labs/json-render), allowing a UI to be described as serializable data from a constrained component catalog. This makes it easier for agents to generate dashboards and interactive tools while keeping the output predictable.

The same mechanism also enables **server-provided UI**: a Devframe publishes the view and its state, while the host provides the renderer. With the [prebuilt reference UI](https://devfra.me/guide/json-render), a tool can get started without authoring or building a custom client at all. The protocol remains renderer-agnostic, so each host can render the same view with its own framework, components, and design system.

We are still exploring the APIs and practices around discoverability, permissions, context usage, and the relationship between visual and agentic workflows. We would love to hear ideas and advice from the community as these patterns evolve through real integrations.

<DevframeDualSurface />

### Built-in Plugins

Of course, an abstraction only becomes convincing when real tools can live on it. To test Devframe's capabilities and framework-agnostic design, we ship a few [official plugins](https://devfra.me/plugins/) as reusable working examples. They are intentionally built with **different frontend frameworks**, and each can run standalone or be mounted into a supported host.

Here are a few examples:

#### Data Inspector

[`@devframes/plugin-data-inspector`](https://devfra.me/plugins/data-inspector) is built with Vue and provides an interactive workbench for live server-side objects. A tool can register an object as a data source, then explore and query it with [Jora](https://discoveryjs.github.io/jora/) inside the process that owns it.

Standalone, it can inspect JSON or JSONL files, build a self-contained report, or attach to a running Node.js process. This is useful for inspecting stores, caches, framework contexts, build metadata, or other states that would otherwise require custom logging.

You can try it standalone with:

```bash
pnpx @devframes/plugin-data-inspector
```

<figure class="my-4">
  <img src="/images/devframe/data-inspector.png" class="scale-110" alt="Data Inspector exploring a live data source" />
  <figcaption class="text-center text-sm text-neutral-500">Data Inspector exploring a live data source</figcaption>
</figure>

When integrated, other tools only need to contribute data sources. A Vite plugin could expose its plugin container, a framework could expose runtime state, and a test runner could expose its test graph. All of them can reuse the same query workbench and data viewer instead of building another inspector for every host.

#### Terminals

[`@devframes/plugin-terminals`](https://devfra.me/plugins/terminals) is built with Svelte and provides a browser-based terminal panel supporting read-only process output and interactive PTY sessions.

This separates the process-running capability from the tool that renders it. A host can give multiple tools a consistent place for subprocess output and interactive commands, without mixing every task into the user's main terminal.

<figure class="my-4">
  <img src="/images/devframe/terminals-in-vite-devtools.png" class="rounded-xl shadow border border-base" alt="Terminals plugin running in Vite DevTools" />
  <figcaption class="text-center text-sm text-neutral-500">Terminals plugin running in Vite DevTools</figcaption>
</figure>

It can also run standalone:

```bash
pnpx @devframes/plugin-terminals
```

<figure class="my-4">
  <img src="/images/devframe/terminals-standalone.png" class="scale-110" alt="Terminals plugin running as a standalone page" />
  <figcaption class="text-center text-sm text-neutral-500">Terminals plugin running as a standalone page</figcaption>
</figure>

This opens the interactive terminal directly in your browser. You can use it to manage processes, run commands, or even run agents like Claude Code without leaving the browser.

#### Accessibility Inspector

[`@devframes/plugin-a11y`](https://devfra.me/plugins/a11y) is built with Solid. It scans the host application with [axe-core](https://github.com/dequelabs/axe-core), lists WCAG violations, and highlights the corresponding elements on the page. It can also turn the findings into fix prompts for agents, connecting visual inspection with an agentic workflow.

Standalone, its panel and injected scanner can inspect any page. Inside a DevTools host, the same findings can also be mirrored into the shared message feed.

It is heavily inspired by [`@nuxt/a11y`](https://github.com/nuxt/a11y), which brought real-time accessibility feedback into Nuxt DevTools. Extracting the idea into a Devframe plugin makes the same capability available beyond Nuxt.

<figure class="my-4">
  <img src="/images/devframe/a11y.png" class="scale-110" alt="Accessibility Inspector highlighting violations in the host application" />
  <figcaption class="text-center text-sm text-neutral-500">Accessibility Inspector highlighting violations in the host application</figcaption>
</figure>

#### More Plugins

Other official plugins cover a [VS Code editor on the web](https://devfra.me/plugins/code-server), [asset management](https://devfra.me/plugins/assets), a [Git panel](https://devfra.me/plugins/git), [Open Graph previews](https://devfra.me/plugins/og), and [Devframe's own RPC and state inspector](https://devfra.me/plugins/rpc). What they share is the Devframe definition and protocol, not a frontend stack.

These plugins are not meant to be a complete set of tools. They show what Devframe can support and offer starting points for communities to build their own. I believe many more interesting DevTools will emerge over time. You can follow the growing list on [Built with Devframe](https://devfra.me/guide/built-with.html).

## From One Devframe to a DevTools Host

So far, we have one portable DevTool. But once several Devframes are active together, another problem appears: **discovery**. How do users find and move between them?

Many DevTools log their own URL to the console:

<div class="terminal-window">

```ansi
[2m~[0m [34mpnpm dev[0m

  [1;36mVITE[0m [2mv8.2.1[0m  [32mready in[0m [2m32 ms[0m

  [32m➜[0m  [1mLocal:[0m  [1;4;36mhttp://localhost:3333/[0m
[1;35mUnoCSS Inspector:[0m [3;32mhttp://localhost:3333/__unocss/[0m

[2m>[0m [33mVisualized ESLint Config:[0m [4;34mhttp://127.0.0.1:3333/.eslint-config/[0m
  [32m➜[0m  [1mVite Inspect:[0m [1;3;36mhttp://localhost:3333/__inspect/[0m
```

</div>

Sometimes DevTools also inject floating buttons into the host application:

<figure class="my-4">
  <img src="/images/devframe/floating-devtools.png" class="rounded-lg border border-base shadow" alt="Floating buttons injected into the host application" />
  <figcaption class="text-center text-sm text-neutral-500">Floating buttons from multiple DevTools injected into the host application.<br><span class="op50 italic">(this is a made-up example to demonstrate the problem)</span></figcaption>
</figure>

As more tools join the project, the console becomes a directory of URLs and the page gains a collection of unrelated floating buttons. While that each DevTool also has to build and maintain its own discovery mechanism.

To improve this, Devframe also provides a **composition layer**: the [Hub](https://devfra.me/guide/hub).

[`@devframes/hub`](https://devfra.me/guide/hub) is headless and framework-neutral. Multiple Devframes can register with it and contribute docks, commands, messages, terminals, and shared state. To users, they appear through one consistent entry point. To the tools, the Hub provides a shared context in which they can discover and collaborate with one another.

The same mounting model scales from one Devframe to the whole collection. [`initHub()`](https://devfra.me/guide/hub-initiate) puts the Hub and all of its Devframes behind one Web Standard handler:

```ts
import { initHub } from '@devframes/hub/initiate'
import { createTerminalsDevframe } from '@devframes/plugin-terminals'
import { createXxxDevframe } from '...'

const hub = initHub({
  // The common base path for all mounted Devframes.
  // `/__my-tool/` becomes `/__devframes/__my-tool/`.
  base: '/__devframes/',
  // Devframes become composable plugins of the Hub.
  devframes: [
    createTerminalsDevframe(),
    createXxxDevframe(),
    // ...
  ],
  // We ship a reference UI to make it easy to get started,
  // but you can provide your own layer to match
  // your product's design system and interaction model.
  ui: await import('@devframes/hub-ui').then(m => m.createUi()),
})

// The same handler/middleware API as a standalone Devframe.
hub.handler
hub.nodeMiddleware
```

<figure class="my-4">
  <img src="/images/devframe/floating-devtools-with-devframes-hub.png" class="rounded-lg border border-base shadow" alt="DevTools collected under one Hub entry" />
  <figcaption class="text-center text-sm text-neutral-500">With the Hub, DevTools can register themselves under one consistent entry.<br><span class="op50 italic">(this is a made-up example for demonstration)</span></figcaption>
</figure>

Mounted Devframes share one RPC registry, state store, connection, authentication gate, and optional aggregate MCP endpoint. The Hub itself remains headless: [`@devframes/hub-ui`](https://devfra.me/guide/hub-initiate#the-ui-slot) provides the reference interface, while a product can bring its own UI without changing the underlying tools.

Like a single Devframe, with the standard handler, the Hub can also be mounted to almost any framework. The repository includes working reference hosts for [Vite](https://github.com/devframes/devframe/tree/main/examples/hub-vite), [Next.js](https://github.com/devframes/devframe/tree/main/examples/hub-next), [Hono](https://github.com/devframes/devframe/tree/main/examples/hub-hono), [Nitro](https://github.com/devframes/devframe/tree/main/examples/hub-nitro), and [Rsbuild](https://github.com/devframes/devframe/tree/main/examples/hub-rsbuild). Each host only connects the same handler and UI entry to its native server API. While the examples are minimal to demonstrate the possibilities, a more complete host that matches the product's design system and interaction model can also be shipped on top of the Hub's foundation.

### Vite DevTools

[Vite DevTools](https://devtools.vite.dev/) is the first flagship host built on this foundation. It brings a Vite-focused interface and its own integrations while using `initHub()` for composition and serving. Alongside Vite and Rolldown analysis, Vitest UI, and Oxc tooling, it gives independent DevTools a common place to work together.

<figure class="my-4">
  <img src="/images/devframe/vite-devtools-vite-plus.png" class="rounded-lg border border-base shadow scale-80 my--10!" alt="Vite Plus dock entry in Vite DevTools" />
  <figcaption class="text-center text-sm text-neutral-500">Vite Plus dock entry in Vite DevTools</figcaption>
</figure>

<figure class="my-4">
  <img src="/images/devframe/vite-devtools-rolldown.png" class="rounded-lg border border-base shadow" alt="Rolldown DevTools in Vite DevTools" />
  <figcaption class="text-center text-sm text-neutral-500">Rolldown DevTools in Vite DevTools</figcaption>
</figure>

A Devframe can join Vite DevTools through an adapter. A regular Vite plugin can also contribute directly through the new `devtools.setup` entry:

```ts
// vite.config.ts
import { createPluginFromDevframe } from '@vitejs/devtools-kit/node'
import { createMyDevframe } from 'my-devframe-tool'
import { defineConfig } from 'vite'

const myDevframe = createMyDevframe()

export default defineConfig({
  devtools: true,
  plugins: [
    // Helper to turn a Devframe into a Vite plugin.
    createPluginFromDevframe(myDevframe),
    // A regular Vite plugin can also contribute directly.
    {
      name: 'vite-plugin-my-tool',
      devtools: {
        setup(ctx) {
          // Devframe context with Vite-specific augmentations.
        },
      },
    },
  ],
})
```

The adapter turns an existing Devframe into a Vite plugin. The `devtools.setup` entry lets Vite plugins use the same context without creating another integration layer. This makes adoption incremental: tools can start where they are and still participate in the shared ecosystem.

### Nuxt DevTools

The new [Nuxt DevTools](https://github.com/nuxt/devtools) v4 builds on top of both. It inherits Vite DevTools and Vue DevTools, then adds Nuxt-specific knowledge: pages, modules, auto-imports, server APIs, runtime state, and contributions from the Nuxt module ecosystem.

<figure class="my-4">
  <img src="/images/devframe/nuxt-devtools-v4.png" class="rounded-xl shadow border border-base" alt="Nuxt DevTools v4" />
  <figcaption class="text-center text-sm text-neutral-500">Nuxt DevTools v4</figcaption>
</figure>

Here are the stacking layers to demonstrate this better:

<DevToolsStack />

[Vue DevTools](https://devtools.vuejs.org/) is migrating to the Vite DevTools foundation. Vue capabilities such as component and reactivity inspection can then coexist with Vite integrations and general Devframes in the same host.

In a way, the story has come full circle: the wish that started with Nuxt DevTools now returns with a concrete foundation underneath. Nuxt DevTools v4 is expected to ship with Nuxt v5 and will also be available as a manual opt-in for Nuxt 4.

### Next.js DevTools (Prototype)

I am also experimenting with bringing Devframes to Next.js DevTools. Internally, I already have a working prototype of the Devframes Hub running inside Next.js DevTools, without any modifications to the installed Devframe plugins.

<figure class="my-4">
  <video class="rounded-lg border border-base shadow" autoplay muted loop>
    <source src="/images/devframe/nextjs-devtools-with-devframes-demo.mp4" type="video/mp4">
    <img src="/images/devframe/nextjs-devtools-with-devframes-demo.png" alt="Next.js DevTools with Devframes prototype" />
  </video>
  <figcaption class="text-center text-sm text-neutral-500">Next.js DevTools with Devframes prototype<br><span class="op50 italic">(this is an internal prototype, it's not yet available and does not represent the final state)</span></figcaption>
</figure>

## Inheriting the Ecosystem

Sharing the foundation does not mean every DevTools experience should look the same. Framework-specific layers can be much richer because they understand their framework's conventions and runtime. The infrastructure can be shared while the final experience remains specific.

Devframe itself remains independent of Vite and any framework. A future framework-specific DevTools host can mount the same Hub and plugins, then add its own knowledge and presentation. It will not get the full experience for free, but it no longer needs to rebuild the foundation before it can begin.

<DevframeEcosystemMap />

## Build Your Own DevTools

Devframe is not only for framework authors or established tooling teams. It can also provide the skeleton for project-specific DevTools and even one-off visualizations.

With built-in agent skills and a growing collection of real-world examples, we are exploring a future where you might ask an agent:

> "Build me a one-off Devframe to visualize my app's network request flow and highlight the bottlenecks."

Not every useful DevTool needs to become a permanent product or a published package. Some might exist only long enough to answer one question. We will keep improving Devframe and its ecosystem so these pluggable, extensible, and playful tools become practical for more people to build.

## What's Next

Devframe v1.0 stabilizes the interface for the community to build on and experiment with. Vite DevTools will follow with a stable release, while Nuxt DevTools v4 and the Vue DevTools migration continue testing the model at the framework level.

This is the first credible implementation toward the modular DevTools infrastructure we imagined years ago. There are more frameworks to connect, plugin conventions to refine, and agentic practices to discover.

What excites me is not one particular feature or integration, but the possibility that a good tool can be built once, travel further, and become better as more communities contribute to it: shared infrastructure underneath, specific and playful experiences on top, and structured capabilities available to both humans and agents.

We are still exploring the best practices, especially around agentic interfaces, permissions, and cross-tool collaboration. Any kind of contribution is welcome: integrations, experiments, design ideas, use cases, feedback, or simply trying the tools and sharing what you find.

If this direction sounds interesting to you, check out the {Devframe} repository, try building something with it, leave us some feedback, or join the [Discord](https://discord.gg/bnH3KPzfpr). I am looking forward to seeing what we can build together!

## Thanks

This vision has come a long way with the help of many people.

A huge thank you to {@webfansplz}, who has put a tremendous amount of work into Vite DevTools. I also owe a lot to {@Akryum}: his work on Vue DevTools and testing framework UIs has inspired me for years, and he spent a great deal of time brainstorming and prototyping these DevTools ideas with me.

{@hyfdev} helped coordinate with Rolldown and shape the APIs that made Vite DevTools possible. {@Atinux} planted the seed of Nuxt DevTools, invested so much in building it, and now continues that investment in Vite DevTools. {@danielroe} provided valuable feedback on Nuxt DevTools and kept motivating us to push further on bundle size _(the installed size of Vite DevTools core dropped by 30 MB from v0.1 to v0.5)_. {@posva} provided great feedback on Devframe's documentation and helped with the integrations.

Thanks also to {@yuyinws} for donating Oxc Inspector to Vite Plus DevTools and continuing to maintain it; and to {@SaKaNa-Y} and {@dvcolomban} for being early adopters and contributing extensively to both Vite DevTools and Devframe.

And, of course, thanks to everyone who has contributed to Vite DevTools, Nuxt DevTools, and Vue DevTools along the way. This work is built on top of all those contributions.

Finally, thanks to {Vercel} for supporting these projects and making our ambitious plan for unified DevTools no longer feel like an unreachable dream.
