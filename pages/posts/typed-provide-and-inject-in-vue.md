---
title: Typed Provide and Inject in Vue
date: 2021-03-05T16:00:00Z
lang: en
duration: 8min
---

I didn't know that you can type `provide()` and `inject()` elegantly until I watched [Thorsten Lünborg](https://github.com/LinusBorg/)'s talk on [Vue Amsterdam](https://vuejs.amsterdam/).

The basic idea here is the Vue offers a type utility `InjectionKey` will you can type a Symbol to hold the type of your injection values. And when you use `provide()` and `inject()` with that symbol, it can infer the type of provider and return value automatically.

For example:

```ts
// context.ts
import type { InjectionKey } from 'vue'

export interface UserInfo {
  id: number
  name: string
}

export const InjectKeyUser: InjectionKey<UserInfo> = Symbol()
```

```ts
// parent.vue
import { provide } from 'vue'
import { InjectKeyUser } from './context'

export default {
  setup() {
    provide(InjectKeyUser, {
      id: '117', // type error: should be number
      name: 'Anthony',
    })
  },
}
```

```ts
// child.vue
import { inject } from 'vue'
import { InjectKeyUser } from './context'

export default {
  setup() {
    const user = inject(InjectKeyUser) // UserInfo | undefined

    if (user)
      console.log(user.name) // Anthony

  },
}
```

See [the docs](https://v3.vuejs.org/api/composition-api.html#provide-inject) for more details.
