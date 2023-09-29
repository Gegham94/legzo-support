export default {
  path: "/archives",
  name: "Archives",
  redirect: "/archives",
  meta: {
    icon: "clock",
    title: "Archives",
    rank: 3
  },
  children: [
    {
      path: "/archives",
      name: "Archives",
      component: () => import("@/views/chats/archive/index.vue"),
      meta: {
        title: "Archives"
      }
    }
  ]
} as RouteConfigsTable;
