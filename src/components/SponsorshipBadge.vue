<script setup lang="ts">
const props = withDefaults(defineProps<{
  amount: number | string
  currency?: string
  recurring?: boolean
}>(), {
  currency: 'USD',
  recurring: false,
})

const formattedAmount = computed(() => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: props.currency,
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(Number(props.amount)))

const label = computed(() => `${formattedAmount.value} ${props.recurring ? 'monthly' : 'one-time'} sponsorship`)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-pink-500/10 bg-pink-500/5 px-1.5 py-0.75 align-middle text-sm text-pink-600 font-condensed leading-none tracking-wide dark:text-pink-300"
    :aria-label="label"
    :title="label"
  >
    <span class="font-600 tabular-nums">{{ formattedAmount }}</span>
    <span v-if="props.recurring" class="op65">/mo</span>
  </span>
</template>
