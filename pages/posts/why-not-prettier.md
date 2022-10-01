---
title: Why I don't Use Prettier
date: 2022-10-01T16:00:00Z
lang: en
duration: 12min
description: The reason why I don't use Prettier in my projects.
---

[[toc]]

I have started writing this post multiple times but never ended up posting it. I wasn't able to figure out a proper way to express my position about Prettier. But this time, I think I should try harder to explain that for future reference.

First of all, I am not against Prettier. Actually, **I love it**.

## I Love Prettier

[Prettier](https://prettier.io/) is a great tool, and it saved me a lot of time. I appreciated the efforts of the maintainers and contributors to make it possible and formed a great foundation of how the clean code would look for the community. I have to confess that the title is a bit clickbait. I use Prettier a lot for interactive documentation and playgrounds, like [VueUse](https://github.com/vueuse/vueuse/blob/c7dd1a48471d0a8b4f2b5a567baa12c24504eaee/scripts/utils.ts#L36-L46) and [UnoCSS](https://github.com/unocss/unocss/blob/7c332f235aff2045addb60c2668331a3ccfd1359/packages/inspector/client/composables/usePrettify.ts). I love it for the out-of-box support of a lot of languages. I could make the generated code pretty with less than 5 mins of integrating Prettier.

## But, Why Not?

If you have ever come across my open source projects, you might find that I rarely use Prettier to format the source code. In this post, I would try to explain the reason why I made this decision:

### It's Opinionated

Prettier describes itself to be ["an opinionated code formatter"](https://github.com/prettier/prettier). **Opinionated** essentially means it's not for everyone. Prettier makes a lot of hard-coded decisions to provide a minimal configuration interface. That makes it very easy to use (it's excellent!) and the code consistent across projects. However, on the other hand, it also means you are losing the ability to have fine-grained tweaks to how your code should look like. While I love most of Prettier's decisions, it sometimes makes you upset when you find something you don't like and don't have a workaround.

### The Line Wrapping Noise

The main thing that itches me a lot is the auto wrapping / unwrapping based on the length of the code. Prettier has the concept of [`printwidth`](https://prettier.io/docs/en/options.html#print-width), which constrains each line to fit with a certain width (by default, it's `80` characters). It's great to make the code fit into one screen and avoid horizontal scrolls.

However, I often found it hurting the readability and git differing.

[@patak_dev](https://twitter.com/patak_dev) recently brought up an example of that in PR reviewing:

<Tweet>
<p lang="en" dir="ltr">Formatters are awesome, especially when doing PR reviews. They also introduce issues though, for example when an addition triggers a line break. The diff isn&#39;t showing what changed here. It would be great if diff viewers would be Prettier-aware, counting line breaks as spacing. <a href="https://t.co/ZuApmctllU">pic.twitter.com/ZuApmctllU</a></p>&mdash; patak (@patak_dev) <a href="https://twitter.com/patak_dev/status/1575784199767859200?ref_src=twsrc%5Etfw">September 30, 2022</a>
</Tweet>

Sometimes when you modify a string literal in JavaScript that may make the line width a bit beyond the `printwidth`, Prettier will force wrap the line. It breaks the inline diffing and make the changes hard to review. Imagine in another pull request, we might deduce the string a bit down, Prettier will unwrap the lines back to one line. Back and forth, it creates a lot of unnecessary noises.

The real pain point is that this is behavior is not optional. **You can't disable it completely** ([#3468](https://github.com/prettier/prettier/issues/3468)). Increasing the `printwidth` only delays the circumstance and will affect other files that you didn't touch.

The following image shows another example:

![](/images/prettier-print-width.png)

On the left is the input code and on the right is the output of Prettier. It follows the rule too strict, and actually makes the code much harder to read and modify, violating the initial goal of making the code more readable. (the 42 of `printWidth` is made up for demonstration, but it happens in any `printWidth`).

Again, the sad part is that this isn't optional. The only workaround you can do is to use `// @prettier-ignore`, which to me, loses the point of using Prettier in the first place. To make myself clear, I am not blaming Prettier for this. It's just that their opinion is not aligning with my needs.

### Mess with ESLint

Prettier as a code formatter, only cares about code styles but not the logic. Thus we see it's quite common for projects to use ESLint along with Prettier to also check the logic. If you have ever configured that yourself, you might notice there are some functionality overlaps between them - ESLint can also lint for code styles. The common practice is to use [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) to disable those overlaps rules in ESLint (Note that this is actually [NOT recommended by Prettier](https://prettier.io/docs/en/integrating-with-linters.html#notes) either).

To me, this approach creates quite a lot of mess:

<Tweet>
<p lang="en" dir="ltr">3. Prettier + ESLint still needs a lot of configs - It doesn&#39;t make your life easier.<br>4. You can have full control in ESLint but not in Prettier, mixing them together feels weird.<br>5. I don&#39;t think parsing two times can be faster (maybe I am wrong)</p>&mdash; Anthony Fu (@antfu7) <a href="https://twitter.com/antfu7/status/1279149212974776320?ref_src=twsrc%5Etfw">July 3, 2020</a>
</Tweet>

While on the other hand, ESLint could also do the formatting just as well as Prettier - with even more freedom of choice.

## Alternatives

ESLint is essential for me to ensure the code quality. Since ESLint is capable of doing formatting, the best choice for me is to use it exclusively in one go. Thus I have spent some time configuring my ESLint and made it a config preset.

<GitHubLink repo="antfu/eslint-config" name="@antfu/eslint-config" />

It turns out, the setup configuration can also be very minimal:

```bash
npm i -D @antfu/eslint-config
```
```json
// .prettierrc
{
  "extends": "@antfu"
}
```

That's all you need. It works similarly to Prettier but respects your choices when to break the lines, with many best practices of linting. Oh, of course, it's also very opinionated towards my needs. But maybe, it could be a good reference for you to create your own version.

## Wrapping Up

This post is only trying to explain my personal experience and opinions. Of course, you can have different views and don't need to agree with me at all. Tools have different purposes and focuses, and there is no better or worse. It's just about using the right tools for the right circumstances. I will still be a happy user of Prettier in usages that I don't need maximum customizbility, and keep using ESLint exclusively for project source code.

Hope this could make myself clear and maybe give you some insights. Cheers!


