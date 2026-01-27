const routes = [
  {
    path: '/app',
    name: 'home',
    component: () => import('./components/TimeList.vue'),
    redirect: () => {
      // Проверяем режим из window.bitrixData
      if (window.bitrixData && window.bitrixData.mode === 'alerta') {
        return '/presence-check'
      }
      return '/time-list'
    }
  },
  {
    path: '/time-list',
    name: 'time-list',
    component: () => import('./components/TimeList.vue'),
  },
  {
    path: '/workday-statistics',
    name: 'workday-statistics',
    component: () => import('./components/WorkDayStatistics.vue'),
    props: (route) => ({
      userId: route.query.userId || null
    })
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./components/Settings.vue'),
  },
  {
    path: '/presence-check',
    name: 'presence-check',
    component: () => import('./components/PresenceCheck.vue'),
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
    component: () => import('./components/Guide.vue')
  }
];

export default routes;