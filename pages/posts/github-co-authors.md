---
title: GitHub Co-authors
date: 2021-08-24T16:00:00Z
lang: en
duration: 2min
type: note
---

You might found GitHub sometimes shows you a commit with multiple authors. This is commonly happening in squashed pull requests when multiple people are involved with the reviewing and made suggestions or changes. In that situation, GitHub will automatically inject the [`Co-authored-by:`](https://docs.github.com/en/github/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors) to the commit message. This is a great way to give contributors credits while keeping the commit history clean.

Note that the format is like `Co-authored-by: name <name@example.com>`, normally GitHub will fill that for you so you don't need to worry about that, but if you want to add it manually, you have to get the email addresses of the contributors. But how do you know their emails?

Well, technically you can indeed find their email by multiple ways, but actually, you don't need to. The easiest way is to copy their user id and append with [`@users.noreply.github.com`](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/setting-your-commit-email-address#about-commit-email-addresses) that provided by GitHub automatically, for example:

```
Co-authored-by: antfu <antfu@users.noreply.github.com>
```
