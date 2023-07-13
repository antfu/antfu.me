---
title: Netlify Redirects
date: 2021-02-20T16:00:00Z
lang: en
duration: 5min
type: note
---

## Domains Redirects

On [Netlify](https://netlify.com), you can setup multiple domains for a site. When you add a custom domain, the `xxx.netlify.app` is still accessible. Which would potentially cause some confusion to users. In that way, you can setup the redirection in your `netlify.toml` file, for example:

```toml
[[redirects]]
  from = "https://vueuse.netlify.app/*"
  to = "https://vueuse.org/:splat"
  status = 301
  force = true
```

- `*` and `:splat` mean it will redirect all the sub routes as-is to the new domain.
- `force = true` specifying it will always redirect even if the request page exists.

## Site Names Redirects

_2021/02/20_

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
