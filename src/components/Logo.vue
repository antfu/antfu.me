<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>


<template>
  <div v-if="route.path !== '/'" class="i-material-symbols:arrow-back-ios" />
</template>

