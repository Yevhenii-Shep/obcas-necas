<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { articles, formatDate } from '../data/articles'

const route = useRoute()
const article = computed(() => articles.find((a) => a.slug === route.params.slug))
</script>

<template>
  <article v-if="article" class="article">
    <RouterLink :to="{ name: 'home', query: { rubrika: article.categorySlug } }" class="kicker">{{ article.category }}</RouterLink>
    <h1>{{ article.title }}</h1>
    <p class="meta">{{ formatDate(article.date) }} · {{ article.author }}</p>
    <img v-if="article.image" :src="article.image" alt="" />
    <div v-else class="photo big" />
    <p v-for="(p, i) in article.body" :key="i">{{ p }}</p>
  </article>
  <main v-else class="article">
    <h1>Článok sa nenašiel</h1>
    <RouterLink to="/" class="kicker">Späť na úvodnú stranu</RouterLink>
  </main>
</template>
