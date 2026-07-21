<template>
  <div v-if="showPagination" :class="props.class">
    <a v-if="canFirst" :href="firstUrl">First</a>
    <a v-if="canPrev" :href="prevUrl">Previous</a>
    <template v-for="page in items" :key="page">
      <span v-if="page === currentPage">{{ page }}</span>
      <a v-else :href="getUrl(page)">{{ page }}</a>
    </template>
    <a v-if="canNext" :href="nextUrl">Next</a>
    <a v-if="canLast" :href="lastUrl">Last</a>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { usePagination } from '@stephenchenorg/astro/pagination-vue-server-side'

const props = withDefaults(defineProps<{
  total: number
  perPage?: number
  visiblePages?: number
  currentPage?: number
  url: string
  class?: HTMLAttributes['class']
}>(), {
  currentPage: 1,
})

const {
  items,
  showPagination,
  canFirst,
  canPrev,
  canNext,
  canLast,
  firstUrl,
  prevUrl,
  nextUrl,
  lastUrl,
  getUrl,
} = usePagination({
  total: props.total,
  perPage: props.perPage,
  visiblePages: props.visiblePages,
  currentPage: props.currentPage,
  url: props.url,
})
</script>
