import Layout from '@/layout/index.vue'

export default [
  // 架构介绍
  {
    path: '/doc',
    component: Layout,
    name: 'document',
    meta: {
      level: 0,
      type: "Production",
      isSideBar: true,
      title: '虚拟仪表',
      icon: 'Iphone'
    },
    redirect: { path: '/document' },
    children: [
      {
        path: '/document',
        meta: {
          level: 1,
          title: '实时监测',
          icon: 'stopwatch'
        },
        component: () => import('@/view/sys_common/intro.vue')
        // component: () => import('@/view/sys_common/404.vue')
      },
    ]
  },

]

export const my_route = []

