<script setup lang="ts">
import { computed } from "vue";
import { formatDate, type Article } from "../data/articles";

const props = defineProps<{ article: Article; index: number }>();
const hue = computed(() => 200 + ((props.index * 23) % 70));
</script>

<template>
  <RouterLink
    class="card"
    :to="{
      name: 'article',
      params: { year: article.year, month: article.month, slug: article.slug },
    }"
  >
    <img
      v-if="article.image"
      class="photo"
      :src="article.image"
      alt=""
      loading="lazy"
    />
    <div
      v-else
      class="photo"
      :style="{
        background: `linear-gradient(135deg, hsl(${hue} 55% 28%), hsl(${hue + 25} 40% 14%))`,
      }"
    />
    <div class="card-text">
      <span class="kicker">{{ article.category }}</span>
      <h3>{{ article.title }}</h3>
      <span class="date">{{ formatDate(article.date) }}</span>
    </div>
  </RouterLink>
</template>
