---
draft: false
title: Make Libraries Working with Vue 2 and 3
description: Try Vue Demi!
date: 2020-07-01T14:00:00.000+00:00
lang: en
duration: 5min
---

Today, Evan has announced that the first RC of Vue 3 [will be released in mid-July](https://github.com/vuejs/rfcs/issues/183). The post suggests library/plugin authors to start migrating the support for Vue 3. But as the APIs and behaviors have changed a lot, is that possible to make our libraries support Vue 2 and 3 at the same time?

## Universal Code

The most simple way is to write universal code that works in both versions without any additional modification, just like people would do for [Python 2 and 3](https://python-future.org/compatible_idioms.html). Simple does not mean it's easy. Write such components requires you to avoid **things that newly introduced in Vue 3** and **things that deprecated from Vue 2**. In other words, you can't use:

* Composition API
* `.sync` `.native` modifiers
* Filters
* [3rd-parties vendor objects](/posts/vue-3-notes#-use-markraw-for-vendor-objects)
* etc. (let me know if I missed anything and I will update the list)

This just makes life harder and you can't benefit from the new awesome APIs in Vue 3.

## Use Branches

[A reply](https://github.com/vuejs/rfcs/issues/183#issuecomment-652134760) to [this problem](https://github.com/vuejs/rfcs/issues/183#issuecomment-651944231) from a core team member suggests using different branches to separate your support for each targeting version. I think it's a good solution for existing and mature libraries as their codebases are usually more stable and version targeting optimization might require them to have better code isolations.

The drawback of this is that you will need to maintain two codebases which double your workload. For small scale libraries or new libraries that want to support both versions, doing bugfix or feature supplements twice is just no ideal. I would not recommend using this approach at the very beginning of your projects.

## Build Scripts

In [VueUse](https://github.com/antfu/vueuse), I wrote [some build scripts](https://github.com/antfu/vueuse/tree/master/scripts) to make the code imports from the target version's API while building. After that, I would need to publish two tags `vue2` `vue3` to distinguish different version supports. With this, I can wite the code once and make the library supports both Vue versions. The problem of it is that I need to build twice on each release and guide users to install with the corresponding plugin version (and manually install [`@vue/composition-api`](https://github.com/vuejs/composition-api) for Vue 2).

***

It has been several months since I wrote VueUse. During this period, I am always trying to figure out a proper way to extract the logic from VueUse, so it can be reused and benefit other library authors. But after all, I still think it's just too complicated to be used in general.

However, at the moment I started to write this post, I came up with the idea - providing the universal interface for both versions. If it works, in this way, authors are no need to worried about the users' environments anymore.

And after some experiments...

## 🎩 Introducing [Vue Demi](https://github.com/antfu/vue-demi)

[**Vue Demi**](https://github.com/antfu/vue-demi) is a developing utility that allows you to write Universal Vue Libraries for Vue 2 and 3. Without worrying about users' installed versions.

When you are going to create a Vue plugin/library, simply install `vue-demi` as your dependency and import anything related to Vue from it. Publish your plugin/library as usual, your package would become universal!

```json
{
  "dependencies": {
    "vue-demi": "latest"
  }
}
```

```ts
import Vue, { ref, reactive } from 'vue-demi'
```

Underhood, it utilized the [`postinstall` npm hook](https://docs.npmjs.com/misc/scripts). After all packages get installed, [the script](https://github.com/antfu/vue-demi/blob/master/scripts/postinstall.js) will start to check the installed Vue version and redirect the exports to based on the local Vue version. When working with Vue 2, it will also install `@vue/composition-api` automatically if it doesn't get installed.

You can also check [the working examples](https://github.com/antfu/vue-demi/tree/master/examples), where I created a demo library [`@vue-demi/use-mouse`](https://github.com/antfu/vue-demi/blob/master/examples/%40vue-demi/use-mouse/src/index.ts) with just a single file entry.

Please keep in mind that Vue Demi is experimental and there will definitely be some glitches. Feel free to give it a try and let me know if anything goes wrong.

Thanks and happy hacking!
