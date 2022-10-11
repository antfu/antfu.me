---
title: Why I don't use Prettier
date: 2022-10-01T00:00:00Z
lang: en
duration: 12min
description: The reason why I don't use Prettier in my projects.
---

[[toc]]

> [中文 Chinese Version](/posts/why-not-prettier-zh)

I have started writing this post multiple times but never ended up posting it. I wasn't able to figure out a proper way to express my position about Prettier. But this time, I think I should try harder to explain that for future reference.

First of all, I am not against Prettier. Actually, **I love it**.

## I Love Prettier

[Prettier](https://prettier.io/) is a great tool, and it saved me a lot of time. I appreciated the efforts of the maintainers and contributors to make it possible and formed a great foundation of how the clean code would look for the community. I have to confess that the title is a bit clickbait. I use Prettier a lot for interactive documentation and playgrounds, like [VueUse](https://github.com/vueuse/vueuse/blob/c7dd1a48471d0a8b4f2b5a567baa12c24504eaee/scripts/utils.ts#L36-L46) and [UnoCSS](https://github.com/unocss/unocss/blob/7c332f235aff2045addb60c2668331a3ccfd1359/packages/inspector/client/composables/usePrettify.ts). I love it for the out-of-box support of a lot of languages. I could make the generated code pretty with less than 5 mins of integrating Prettier.

## But, Why Not?

If you have ever come across my open source projects, you might find that I rarely use Prettier to format the source code. In this post, I would try to explain the reason why I made this decision:

### It's Opinionated

Prettier describes itself to be ["an opinionated code formatter"](https://github.com/prettier/prettier).

**Opinionated** essentially means it's not for everyone. Prettier makes a lot of hard-coded decisions to provide a minimal configuration interface. That makes it very easy to use (it's excellent!) and the code consistent across projects. However, on the other hand, it also means you are losing the ability to have fine-grained tweaks to how your code should look like.

While I love most of Prettier's decisions, it sometimes makes you upset when you find something you don't want and don't have a workaround.

### The Line Wrapping Noise

The main thing that itches me a lot is the auto wrapping / unwrapping based on the length of the code. Prettier has the concept of [`printWidth`](https://prettier.io/docs/en/options.html#print-width), which constrains each line to fit with a certain width (by default, it's 80 characters). It's generally great to have the code fitting in one screen and avoid horizontal scrolls.

However, I often found it hurting the readability and git diffing.

[@patak_dev](https://twitter.com/patak_dev) recently brought up an example of that in PR reviewing:

<Tweet>
<p lang="en" dir="ltr">Formatters are awesome, especially when doing PR reviews. They also introduce issues though, for example when an addition triggers a line break. The diff isn&#39;t showing what changed here. It would be great if diff viewers would be Prettier-aware, counting line breaks as spacing. <a href="https://t.co/ZuApmctllU">pic.twitter.com/ZuApmctllU</a></p>&mdash; patak (@patak_dev) <a href="https://twitter.com/patak_dev/status/1575784199767859200?ref_src=twsrc%5Etfw">September 30, 2022</a>
</Tweet>

Sometimes when you modify a string literal in JavaScript that may make the line a bit longer than the value of `printwidth`, Prettier will force wrapping the line. It breaks the inline diffing and make the changes hard to review. Imagine in another pull request, we might reduce the string a bit shorter, Prettier will then unwrap the lines back to one line. Back and forth, it creates a lot of unnecessary noises.


The following image shows another example:

<a href="https://prettier.io/playground/#N4Igxg9gdgLgprEAuc0DOMAEBXNcBOamAvJgNoA6UmmwOe+AkgCZKYCMANPQVAIYBbOGwogAggBsAZgEs4mAMJ98QiTJh9RmAL6cqNOrgIs2AJm5H8-ISJABxGf0wAlCGgAWfKFt37aPJlZMAGYLBmthTFEAZXdsAHNMADk+ACNsHz1qf0sTTAAWMN5BSNFnPncBL0wAMXw+Bky-QwY8gFYiqxLbABU3d3kAGQBPbFSEJuyW4yCANk6I22iCeJkIZJkJCCllSYBdAG4qEE4QCAAHGDWoNGRQZXwIAHcABWUEW5Q+CSe+YdvTql6mAANZwGDREqDRxwZA7CR4QHAsEQ858MCOeLIGD4bBwU5wATjZjMODMQZeeLYPjxOA1CAqPgwK5QLFfbAwCAnEDuGACCQAdXc6jgaDRYDgyxu6hkADd1MNkOA0ACQI4GDAXvV4lU4d9ESAAFZoAAe0UxEjgAEVsBB4HqEfiQGjCAQlak0nAJNzzvhHDABTJmDB3Mh8uZnY88AL6uclb7RQRZbDTgBHW3wLUXT4gBoAWigcDJZO5+Dg6ZkZa1NN1SHhBrwAhk2NxTrQFutGdhdf1To0qUDwdDSAjOL4m0xCggAlrIFFbW5Rh6aU+9adsrxjCgpNg0TAfsuYm30Rgw0tDrw2m0QA" target="_blank">
<img src="/images/prettier-print-width.png" scale-110 block m="b--5!" />
</a>

<sup><em>The 42 of `printWidth` is made up for demonstration, but it happens in any `printWidth`</em></sup>

On the left is the input code and on the right is the output of Prettier. I don't need to point out but you probably already have the answer of which one is "more pretty". From my point of view, Prettier follows the rule too strict. And in fact it makes the code much harder to read and modify, violating the initial goal of formating - to make the code more readable.

The real pain point is that this behavior is not optional. **You can't disable it completely**([#3468](https://github.com/prettier/prettier/issues/3468)). Increasing the `printWidth` only delays the circumstance and will affect other files that you didn't touch. The only workaround you can do is to use `// prettier-ignore`, which to me, the "all or nothing" choice loses the point of using Prettier in the first place.

### Mess with ESLint

Prettier as a code formatter, only cares about code styles but not the logic. Thus we see it's quite common for projects to use ESLint along with Prettier to also check the logic. If you have ever configured that yourself, you might notice there are some functionality overlaps between them - ESLint can also lint for code styles. The common practice is to use [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) to disable those overlaps rules in ESLint (there are also [a few other solutions](https://prettier.io/docs/en/integrating-with-linters.html)).

However, the approach creates quite a lot of mess to me:

<Tweet conversation="none">
<p lang="en" dir="ltr">My points here:<br><br>1. Prettier Only is cool - It&#39;s out-of-box.<br>2. If you need to use ESLint, it can do the formatting as good as Prettier - and more configurable</p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1279149211523538944?ref_src=twsrc%5Etfw">July 3, 2020</a>
</Tweet>

<Tweet conversation="none">
<p lang="en" dir="ltr">3. Prettier + ESLint still needs a lot of configs - It doesn&#39;t make your life easier.<br>4. You can have full control in ESLint but not in Prettier, mixing them together feels weird.<br>5. I don&#39;t think parsing two times can be faster (maybe I am wrong)</p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1279149212974776320?ref_src=twsrc%5Etfw">July 3, 2020</a>
</Tweet>

[ESLint's auto fix](https://developer.ibm.com/articles/auto-fix-and-format-your-javascript-with-eslint/) could also do the formatting just as well as Prettier - with much more freedom of choices.

## Alternatives

ESLint is essential to my workflow to ensure the code quality. If ESLint is already capable of doing formatting, the best solution for me is to use it in one go.

I spent some time configuring my ESLint and made it a config preset:

<GitHubLink repo="antfu/eslint-config" name="@antfu/eslint-config" />

It turns out, the setup configuration can also be very minimal:

```bash
npm i -D @antfu/eslint-config
```
```json
// .eslintrc
{
  "extends": "@antfu"
}
```

That's all you need. With the IDE extensions, it's also possible to trigger auto fixing on save. It works similarly to Prettier but respects your choices when to break the lines, with many best practices of linting. Oh, of course, it's also very opinionated towards my needs. But maybe, it could be a good reference for you to create your own version.

## Wrapping Up

This post is only trying to explain my personal experience and opinions. Of course, you can have different views and don't need to agree with me at all. I am not blaming Prettier for this. Different tools have different purposes and focuses, and there is no better or worse. It's just about using the right tools for the right circumstances. I will still be a happy user of Prettier in usages that I don't need the maximum customizability, and using ESLint exclusively for my projects' source code.

Hope this could make myself clear and maybe give you some insights. Cheers!


