<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import { articles, mainCategories, moreCategories } from '../data/articles'
import { query } from '../state'

const BATCH = 6
const route = useRoute()
const visible = ref(BATCH)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const categoryName = computed(() =>
  [...mainCategories, ...moreCategories].find((c) => c.slug === route.query.rubrika)?.name)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return articles.filter((a) =>
    (!route.query.rubrika || a.categorySlug === route.query.rubrika) &&
    (!q || `${a.title} ${a.category}`.toLowerCase().includes(q)))
})
const shown = computed(() => filtered.value.slice(0, visible.value))
const done = computed(() => visible.value >= filtered.value.length)
const heading = computed(() => query.value.trim() ? 'Výsledky hľadania' : categoryName.value ?? 'Najnovšie')

// dotiahne ďalšie karty, kým je spodok zoznamu blízko okna
async function fill() {
  while (sentinel.value && !done.value && sentinel.value.getBoundingClientRect().top < window.innerHeight + 400) {
    visible.value += BATCH
    await nextTick()
  }
}
watch(filtered, () => { visible.value = BATCH; nextTick(fill) })
onMounted(() => {
  observer = new IntersectionObserver((e) => { if (e[0].isIntersecting) fill() }, { rootMargin: '400px' })
  if (sentinel.value) observer.observe(sentinel.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <HeroSection :latest="articles.slice(0, 4)" />
  <main>
    <h2 class="section-title">{{ heading }}</h2>
    <div class="grid">
      <ArticleCard v-for="(a, i) in shown" :key="a.slug" :article="a" :index="i" />
    </div>
    <p v-if="!filtered.length" class="note">Nenašli sme žiadny článok. Skúste iné slovo alebo rubriku.</p>
    <p v-else class="note">{{ done ? 'To je všetko, viac článkov zatiaľ nie je.' : 'Načítavam ďalšie články…' }}</p>
    <div ref="sentinel" />
  </main>
</template>
