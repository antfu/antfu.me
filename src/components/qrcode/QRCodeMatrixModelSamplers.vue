<script setup lang="ts">
const x = ref(0)
const y = ref(0)

const checkpoints = [
  'Breakdomain',
  'CetusMix',
  'Counterfeit',
  'DarkSushiMix',
  'ScMix',
]

const samplers = [
  'Euler a',
  'Euler',
  'LMS',
  'DPM2',
  'DPM2 a',
  'DPM++ 2S a',
  'DPM++ 2M',
  'DPM++ SDE',
  'DPM++ 2M SDE',
  'DPM fast',
  'DPM adaptive',
  'LMS Karras',
  'DPM2 Karras',
  'DPM2 a Karras',
  'DPM++ 2S a Karras',
  'DPM++ 2M Karras',
  'DPM++ SDE Karras',
  'DPM++ 2M SDE Karras',
  'DDIM',
  'PLMS',
]
</script>

<template>
  <div border="~ base rounded-lg" flex="~ col md:row" w-100 max-w-full md:max-w-none md:w-auto mxa my2 of-hidden md:mx--5>
    <ImageMatrix
      v-model:x="x"
      v-model:y="y"
      flex-none
      mya
      md:w-90
      md:h-90
      src="/images/ai-qrcode-101-xyz-samplers.webp"
      :x-count="samplers.length"
      :y-count="checkpoints.length"
      :x-padding="[(7000 - 6746) / 7000, 0]"
      :y-padding="[(1738 - 1687) / 1738, 0]"
      :aspect-ratio="1"
      :external-link="true"
    />
    <div flex="~ col gap-5" p4 text-center>
      <div flex="~ col gap-2">
        <div text-sm>
          Samplers
        </div>
        <QRCodeOptionsSelect
          v-model="x"
          :options="Array.from({ length: samplers.length }, (_, i) => i)"
          :titles="samplers"
        />
      </div>
      <div flex="~ col gap-2">
        <div text-sm>
          Checkpoints
        </div>
        <QRCodeOptionsSelect
          v-model="y"
          :options="Array.from({ length: checkpoints.length }, (_, i) => i)"
          :titles="checkpoints"
        />
      </div>
    </div>
  </div>
</template>
