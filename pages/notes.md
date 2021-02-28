---
title: Notes - Anthony Fu
display: Notes
subtitle: Quick notes / tips
description: Quick notes / tips
---

## Type Your Config

_2020/02/29_

Configurations can be quite complex, and sometimes you may want to utilize the great type checking that TypeScript provided. Change your `xxx.config.js` to `xxx.config.ts` is not an ideal solutions as you will need to have a Node.js register involved to transplie it into JavaScript and some tools might not support doing that way. Fortunately, TypeScript also support type check in plain JavaScript file with JSDoc. Here is an example of Webpack config with type checks:

```ts
// webpack.config.js
// @ts-check

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  /*...*/
}

module.exports = config
```

Prefect. Everything should work and you can already call it a day.

I have never thought about we can do better, until I saw [Vite's approach](https://vitejs.dev/config/#config-intellisense). In Vite, you can simply have:

```ts
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  /*...*/
})
```

No JSDocs, no need to declare a variable first then export it. And since TypeScript will infer the types even you are using plain JavaScript, it works great with both.

How? The `defineConfig` is literally a pass-through, but brings with types:

```ts
import { UserConfig } from 'vite'

export function defineConfig(options: UserConfig) {
  return options
}
```

`defineConfig` exists in the runtime, so it works for JavaScript even if the types get truncated. This is really just some small details of DX, but I would wish more tools could adapt this approach and make the type checking more approachable and simplier.

## Match Quotes in Pairs

_2020/02/28_

In JavaScript, single quotes('') and double quotes("") are interchangable. With ES6, we now even have backticks(``) for template literals. When you want to write a quick script to find all the strings without introducing a heavy parser, you may think about using RegExp. For example, you can have:

```ts
/['"`](.*?)['"`]/gm
```

It works for most of the case, but not for mixed quotes:

```ts
`const a = "Hi, I'm Anthony"`.match(/['"`](.*)['"`]/m)[1] // "Hi, I"
```

You have to make sure the starting quote and ending quote are the same type. Initially I thought it was impossible to do it in RegExp, or we have to do like this:

```ts
/'(.*?)'|"(.*?)"|`(.*?)`/gm
```

That's definitely a bad idea as it makes you duplicated your notations. Until I found this solution:

```ts
/(['"`])(.*?)\1/gm
```

`\1` is a [Backreferences](https://www.regular-expressions.info/backref.html) to your first group, similarly you can have `\2` for the second group 2 and `\3` for the third, you got the idea. This is exactly what I need! Take it a bit further, to exclude the backslash escaping, now we can have a much reliable RegExp for extracting quoted texts from any code.

```ts
/(["'`])((?:\\\1|(?:(?!\1)|\n|\r).)*?)\1/mg
```

You can find it running in action on my [`vite-plugin-windicss`](https://github.com/windicss/vite-plugin-windicss/blob/571c1d9d9bcbf699038614e6f9fab0ddc62b959b/packages/plugin-utils/src/regexes.ts#L1).


## Match Chinese Characters

_2020/02/25_

When you need to detect if a string contains Chinese characters, you would commonly think about doing it will RegExp, or grab a ready-to-use package on npm.

If you Google it, you are likely end up with [this solution](https://stackoverflow.com/a/21113538):

```ts
/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
```

It works, but a bit dirty. Fortunately, I found [a much simpler solution](https://stackoverflow.com/a/61151122) today:

```ts
/\p{Script=Han}/u
```

```ts
!!'你好'.match(/\p{Script=Han}/u) // true
```

It's called [Unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) and already avaliable in [Chrome 64, Firefox 79, Safari 11.1 and Node.js 10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#browser_compatibility).

[All avaliable scripts here](https://www.regular-expressions.info/unicode.html).

## Netlify Redirects (Domains)

_2020/02/20_

On [Netlify](https://netlify.com), you can setup multiple domains for a site. When you add a custom domain, the `xxx.netlify.app` is still accessable. Which would potentially cause some confusion to users. In that way, you can setup the redirection in your `netlify.toml` file, for example:

```toml
[[redirects]]
  from = "https://vueuse.netlify.app/*"
  to = "https://vueuse.org/:splat"
  status = 301
  force = true
```

- `*` and `:splat` mean it will redirect all the sub routes as-is to the new domain.
- `force = true` specifing it will always redirect even if the request page exists.

## Netlify Redirects (Site names)

_2020/02/20_

Unlike domain redirection, sometimes you would need to rename the Netlify subdomain name (a.k.a site name), for example `xxx.netlify.app` to `yyy.netlify.app`. After you do the rename, people visiting `xxx.netlify.app` will receive a 404. And since you no longer have controls over `xxx.netlify.app`, you can't just setup a redirect in your new site.

A solution here is to create a new site with your original name `xxx` and upload the redirection rules. In this case, we can have `netlify.toml` like this:

```toml
[[redirects]]
  from = "*"
  to = "https://yyy.netlify.app/:splat"
  status = 301
  force = true
```

Note you don't have to link a repo to that, Netlify offers a great feature that [let you drag and drop for static files and serve as a site](https://app.netlify.com/drop). So you can just save `netlify.toml` and upload it, rename the site to your original name. The redirection is done!
