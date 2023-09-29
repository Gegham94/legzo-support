export default {
  path: "/team",
  redirect: "/team/agents",
  meta: {
    icon: "groupLine",
    title: "Team",
    rank: 9,
    roles: [1]
  },
  children: [
    {
      path: "/team/agents",
      name: "agents",
      component: () => import("@/views/team/agents/index.vue"),
      meta: {
        title: "Agents"
      }
    },
    {
      path: "/team/groups",
      name: "groups",
      component: () => import("@/views/team/groups/index.vue"),
      meta: {
        title: "Groups"
      }
    }
  ]
} as RouteConfigsTable;
