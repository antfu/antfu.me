<script setup lang="ts">
defineProps<{
  options: readonly string[] | number[]
  titles?: string[]
  classes?: string[]
}>()

const value = defineModel<string | number>('modelValue', {
  type: [String, Number],
})
</script>

<template>
  <fieldset flex="~ wrap gap-1 justify-center" of-hidden text-xs>
    <label
      v-for="i, idx of options" :key="i"
      relative hover:bg-hex-8881 px-1.5 py-0.8
      border="~ base rounded"
      :class="[
        i === value ? 'bg-[#8883]' : '',
      ]"
      :title="titles?.[idx]"
    >
      <div
        :class="[
          i === value ? '' : 'op40',
          titles?.[idx] ? '' : 'capitalize',
          classes?.[idx] || '',
        ]"
      >{{ titles?.[idx] ?? i }}</div>
      <input
        v-model="value" type="radio" :value="i"
        :title="titles?.[idx]"
        absolute inset-0 op-0.1
      >
    </label>
  </fieldset>
</template>
