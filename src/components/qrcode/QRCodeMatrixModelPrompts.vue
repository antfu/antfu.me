<script setup lang="ts">
const x = ref(0)
const y = ref(0)

const checkpoints = [
  '9527',
  'AnythingV5',
  'aZovya',
  'Breakdomain',
  'Breakdomain Realistic',
  'CetusMix',
  'ChilloutMix',
  'ColorfulMix',
  'CornflowerX',
  'Counterfeit',
  'Daclcefo',
  'DarkSushiMix',
  'EtherRealMix',
  'Expmix',
  'nostalyakiMix',
  'NostoxjbMix',
  'revAnimated',
  'ScMix',
  'tmndMix',
]

const prompts = [
  'white lace',
  'flowers',
  'spray',
  'waves',
  'snow',
  'feather',
  'building',
  'color contrast',
  'panorama',
  'wide shot',
  'closeup',
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
      src="/images/ai-qrcode-101-xyz-prompts.webp"
      :x-count="prompts.length"
      :y-count="checkpoints.length"
      :x-padding="[0.0644444444, 0]"
      :y-padding="[0.0146262189, 0]"
      :aspect-ratio="1"
      :external-link="true"
    />
    <div flex="~ col gap-5" p4 text-center>
      <div flex="~ col gap-2">
        <div text-sm>
          Prompts
        </div>
        <QRCodeOptionsSelect
          v-model="x"
          :options="Array.from({ length: prompts.length }, (_, i) => i)"
          :titles="prompts"
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
