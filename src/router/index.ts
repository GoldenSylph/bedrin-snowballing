import { createRouter, createWebHistory } from 'vue-router';
import SnowballingTracker from '@/views/SnowballingTracker.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SnowballingTracker,
    },
  ],
});

export default router;
