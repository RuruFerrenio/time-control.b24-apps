const routes = [
  {
    path: '/app',
    name: 'home',
    component: () => import('./components/TimeList.vue'),
    redirect: () => {
      const modeMap = {
        'alerta': '/presence-check',
        'workdaystart': '/workday-start',
        'workdayend': '/workday-end',
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
    path: '/workday-start',
    name: 'workday-start',
    component: () => import('./components/WorkdayStart.vue'),
  },
  {
    path: '/workday-end',
    name: 'workday-end',
    component: () => import('./components/WorkdayEnd.vue'),
  },
  {
    path: '/install',
    name: 'install',
    component: () => import('./components/Install.vue'),
  },
  {
    path: '/activity-report',
    name: 'activity-report',
    component: () => import('./components/ActivityReport.vue'),
    props: (route) => ({
      parameters: window.bitrixData || null
    })
  }
];

export default routes;