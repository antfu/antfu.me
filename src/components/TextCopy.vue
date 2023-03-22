<script setup lang="ts">
const { copy: _copy, copied } = useClipboard()
const el = ref<HTMLElement | null>(null)

function copy() {
  _copy((el.value?.innerText || '').trim())
}
</script>

<template>
  <div ref="el" class="gap-1 items-center">
    <slot />
    <button
      title="Copy" inline ml2 op30 hover:op100 text-sm transition
      :class="copied ? 'i-carbon-checkmark text-green' : 'i-carbon-copy'" @click="copy()"
    />
  </div>
</template>
