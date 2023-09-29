export default {
  path: "/reports",
  redirect: "/reports/chats/total",
  meta: {
    icon: "histogram",
    title: "Reports",
    rank: 13,
    roles: [1]
  },
  children: [
    {
      path: "/reports/chats",
      name: "reports-chats",
      redirect: "/reports/chats/total",
      meta: {
        title: "Chats"
      },
      children: [
        {
          path: "/reports/chats/total",
          name: "chats-total",
          component: () => import("@/views/reports/chats/total/index.vue"),
          meta: {
            title: "Total chats"
          }
        },
        {
          path: "/reports/chats/tags",
          name: "chats-tags",
          component: () => import("@/views/reports/chats/tags/index.vue"),
          meta: {
            title: "Tags usage"
          }
        },
        {
          path: "/reports/chats/satisfaction",
          name: "chats-satisfaction",
          component: () =>
            import("@/views/reports/chats/satisfaction/index.vue"),
          meta: {
            title: "Chat satisfaction"
          }
        },
        {
          path: "/reports/chats/duration",
          name: "chats-duration",
          component: () => import("@/views/reports/chats/duration/index.vue"),
          meta: {
            title: "Chat duration"
          }
        }
      ]
    },
    {
      path: "/reports/agents",
      name: "reports-agents",
      redirect: "/reports/agents/performance",
      meta: {
        title: "Agents"
      },
      children: [
        {
          path: "/reports/agents/performance",
          name: "agents-performance",
          component: () =>
            import("@/views/reports/agents/performance/index.vue"),
          meta: {
            title: "Agents performance"
          }
        },
        {
          path: "/reports/agents/activity",
          name: "agents-activity",
          component: () => import("@/views/reports/agents/activity/index.vue"),
          meta: {
            title: "Agent activity"
          }
        },
        {
          path: "/reports/agents/chat-response-times",
          name: "agents-chat-response-times",
          component: () =>
            import("@/views/reports/agents/chat-response-times/index.vue"),
          meta: {
            title: "Chat response times"
          }
        }
      ]
    }
  ]
} as RouteConfigsTable;
