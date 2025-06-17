import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/person/:id',
      name: 'person-view',
      props: true,
      component: () => import('../views/PersonView.vue')
    },
    {
      path: '/person/create',
      name: 'person-create',
      component: () => import('../views/PersonFormView.vue')
    },
    {
      path: '/person/:id/edit',
      name: 'person-edit',
      props: true,
      component: () => import('../views/PersonFormView.vue')
    }
  ]
});

export default router;