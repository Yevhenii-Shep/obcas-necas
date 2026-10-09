<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { formatDate, type Article } from '../data/articles'
matchMedia('(prefers-reduced-motion: reduce)').matches
defineProps<{ latest: Article[] }>()
const photo = `${import.meta.env.BASE_URL}img/zobor.webp`

const SHIFT = 0.4
const hero = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)
let raf = 0

function update() {
  raf = 0
  if (!hero.value || !img.value) return
  const h = hero.value.offsetHeight
  const t = Math.min(Math.max(window.scrollY / h, 0), 1)
  img.value.style.transform = `translate3d(0, ${SHIFT * h * t * t}px, 0)`
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => { if (!reduce) { update(); window.addEventListener('scroll', onScroll, { passive: true }) } })
onUnmounted(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
</script>

<template>
  <section ref="hero" class="hero">
    <img ref="hero" :src="photo" alt="Vysielač na vrchu Zobor nad Nitrou" />
    <div class="hero-title">
      <h1>Občas Nečas</h1>
      <p>univerzitný web študentov UKF</p>
    </div>
    <div class="hero-news">
      <RouterLink
        v-for="a in latest" :key="a.slug"
        :to="{ name: 'article', params: { year: a.year, month: a.month, slug: a.slug } }"
      >
        <span class="kicker">{{ a.category }}</span>
        <h3>{{ a.title }}</h3>
        <span class="date">{{ formatDate(a.date) }}</span>
      </RouterLink>
    </div>
  </section>
</template>
