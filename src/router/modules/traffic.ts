export default {
  path: "/traffic",
  name: "Traffic",
  redirect: "/traffic",
  meta: {
    icon: "eleme",
    title: "Traffic",
    rank: 2
  },
  children: [
    {
      path: "/traffic",
      name: "Traffic",
      component: () => import("@/views/traffic/index.vue"),
      meta: {
        title: "Traffic"
      }
    }
  ]
} as RouteConfigsTable;
