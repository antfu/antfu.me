---
title: Domain Email
date: 2020-06-17T16:00:00.000+00:00
lang: en
duration: 2min
type: note
---

Saw [a tweet from Evan You](https://twitter.com/youyuxi/status/1272932071749619712) about the [hey.com](https://hey.com/) mail service recently. I got interested in having a short and nice email address. My current one in Hotmail is just too long to even being spell out in talk. `hey.com` looks very nice but $99/year is not a very good deal to me. I decide to use my own domain for receiving emails.

I did this a couple years ago for another domain, I kinda remember an open-source tool allowing forwarding emails by just adding DNS record. I took some time to search for it but I didn't find the page matched with my memory. I went GitHub to search in my stared projects, it turns out the tool now becomes and Freemium SaaS [forwardemail.net](https://forwardemail.net/) with a fresh new logo and website design that I can't even recognize it.

The DNS forwarding feature just works the same, but it requires you to log in and register your domain now. I am glad it now being more well documented and charging for premium supports which can help it sustain.

The config is quite simple as usual, with just 3 DNS record:

```html
MX   @  mx1.forwardemail.net  10
MX   @  mx2.forwardemail.net  20
TXT  @  forward-email=youremail@example.com
```

That’s it! It also provides some advanced configs, you can check [the doc here](https://forwardemail.net/en/faq).

While setting up and reading the docs, I learned that you can explicitly purge the cache for [Cloudflare DNS](https://1.1.1.1/purge-cache/) and [Google DNS](https://developers.google.com/speed/public-dns/cache). That's a very good-to-know tip!

And now, you can say hi to me at [hi@antfu.me](mailto:hi@antfu.me)!
