---
title: Color Scheme for VS Code
date: 2021-03-01T16:00:00Z
lang: en
duration: 2min
type: note
---

There is currently no API to access colors of current theme in VS Code Extensions, nor the meta information of them. It frustrated me for a long while, until today I came up with a dirty but working solution.

Since most of the themes follow the conversions of having `Light` or `Dark` in their names. Then we can have:

```ts
import { workspace } from 'vscode'

export function isDarkTheme() {
  const theme = workspace.getConfiguration()
    .get('workbench.colorTheme', '')

  // must be dark
  if (theme.match(/dark|black/i) != null)
    return true

  // must be light
  if (theme.match(/light/i) != null)
    return false

  // IDK, maybe dark
  return true
}
```

Simple, but surprisingly, it works really well. This is used for my [Browse Lite](https://github.com/antfu/vscode-browse-lite) extension to inject the preferred color schema matching with VS Code's theme. And also [Iconify IntelliSense for VS Code](https://github.com/antfu/vscode-iconify) to update icons color with the theme.
