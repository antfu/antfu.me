---
title: About Yak Shaving
date: 2021-05-19T16:00:00.000+00:00
lang: en
duration: 10min
---

[[toc]]

> [中文原文 Original in Chinese](/posts/about-yak-shaving-zh)

I recently visited Zhihu occasionally and saw many questions about how to start open source, or how to make open source projects successful. I kinda had similar doubts for a long time, so I thought that maybe I could share some of my rough views on this.

If you don't know me, I am a team member of Vue, Vite, wenyan-lang, WindiCSS, Intlify, and the author of VueUse, Slidev, Type Challenges and i18n Ally. I also have some small open source tools under my personal GitHub account, you can have a look at my [full project list](https://antfu.me/projects). Since I started doing open source in earnest almost two years ago, even though those contributions aren't that impressive, they still managed to allow me to [work full-time on open source development and maintenance through sponsorships](https://twitter.com/antfu7/status/1362676666221268995).

Many people probably gonna tell you that the success of a project depends on opportunity, marketing, branding, or documentation, ecosystem, technical innovation, code quality, etc. All of these are indeed important, but for me, the most important thing is the motivation to start a project and the drive to do it well. For me, the best way to get the power is via Yak Shaving.

## Yak Shaving

[Yak Shaving](https://americanexpress.io/yak-shaving) refers to a series of actions when you're working on one task and then you find another task that's not finished, you tackle that one first, and while you're working on that one, you find another task to do... and so forth, so that you stray from the work that should have been done, and end up not getting nothing finished. Here is a real-world example:

> You want to bake an apple pie, so you head to the kitchen.<br>
> In the hallway, you notice some paint chipping on the wall.<br>
> So you walk to the hardware store for some paint.<br>
> On the way, you pass a bakery and stop in for a cupcake.<br>
> While eating the cupcake, you feel a pain in your mouth. It’s that cavity that you’ve been putting off.<br>
> You pick up your phone to call the dentist to make an appointment, but you see a notification from your friend Cher, who’s having a party.<br>
> You don’t want to show up empty-handed, so you stop for a bottle of wine…

An example that more relevant to developers might be: You planned to write a blog today, but you found out none of the existing tools are good enough for you. Then you spend a month writing your own static website generator, but end up with the generator unfinished and forgetting about writing the blog.

I guess we all had similar experiences more or less. Yak Shaving usually refers to something negative, emphasizing inattentiveness or lack of clarity of purpose. But I kinda think it's also an important source of motivation for many things. When a person needs a tool, they are most motivated to solve it and make it happen. I, not coincidentally, am an obsessive Yak Shaving fan.

Maybe I'll share some of my stories with you to give you a better idea of what I'm trying to express:

## The story of how I started doing open source

In my senior year of college, I went on a graduation trip to the Philippines with a group of college friends. Because of the various problems of exchanging foreign currency, an operation down to Taiwan dollars, US dollars, Philippine pesos and different exchange rates each time, making the record of public accounts and settlement very complicated. After we came back from the trip, we came up with the idea of making an app to solve this problem.

To make the app reach a large enough audience, multilingual internationalization is something we have to consider. As there are many foreign language departments in our college, we thought we could use our resources to get our friends to help on translating the App into multiple languages. However, it is obviously unrealistic to have foreign language students write JSON with bare hands, so we had to find something a little easier. Luckily, I found [`think2011/vscode-vue-i18n`](https://github.com/think2011/vscode-vue-i18n), which looks great, but lacks some features we needed. So I contacted the author and got fork permission, and then, here comes the [i18n Ally](https://github.com/lokalise/i18n-ally) project.

The later stage of App development coincided with the Composition API RFC of Vue 3. The new API seemed to solve many of the pain points in our development. In the spirit of experimentation, we installed the Vue 2 plugin and started to try it out. In the process of using it, we found out there are quite some functions we are commonly used, and also inspired by [`react-use`](https://github.com/streamich/react-use), I extracted them out and made [VueUse](https://github.com/vueuse/vueuse).

Given that Vue 3 was still in Alpha at the time, and the community needs to gradually migrate from Vue 2 to Vue 3 for a long time in the future. I made VueUse intentionally as a universal library for Vue 2 and Vue 3 so that people could migrate seamlessly. The initial solution was to publish two packages for Vue 2 and 3 under different npm tags. As Vue 3 matured, more and more libraries wanted to go the same way to reduce the cost of maintaining two codebases at the same time. Then I thought, maybe I can find a general solution from VueUse, so that everyone could get benefit from it. And then, [`vue-demi`](https://github.com/vueuse/vue-demi) comes out. As a result, it also allows VueUse to publish one version that supports both Vue 2 and 3 at the same time.

VueUse's support for Vue 2 relies on the [`@vue/composition-api`](https://github.com/vuejs/composition-api) library, at some point, there are some inconsistencies in the plugin with the latest Vue 3 changes. Which results in VueUse's development being hampered. After a quite long time of no response to the PR from the repository, I thought I might be able to help out a bit, so I posted [an issue](https://github.com/vuejs/composition-api/issues/343) in the repository saying I would like to volunteer myself maintaining the project. And that's also the opportunity for me to join the Vue team.

In the end, our App didn't work out, but I gained a lot of valuable experience solving problems and working on open source projects along the way. i18n Ally started out as a vue-i18n specific extension and now supports over 20 major frameworks, with over 60,000 downloads of VS Code. VueUse started as a simple toolset and now it becomes a GitHub Organization with 10 members and 8 ecosystem packages.

I could probably tell stories like these for a whole day, and behind almost every project there is such a motivation to try to solve a certain problem. After all of this harangue, the point I'm trying to make is that Yak Shaving can be a great engine for progressing when used properly.

And here are my methods of how to make Yak Shaving a good thing:

## Shave the Good Yak

### Identify Problems

I spent every day of my four years in college thinking if I could make an interesting open source project that everyone needed and live as a full-time open sourceror with freedom. The difference is that the four years I was thinking about how to make something that other people wanted, but later I was solving **the actual problems that I encountered**. As said, when you need a tool, you have the most motivation to make it. And also as a user, you know the best where the pain points and needs are. When you encounter this problem, others might have just encountered a similar one.

### Solve the Problem

The most basic rule to start trying to solve a problem is to look for existing solutions, if the problem has been well solved, which meets your all needs, then just use it. Reinventing wheels might be a good way to learn, but since the wheels are already there, there has to be someone thinking about how to build a car, right?

When you find that there is no solution to the problem, or that the existing solutions don't work for you, while you have a great idea in your mind. Congratulations, you've found a great Yak.

### Good Enough

The most important part of making Yak Shaving great is to **just be good enough** -- do not have too much expectation, if the idea is verified feasible, make it just good enough; if the idea does now work, don't be discouraged, just throw it away, maybe one day you can pick it back up again with new ideas. It's not necessary to be perfect at the beginning. You don't have to draw a grand blueprint or plan, you don't have to set a huge goal of how many stars or how many users - you are doing it for yourself, and make it just good enough to solve your own problems. The important thing is to not spending too much time on a single idea, and get back to what you should have been doing in time.

### Refine the Project

As the first user of your own product, you will find a lot of things for improvement in the process of using it, go and modify it from time to time and do some improvements. If you got more time, you can add a README describing the problems you encountered and the motivation for doing the project, which may be helpful to someone who faced similar problems.

In the end, when using the project makes you feel that it's a pretty good idea, while you have completed the work that should have been done, you may wish to spend some time writing a document, improve the implementations, and promote a little. It's best if it has been recognized, but if not, just treat it as an exercise, and at least you've your own problems solved. If the responses went well, then someone will start to raise issues and send PRs. Which more enhancements and features coming, you will also gradually find the future direction of the project. Besides that, those changes and enhancements from the community may end up being a better solution to the problems you encountered at the beginning.

### Identify More Problems

The way to find more problems is simple, learn more and try more. In the process of solving and improving the problem, you will likely find new problems that could potentially be solved. Issues from the community can also help you find more inspiration. Anyway, congratulations on entering the positive cycle!

## Wrapping Up

Hopefully, this insight could give you some inspiration on solving your own problems, or making a good open source product, in one way or another.

I also recommend some awesome Yak Shaving masters, maybe their projects and experiences can give you some inspiration as well:

- [Sindre Sorhus](https://github.com/sindresorhus) - actively maintains 1100+ npm packages, Webpack and Babel both rely on 100+ of his packages
- [TJ Holowaychuk](https://github.com/tj) - Author of koa, mocha, express, etc.
- [Luke Edwards](https://github.com/lukeed) - Author of polka, uvu, klona, etc.
- [Egoist](https://github.com/egoist) - Author of poi, cac, saber, etc.
- [Hiroki Osame](https://github.com/privatenumber) - Author of esbuild-loader, vue-2-3, etc.

Cheers, and happy hacking!
