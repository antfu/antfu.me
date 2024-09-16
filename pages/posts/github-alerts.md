---
title: GitHub-style Alerts
date: 2023-11-30T10:00:00Z
lang: en
duration: 2min
type: note
---

> [!TIP]
> Just a quick tip, that you can use `> [!TIP]` to create
> a GitHub-style alert in your README.md like this.

```md
> [!TIP]
> Just a quick tip, that you can use `> [!TIP]` to create
> a GitHub-style alert in your README.md like this.
```

The original [GitHub proposal is here](https://github.com/orgs/community/discussions/16925). It's rolled out basically everywhere on GitHub now.

## Use it in your website

And in case you like it, and wanted to use it in your own website, I wrote a quick `markdown-it` plugin for it:

<p>
<GitHubLink repo="antfu/markdown-it-github-alerts" />
</p>

### Vite

If you are using [`unplugin-vue-markdown`](https://github.com/unplugin/unplugin-vue-markdown):

```ts
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
// vite.config.ts
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Markdown({
      markdownItSetup(md) {
        md.use(MarkdownItGitHubAlerts)
      }
    })
  ],
})
```

### VitePress

If you are using VitePress, you can add this to your `.vitepress/config.js`:

```ts
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(MarkdownItGitHubAlerts)
    }
  }
})
```

### Nuxt Content

Nuxt Content use [`remark`](https://github.com/remarkjs/remark) instead of `markdown-it`, so the plugin won't work yet. I will implement it later if there is demand.

## Reference

- [Commit of this blog post and setting it up](https://github.com/antfu/antfu.me/commit/72d8dc2fb70bf21582c42d9424337560a7edea6b)
- [Proposal to VitePress for adding this by default](https://github.com/vuejs/vitepress/issues/3278)

> [!IMPORTANT]
> Thanks for reading! :)
