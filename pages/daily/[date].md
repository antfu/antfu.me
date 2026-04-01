---
tabTitle: 碎记详情
---

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const date = computed(() => route.params.date as string)
</script>

<DailyDetail :date="date" />
