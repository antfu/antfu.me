<script setup lang="ts">
import { getStarsRankingUrl } from '../logics/getStarsRanking'
</script>

<template>
  <a :href="getStarsRankingUrl()" target="_blank">All projects sort by Stars</a>
</template>
