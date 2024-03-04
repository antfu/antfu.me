export const code1 = `
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    count: 1
  }),
  computed: {
    double() {
      return this.count * 2
    }
  },
})
</script>
`.trim()

export const code2 = `
<script setup>
import { ref, computed } from 'vue'

const count = ref(1)
const double = computed(() => count.value * 2)
</script>
`.trim()
