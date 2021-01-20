<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes()
</script>

<template lang="pug">
p {{routes}}
</template>
