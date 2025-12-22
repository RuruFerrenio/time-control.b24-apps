import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/app',
    name: 'settings',
    component: () => import('./components/Settings.vue'),
  },
  {
    path: '/placements/chat-sidebar',
    name: 'chat-sidebar-calc',
    component: () => import('./components/Calculator.vue'),
  },
  {
    path: '/placements/chat-panel',
    name: 'chat-panel-calc',
    component: () => import('./components/Calculator.vue'),
  },
  {
    path: '/placements/task-sidebar',
    name: 'task-sidebar-calc',
    component: () => import('./components/Calculator.vue'),
  },
  {
    path: '/placements/task-tab',
    name: 'task-tab-calc',
    component: () => import('./components/Calculator.vue'),
  },
];

export default routes;