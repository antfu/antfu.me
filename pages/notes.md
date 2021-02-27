---
title: Notes - Anthony Fu
display: Notes
subtitle: Quick notes / tips
description: Quick notes / tips
---

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
