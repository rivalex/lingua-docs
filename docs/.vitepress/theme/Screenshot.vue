<template>
  <figure class="screenshot-figure">
    <img :src="withBase(src)" :alt="alt" loading="lazy" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  src: string
  alt: string
  caption?: string
}>()
</script>

<style scoped>
.screenshot-figure {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
}

.screenshot-figure img {
  width: 100%;
  display: block;
  margin: 0;
}

.screenshot-figure figcaption {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-style: italic;
}
</style>
