import Guide from './components/Guide.vue'

const routes = [
  {
    path: '/app',
    name: 'settings',
    component: () => import('./components/Settings.vue'),
  },
  {
    path: '/install',
    name: 'install',
    component: () => import('./components/Install.vue'),
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
  {
    path: '/placements/call-card',
    name: 'call-card-calc',
    component: () => import('./components/Calculator.vue'),
  },
  {
    path: '/guide',
    name: 'Guide',
    component: Guide
  }
];

export default routes;