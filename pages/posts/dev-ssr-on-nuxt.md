---
title: Dev SSR on Nuxt with Vite
date: 2022-10-04T00:00:00Z
lang: en
duration: 15min
description: The journey of how we made development time SSR working on Nuxt with Vite
---

[[toc]]

In [Nuxt 3](https://github.com/nuxt/framework), [we introduced first-class support for Vite](https://v3.nuxtjs.org/getting-started/introduction#why-nuxt) as bundler, interchangeable with Webpack (also available in [Nuxt 2 with Bridge](https://v3.nuxtjs.org/getting-started/bridge)). Since Vite provides an incredibly fast developer experience, we had to make sure SSR works as fast.

Since [Nuxt 3 RC.9](https://github.com/nuxt/framework/releases/tag/v3.0.0-rc.9), we shipped a new development-time SSR approach that is as fast as Vite's HMR with on-demand capability. Here is writeup on how we iterated to make it possible.

## SSR

In case you are not familiar with SSR already, let me do a brief introduction.

Server-side rendering (SSR) is a popular tech to improve SEO and initial page rendering speed. When using frameworks like Vue, the components are written purely in JavaScript. This means your distribution app's `index.html` would look like this:

```html
<html>
  <body>
    <div id="app">
      <!-- Empty. And will be rendered by JavaScript in the client browser -->
    </div>
    <script src="/assets/app.js"></script>
  </body>
</html>
```

When a user visits your website, the browser fetches and evaluates the JavaScript to let the framework render the content of your app (Client-side Rendering, CSR). Compared to the old age where all the content were directly written in HTML and made available directly when visiting, the modern way to build websites make the time between users hitting the Enter and seeing the content much longer (we call it [First Meaningful Paint (FMP)](https://web.dev/first-meaningful-paint/) or [LCP](https://web.dev/lcp/) in performance measurement).

SSR is introduced to solve this. By rendering the app on the server side before the page is served, the content can be delivered directly as HTML. With SSR, the example above will be served as:

```html
<html>
  <head>
    <!-- Manifests injected by SSR -->
    <link rel="stylesheet" href="/assets/app.css" />
  </head>
  <body>
    <div id="app">
      <!-- SSR -->
      <h1>Your title</h1>
      <p>These contents are server-rendered and shipped with the HTML</p>
    </div>
    <script src="/assets/app.js" async></script>
  </body>
</html>
```

Once the JavaScript has been downloads and evaluated, the client app will [hydrate](https://blog.somewhatabstract.com/2020/03/16/hydration-and-server-side-rendering/) the static DOM to provide client-side interactivity.

If you are interested in learning more details about SSR and CSR, I recommend reading [Rendering on the Web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) by [Jason Miller](https://twitter.com/_developit) and [Addy Osmani](https://twitter.com/addyosmani).

## SSR in Development

In general, when talking about SSR, we commonly refer to a web server in production that can render the page into HTML upon every incoming request. While the performance gain from SSR seems to only matter to the end users, it's also vital to have SSR running in development.  

SSR improves the performance and UX and allows you to run server-specific logic, like fetching internal states or accessing databases. SSR in development ensures your app works consistently across development and production, helping identify bugs earlier.

## The Challenge

The main challenge of making dev SSR is that, unlike production, **development code is addressed to be changed quite often**. Whenever you make some changes to your source code, you expect the dev server to grab the changes for the SSR.

In addition, the environments of Node.js and browsers are also different (e.g. you don't have `window` in Node.js). Libraries might have different builds and logic targeting Node and browsers; frameworks might compile components into different outputs for CSR and SSR. This usually means for client build and SSR build, we need two pipelines for handling the transformation and bundling.

### Approach 1: Rebuild

To do SSR, we have to render our app on the Node side. However, Node won't understand TypeScript `.ts` files we used, nor the Vue SFC `.vue`. It does not apply our custom configurations like alias and plugins either. A straightforward solution is to bundle our code into plain JavaScript for Node to consume. With the programmatic APIs Vite provided, we can do this:

```ts
import { build } from 'vite'

async function buildSSREntry() {
  await build({
    ssr: true,
    // config for Vite
  })
}
```

Then on the server side, we could import the bundle entry in Node to send the rendered result:

```ts
// need to first invalidate the renderer, here we skipped that part
const { default: ssrRenderer } = await import('./dist/entry.mjs')

// render HTML on request
const html = await ssrRenderer(req.url)
```

To make it reflects user changes, we need to use a filesystem watcher to trigger the rebuild upon each change.

```ts
fsWatcher.on('change', async () => {
  // rebuild the entire app in SSR on file change
  // in real-world this will be debounced
  await buildSSREntry()
})
```

Or instead, we could directly use Vite's Watch mode:

```ts
import { build } from 'vite'

function buildSSREntry(watchOptions) {
  build({
    watch: watchOptions,
    // ...
  })
}
```

It's powered by Rollup's watch mode, which will only re-transform the changed files to output the bundle more efficiently.

This approach is also how we handle the SSR build in Webpack. However, as you can see, Vite's bundleless approach makes the client-side app almost instant in development. The full bundling of SSR has now become the bottleneck of the developer experience.

### Approach 2: Dev Bundler

Having the client in dev mode and SSR in the production bundle would inevitably introduce some inconsistencies as they go into different pipelines. To solve it, [Pooya Parsa came out with a brilliant idea](https://github.com/nuxt/vite/pull/201) to use the Vite dev server "constructing" the app in SSR:

```ts
import { createViteServer } from 'vite'

const server = createViteServer()

// transform module `id` for SSR
const result = await server.transformRequest(id, { ssr: true })
```

Vite's dev server provides a method called `transformRequest()`, which is the same as you requesting a module from the browser but in the programmatic style. The extra `{ ssr: true }` could tell Vite to transform the ESM import/export syntax so it can work without relying on browsers resolving logic.

For example, the following code will be transformed by Vite:

```ts
import { ref } from 'vue'

export function foo() {
  return ref(0)
}
```

into

```ts
const __vite_ssr_import_0__ = await __vite_ssr_import__('vue')

function foo() {
  return __vite_ssr_import_0__.ref(0)
}
Object.defineProperty(__vite_ssr_exports__, 'foo', { value: foo })
```

Oops, that looks quite complex! But no worries, you don't have to understand it. All it does is transform the reserved ESM keywords `import` / `export` into function calls. The reason why this is needed is that Vite uses a different module resolution algorithm than Node, it was made for the browser's resolution. Since we can't interop the native ESM's resolving logic directly, transforming them into function calls would allow us to provide our custom resolving logic.

With this API, we can now get the SSR code for each module. Our task now becomes how we could chain them together. In our first [proof of concept at `nuxt/vite`](https://github.com/nuxt/vite/pull/201), we implemented our own dev-bundler using the `transformRequest()`. Here is a simplified example:

```ts
const __modules__ = {
  '/foo': () => {
    /* output of transformRequest for `/foo` */
    const __vite_ssr_exports__ = {}
    const bar = await __vite_ssr_import__('/bar')
    // ...
    // return exports
    return __vite_ssr_exports__
  },
  '/bar': () => {
    /* output of transformRequest for `/bar` */
  },
  // ...other modules
}

function __vite_ssr_import__(id) {
  return await __modules__[id]()
}

export default __vite_ssr_import__('/foo')
```

<div text-right>
<a href="https://github.com/nuxt/framework/blob/47b5baa362bd9a14e7942503a373aec959875eff/packages/vite/src/dev-bundler.ts#L229-L260" target="_blank" op50 font-serif>production code reference</a>
</div>

We wrap the transformed modules as functions and store them in an object `__modules__` for indexing. Then we can provide a custom import function `__vite_ssr_import__` to evaluate the modules we want.

We call this approach **Dev Bundler**. With it, we don't actually bundle things, but concatenate code transformed by Vite's dev server. We are using the same pipeline and internal cache as the client-side modules, making the SSR build more efficient and consistent with the client build. It then became our approach in Nuxt 3, and works great across our beta period.

But indeed, there are some things we could optimize.

First is that the approach is not really "on-demand". We are transforming all the modules in your app regardless of if it has been used for certain requests. And that makes this approach less "Vite".

Second is the source map support. Since all the modules have been concatenated into a single file and lost the source map, whenever you get an error, the stack trace will show you the error happens in the bundled file instead of the real source. This will hurt the DX as it might make it hard to locate the actual error.

### Approach 3: Vite Node

So to address the drawbacks of the Dev Bundler, we need to have the "on-demand" philosophy in mind. Instead of transforming all the modules and then evaluating them, we'd better do it upon the module that has been requested. Then we could use the `vm` module from Node to this:

```ts
import vm from 'vm'
import { createDevServer } from 'vite'

const server = createDevServer()

async function importModule(id) {
  // get the transform code on import
  // could be a request if the server is in another thread
  const result = await server.transformRequest(id, { ssr: true })

  // to provide vite ssr utils
  const wrappedCode = `(async function (__vite_ssr_exports__, __vite_ssr_import__) {
   ${result.code}
  })`

  // execute the code to get the function
  const wrappedFn = vm.runInNewContext(wrappedCode, {
    // with the file name we could have better stacktrace
    filename,
  })

  // passing the ssr utils (in wrappedCode)
  return wrappedFn({}, importModule)
}

export default await importModule('/foo')
```

<div text-right>
<a href="https://github.com/vitest-dev/vitest/blob/40862a2f88b8a0f6aaabe6e490538a85c8993adb/packages/vite-node/src/client.ts#L300-L331" target="_blank" op50 font-serif>production code reference</a>
</div>

Using the [Node `vm`](https://nodejs.org/api/vm.html) allows us to execute modules in a safer and isolated context. With inline sourcemap and the filename argument to the `runInNewContext`, it makes the stacktrace directly point to the correct location of the source file. And most importantly, moving the transform request inside the importing function makes it fully on-demand (caching and sourcemap are simplified in the example).

We ended up extracting this logic into a more general package called [`vite-node`](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme), so it could also be used outside Nuxt.

Not only does `vite-node` make it on-demand by only requesting modules it needs, but it also makes it possible to control the module cache to provide hot module replacement. We implemented the HMR logic in `vite-node`, similiar to how Vite handles it on the client side -- making the SSR reloads surprisingly fast.

<figure>
<img src="/images/nuxt-vite-node-hmr.png" rounded-lg>
<figcaption>Nuxt Dev SSR with HMR</figcaption>
</figure>

From a rough testing with a real-world Nuxt 3 app with 15 routes and 7 modules, we see the SSR reload time by changing a single Vue file goes **from ~200ms to &lt;0.01ms with `vite-node`**. Since it switched a full build to module level on-demand HMR, the difference will be more significant as the project grows.

## Opening Up Possibility

The work on making `vite-node` not only benefits the Nuxt's dev SSR but also opened up a lot of possibilities for the tooling around Vite. Since `vite-node` uses Vite for transformaing the modules, it inherits the great power of Vite. Like out-of-box TypeScript and JSX, the powerful plugin API and ecosystem - all that would just work on `vite-node` same as your client code.

For example, [Vitest](https://vitest.dev/) was only made possible because of the `vite-node`. It provides the infrastructure to run the tests on Node efficiently with the shared pipeline as your client app consistently. It also made possible to have the HMR support for the tests, making the test-driven development experience much better.

In addition, `vite-node` powers [Histoire](https://histoire.dev/), a interactive component playgrounds for Vite. [`vue-termui`](https://github.com/vue-terminal/vue-termui), a terminal UI framework for Vue, is using `vite-node` to do developement HMR.

<div flex justify-evenly gap-3 items-center>
  <a
    href="https://github.com/nuxt/framework"
    title="Nuxt3"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-nuxt3.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme"
    title="Vite Node"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-vite-node.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vitest-dev/vitest"
    title="Vitest"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-vitest.svg" class="w-15!" />
  </a>
  <a
    href="https://histoire.dev/"
    title="Histoire"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-histoire.svg" class="w-15!" />
  </a>
  <a
    href="https://github.com/vue-terminal/vue-termui"
    title="Vue Termui"
    target="_blank"
    class="border-0! hover:scale-105 transition-all duration-500"
  >
    <img src="/images/logo-termui.svg" class="w-15!" />
  </a>
  <div i-ri-question-line w-15 h-15 title="Yours?" op50 />
</div>


We are happy to see our work on Nuxt inspires and pushes the Vite ecosystem for more innovations and better tools. We are also eager to see what is comming next for the tools and integrations that built with "on-demand" philosophy in mind, providing better performance and developer experience.
