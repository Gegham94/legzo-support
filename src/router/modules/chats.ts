export default {
  path: "/chats",
  name: "Chats",
  redirect: "/chats",
  meta: {
    icon: "chatLineSquare",
    title: "Chats",
    rank: 1
  },
  children: [
    {
      path: "/chats",
      name: "Chats",
      component: () => import("@/views/chats/active/index.vue"),
      meta: {
        title: "Chats"
      }
    }
  ]
} as RouteConfigsTable;
