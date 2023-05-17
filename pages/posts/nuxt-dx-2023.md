---
title: Development Experience with Nuxt - Vue Amsterdam 2023
description: Development Experience with Nuxt - Vue Amsterdam 2023
date: 2023-02-09
lang: en
type: talk+blog
recording: true
duration: 25min
---

> [**Vue Amsterdam 2023**](https://vuejs.amsterdam/)
> 
> Slides: [PDF](https://antfu.me/talks/2023-02-09) | [SPA](https://talks.antfu.me/2023/nuxt-devtools/)
>
> Recording: [YouTube](https://youtu.be/W6hhU-Ws2Rg) | [Bilibili (中文)](https://www.bilibili.com/video/BV1vx4y1V7VD)
>
> Made with <Slidev class="inline"/>  [**Slidev**](https://github.com/slidevjs/slidev) - presentation slides for developers.


Let's talk about Developer Experience. These years we have heard about Developer Experience more and more often. Frameworks have put a lot of effort into improving Developer Experience, to make our work more efficient and productive, and of course, a better experience. Here I'd like to divide the big concept into different parts and see what we have done to really make a difference from a framework's perspective.

---

The first thing I am going to pick is "Responsiveness".

In Nuxt 3, we switched our default bundler to Vite, the tool well-known for its instant hot module replacement, or so call HMR. It allows you to see the change from your code to the app in nearly no time, and creates a great workflow and feedback loop.

On the server-side rendering, we use `vite-node`, the same engine that powers Vitest, to do the HMR on the server-side.

And finally, we introduced Nitro along with Nuxt 3, apart from many awesome features it provides, it also offers hot reload for server APIs on dev time. Remember the time you need to restart your node process every time you change to your backend API? It's no longer the case with Nitro!

Combining all these tools, we are able to make your app reactive for any changes you make, no matter whether it's client code, ssr, or server-side APIs.

---

As a framework, Nuxt offers common practices built-in. 

TypeScript and ESM are supported out-of-box, thanks to Vite.

Nuxt also makes it simple to build single-page application, server-side rendering, static site generation, or hybrid them per routes - using the same codebase isomorphically without any explicit setup.

Then we provided the layout system, plugins, route middlewares, etc., to make the app creation easier and your codebase better organized. 

On top of that, we also provided a few composable utilities like `useState` and `useAsyncData`, and SEO utilities like `useHead` and `useSeoMeta` to make states accessible across the server and client sides. 

Not to mention we also have one of the best backend integrations. With Nitro, you can deploy your Nuxt app to any hosting service like Vercel, Netlify, Cloudflare, etc., with zero-config!

All of these features are trying to provide the common practice and sensible defaults that you might need, out-of-box. And save you time going down the rabbit hole configuring them.

---

And then to the cool part, we also introduced some conventions. 

The first one is file-based routing, which allows you to have a multi-page app by simply creating the Vue component with the same structure in the filesystem. 

Similarly, with the power of Nitro, we also have file-based server APIs, where you can create your serverless APIs in the same way as routing. 

Then we add components auto-imports, components under the components folder will be directly available in any Vue file with the same name as their file name. And also, they will are code-splitted well. 

And in Nuxt 3, we introduced compostables auto-import. It means you no longer need to type `import { ref } from 'vue'` in every component. APIs from Vue are directly available to you. 3rd party modules could also provide their custom composables to be auto-imported, and the same works for your local composables.

We also introduced client and server-only components. Making it easy, you can directly do it by adding `.client` and `.server` at the end of your component filename.

And finally, all those conventions are fully typed. You can even have type autocomplete when doing route navigation or fetching data from the APIs.

Conventions are introduced to greatly reduce the boilerplates you need to write and avoid duplications in your codebase. Which I see have significant benefits to boost your productivity.

---

When it comes to the ecosystem, Nuxt has a large community to build modules around it. Look at these on our site, we have hundreds of high-quality modules for you to pick from, and all of them here are available to Nuxt 3. With modules, getting integrations for features you want is effortless. And they are taking care of the details and best practices for you.

---

So, with so many great features we would have from a framework, there is, unfortunately, one problem - Transparency.

This might be considered a trade-off of having a framework or actually any tools. Every time we build some cool new features, we add a bit of abstraction to the framework. The abstraction is indeed a great thing to hide some implementation complexity from the users, but it sometimes could also create some extra burden for users to understand. And the conventions could sometimes lead to implicitness, where it's not clear where a component is from, or who is using a certain component, etc. And of course, sometimes it can make things hard to debug.

So how can we improve this?

---

To solve the same issue I had in Vite. I made the package called `vite-plugin-inspect`. It provides a UI for you to inspect the intermediated state of each plugin transformation of Vite. This makes the Vite pipeline transparent, and you can see how your code has been transformed step by step. If there is anything goes wrong, you can spot which plugin is causing that. (Demo a bit)

Since `vite-plugin-inspect` is for Vite, it can actually work with any framework or tools built on top of Vite, including Nuxt. However, because Vite is framework agnostic, the inspect feature is relatively low-level. It can be helpful in some cases, but it can also be quite limited.

---

So, by having the context of Nuxt, let's take one step forward -

**Introducing Nuxt DevTools!**

---

Nuxt DevTools is a set of visual tools that help you to know your app better. It will enhance your overall developer experience with Nuxt. Providing more transparency to the conventions. We also wish it to be able to help you monitor the performance and find the bottleneck. It should be interactive and playful, and it would be great if it could be personalized documentation when you need it.

So that's the plan. And it's indeed a big plan to achieve. Today I am going to showcase to you a bit preview of the things we have been working on.

---

Let's go demo time!

So, here is a dev server of Elk, a Mastodon client built with Nuxt. Daniel already gave a great explanation in his talk. With Nuxt DevTools enabled, here we have a small Nuxt icon on the bottom to open up the DevTools. Click it we see it pop up on a panel right inside our app. Just be aware that this is a very early preview, we have quite a lot of features are not yet been implemented and many things might be changed.

Let's get started. First, we will see a quick overview of your app, like which version you are using, and how many pages, components and composables you have. This is a barebone page for now but we will make it better.

So let's quickly go through the features we have.

The first tab we have pages, here you can see your current route of your app, and all the routes available. You can quickly navigate between pages by simply clicking them. You can also use the text box to see how the route is matched. When it's orange, it means you don't have a page for that route. When it's green, you can navigate to them by pressing enter.

Let's go to the next components tabs. Here it lists all the components you have in your app, and either they are from the user components, registered at runtime, from Nuxt, or from 3rd-party libraries. You can search from them, can click to go the source file in your editor.

You can also see the components graph by clicking the button here. You see Elk is indeed a complex project that has a lot of components. You can click one component and filter the graph to see how this component is using the others.

Nuxt DevTools also integrated components inspector, where you can click the arrow button here and goes to your app, to know where an element is from. Click it, it will open the source code to the exact line of that component.

Then we have imports tabs to show all the auto-imported entries you have from different sources. For example, here you can see VueUse offers many functions and we are using some of them. Click into, you will see a short description of what it does, and a link to the documentation page of that specific function, and how many files are referencing it.

Go to the modules tab, you will see the modules you have installed. With their informations and links to the documentation. In the future, we plan to have some nice UI for you to install or even manage your modules with one-click.

Here we have all the plugins executed in order. This page is working in progress.

Then we have runtime configs and payload. Where you can see the data you have from `useRuntimeConfig()`, or the state you have from `useState()`, `useAsyncData()` etc. And they are reactive and editable. You can change the color mode by editing this here.

We have a hooks tab, to show you how Nuxt hooks been executed in both client side and server side, and how much time they cost. This could be helpful to find the bottleneck of your app or even help us to find bugs in Nuxt core.

Then we have virtual files from Nitro, the generated-code to support Nuxt's convention. This is a bit advanced mostly for module authors.

And if you are already using vite-plugin-inspect, here for sure we have it built-in as well!

Alright, so that's the feature we had for Nuxt DevTools right now. We hope you like them.

---

Oh, almost forgot, we have one more thing!

---

Nuxt DevTools is also designed to be flexible and extensible. That means modules can actually contribute to DevTools to present interactive information for their integrations. Here let me show you a few modules that support Nuxt DevTools right now.

The first one is VS Code, let's click the "Start" button first. Thanks to VS Code Server, we are able to embed a fully featured VS Code into the DevTools, where you can sync with your vscode settings as your local, and all the extensions are available. With this, you are now able to edit your file without even leaving your app, for example, let's change the title of Elk (edit NavTitle.vue). You see, it's instant! You can also close the DevTools and open it back at any time.

Let's go to the next one. When you have the VueUse module installed, the module will contribute a new tab to the DevTools, and this shows all functions of VueUse with instant search.

Similarly, we also have UnoCSS inspector, where you can see how each file uses the atomic CSS, and how CSS is generated.

And finally, with the `nuxt-vitest` module, that Daniel and I have been working on recently, allows you to run your tests alongside your dev server, using the exact same pipeline as your Nuxt app. Whenever you update your file, the test will automatically reruns so you can see the client get updated and the test result at the same time!

This is only something we have right now as a MVP. We see great potential on this and it would be hard to imagine how it would end up being. We would like to invite you to join us for brainstorming and bringing an even better developer experience to Nuxt.

---

And so, the preview of Nuxt DevTools is open-sourced, right now! You can give it a star at <a href="https://github.com/nuxt/devtools" target="_blank"><span i-logos-nuxt-icon /> Nuxt Devtools</a> and find the instructions there for trying it in your Nuxt apps.

That's all for my talk. Thank you!


