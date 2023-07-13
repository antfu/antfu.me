---
title: pnpm on External disk
date: 2023-07-13T12:00:00Z
lang: en
duration: 1min
type: note
---

If you tried to use [pnpm](https://pnpm.io/) to install a project on an external disk, it may not work right away because pnpm is heavily relying on symlinks, which doesn't work cross mount points. To workaround this, you can add the following config to your `.npmrc`:

```ini
package-import-method=copy
prefer-symlinked-executables=false
```

This will make pnpm copy the files instead of symlinking them. And expose the executables in `node_modules/.bin` correctly.
