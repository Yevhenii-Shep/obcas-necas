import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ArticleView from './views/ArticleView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    // rovnaký tvar adresy ako na pôvodnom webe: /2026/09/nazov-clanku/
    { path: '/:year(\\d{4})/:month(\\d{2})/:slug', name: 'article', component: ArticleView, meta: { solid: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
