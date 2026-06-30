<template>
  <figure
    class="screenshot-figure"
    :style="{
      ...(width ? { maxWidth: width } : {}),
      ...(center ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
    }"
  >
    <img :src="withBase(src)" :alt="alt" loading="lazy" decoding="async" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  src: string
  alt: string
  caption?: string
  width?: string
  center?: boolean
}>()
</script>
