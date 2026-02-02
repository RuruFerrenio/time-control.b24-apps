const routes = [
  {
    path: '/app',
    name: 'home',
    component: () => import('./components/TimeList.vue'),
    redirect: () => {
      const modeMap = {
        'alerta': '/presence-check',
        'activity-report': '/activity-report',
        'default': '/time-list'
      }

      console.log('params route')
      console.log(window.bitrixData)

      const mode = window.bitrixData?.mode
      return modeMap[mode] || modeMap.default
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
    path: '/activity-report',
    name: 'activity-report',
    component: () => import('./components/ActivityReport.vue'),
    props: (route) => ({
      parameters: window.bitrixData || null
    })
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('./components/Guide.vue')
  }
];

export default routes;