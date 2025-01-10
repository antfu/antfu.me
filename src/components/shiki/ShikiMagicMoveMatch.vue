<script setup lang="ts">
import type { KeyedTokensInfo } from 'shiki-magic-move/types'
import { codeToKeyedTokens, createMagicMoveMachine } from 'shiki-magic-move/core'
import { h, renderList } from 'vue'
import { useShikiStore } from '~/store/shiki'
import { code1, code2 } from './ShikiMagicMoveDemoCode'

const shiki = useShikiStore()
const tokens1 = shallowRef<KeyedTokensInfo>()
const tokens2 = shallowRef<KeyedTokensInfo>()

const hoverKey = ref<string | null>(null)
const hoverAll = ref(false)
const hoverType = computed(() => hoverKey.value ? getKeyType(hoverKey.value) : 'none')

function getKeyType(key: string) {
  const a = tokens1.value?.tokens.find(t => t.key === key)
  const b = tokens2.value?.tokens.find(t => t.key === key)
  if (a && b)
    return 'move'
  if (a)
    return 'leave'
  if (b)
    return 'enter'
  return 'none'
}

function hoverClass(key: string) {
  if (key !== hoverKey.value && !hoverAll.value)
    return ''
  const type = getKeyType(key)
  if (type === 'move')
    return 'bg-blue:35 text-inherit!'
  if (type === 'leave')
    return 'bg-rose:35 text-inherit!'
  if (type === 'enter')
    return 'bg-green:35 text-inherit!'
  return ''
}

watch(
  () => shiki.highlighter,
  (highlighter) => {
    if (!highlighter)
      return

    const machine = createMagicMoveMachine(
      code => codeToKeyedTokens(highlighter as any, code, {
        lang: 'vue',
        theme: shiki.theme,
      }),
    )

    tokens1.value = machine.commit(code1).current
    tokens2.value = machine.commit(code2).current
  },
)

const TokenRenderer = defineComponent({
  props: {
    tokens: {
      type: Array as PropType<KeyedTokensInfo['tokens']>,
      required: true,
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    return () => h(
      'pre',
      {
        class: 'shiki border border-base relative',
        onMouseleave: () => hoverKey.value = null,
      },
      [
        renderList(props.tokens, (token) => {
          if (token.content === '\n')
            return h('br')

          return h('span', {
            'key': token.key,
            'class': [
              hoverClass(token.key),
              'transition duration-300',
              hoverAll.value ? '' : 'rounded-3px px0.5 mx--0.5',
            ],
            'data-foo': token.key,
            'style': [
              token.htmlStyle,
              {
                color: token.color,
              },
            ],
            'onMouseenter': () => hoverKey.value = token.key,
          }, token.content)
        }),
        h('div', {
          class: 'absolute top-2 right-2 op50 z-10 text-sm font-sans pointer-events-none',
        }, props.title || 'Tokens'),
      ],
    )
  },
})
</script>

<template>
  <ol>
    <li transition :class="hoverType !== 'none' && hoverType !== 'move' ? 'op50' : ''">
      <strong transition :class="hoverType === 'move' || hoverAll ? 'text-blue!' : ''">Move</strong>: The token exists in both before and after, so we just need to move it to the new position.
    </li>
    <li transition :class="hoverType !== 'none' && hoverType !== 'enter' ? 'op50' : ''">
      <strong transition :class="hoverType === 'enter' || hoverAll ? 'text-green!' : ''">Enter</strong>: The token only exists in the <strong>after</strong>, we need to animate the element entering the scene.
    </li>
    <li transition :class="hoverType !== 'none' && hoverType !== 'leave' ? 'op50' : ''">
      <strong transition :class="hoverType === 'leave' || hoverAll ? 'text-rose!' : ''">Leave</strong>: The token only exists in the <strong>before</strong>, we need to animate the element leaving the scene.
    </li>
  </ol>

  <p>
    Here is a playground for you to inspect the type of each token, hover over to inspect:
  </p>

  <div v-if="tokens1 && tokens2">
    <div
      grid="~ cols-[max-content_1fr] gap-1 gap-x-3" text-sm border="x t base" rounded-t px4 py3 ws-nowrap
      @mouseenter="hoverAll = true"
      @mouseleave="hoverAll = false"
    >
      <span>Transition Type</span>
      <div>
        <span v-if="hoverKey" class="capitalize px1 rounded" :class="hoverClass(hoverKey)">{{ getKeyType(hoverKey) }}</span>
      </div>
      <span>Key</span>
      <div>
        <span font-mono :class="hoverKey ? '' : 'op50'">{{ hoverKey || hoverAll ? '(showing all tokens)' : '(hover code to inspect)' }}</span>
      </div>
    </div>
    <TokenRenderer :tokens="tokens1?.tokens" title="Before" important-rounded-none important-my-0 important-bg-transparent />
    <TokenRenderer :tokens="tokens2?.tokens" title="After" important-rounded-t-none important-mt-0 border-t-0 important-bg-transparent />
  </div>
</template>
