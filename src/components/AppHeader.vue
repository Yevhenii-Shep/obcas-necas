<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mainCategories, moreCategories } from "../data/articles";
import { query } from "../state";

const route = useRoute();
const router = useRouter();
const scrolled = ref(false);
const moreOpen = ref(false);
const searchOpen = ref(false);
const input = ref<HTMLInputElement | null>(null);
const catsEl = ref<HTMLElement | null>(null);

const fitCount = ref(mainCategories.length);
const dropdown = computed(() => [
  ...mainCategories.slice(fitCount.value),
  ...moreCategories,
]);

const solid = computed(() => scrolled.value || route.meta.solid === true);

function measure() {
  const el = catsEl.value;
  if (!el) return;
  let n = 0;
  for (const k of Array.from(el.children) as HTMLElement[]) {
    if (k.offsetLeft + k.offsetWidth <= el.clientWidth) n++;
    else break;
  }
  fitCount.value = n;
}

const onScroll = () => {
  scrolled.value = window.scrollY > 40;
};
const onDocClick = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest(".more")) moreOpen.value = false;
};
let ro: ResizeObserver | null = null;
onMounted(() => {
  onScroll();
  ro = new ResizeObserver(measure);
  if (catsEl.value) ro.observe(catsEl.value);
  document.fonts?.ready.then(measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", onDocClick);
});
onUnmounted(() => {
  ro?.disconnect();
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("click", onDocClick);
});

async function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    await nextTick();
    input.value?.focus();
  } else {
    query.value = "";
  }
}
function onType() {
  if (route.name !== "home") router.push({ name: "home" });
}
</script>

<template>
  <header :class="{ solid }">
    <RouterLink to="/" class="brand" @click="query = ''"
      >Občas Nečas</RouterLink
    >
    <nav aria-label="Rubriky">
      <div ref="catsEl" class="cats">
        <RouterLink
          v-for="(c, i) in mainCategories"
          :key="c.slug"
          :to="{ name: 'home', query: { rubrika: c.slug } }"
          :class="{ off: i >= fitCount }"
          @click="query = ''"
          >{{ c.name }}</RouterLink
        >
      </div>
      <div class="more">
        <button
          type="button"
          aria-haspopup="true"
          :aria-expanded="moreOpen"
          @click="moreOpen = !moreOpen"
        >
          Viac ▾
        </button>
        <div v-if="moreOpen" class="dd">
          <RouterLink
            v-for="c in dropdown"
            :key="c.slug"
            :to="{ name: 'home', query: { rubrika: c.slug } }"
            @click="
              moreOpen = false;
              query = '';
            "
            >{{ c.name }}</RouterLink
          >
        </div>
      </div>
      <input
        v-if="searchOpen"
        ref="input"
        v-model="query"
        class="search"
        type="search"
        placeholder="Vyhľadať článok"
        aria-label="Vyhľadať článok"
        @input="onType"
        @keydown.esc="toggleSearch"
      />
      <button
        type="button"
        class="icon"
        :aria-label="searchOpen ? 'Zavrieť vyhľadávanie' : 'Vyhľadať článok'"
        @click="toggleSearch"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <template v-if="!searchOpen">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </template>
          <path v-else d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>
  </header>
</template>
