export default {
  path: "/settings",
  redirect: "/settings/tags",
  meta: {
    icon: "setting",
    title: "Settings",
    rank: 10
  },
  children: [
    {
      path: "/settings/profile",
      name: "profile",
      component: () => import("@/views/settings/profile/index.vue"),
      meta: {
        title: "Profile"
      }
    },
    {
      path: "/settings/tags",
      name: "tags",
      component: () => import("@/views/settings/tags/index.vue"),
      meta: {
        title: "Tags"
      }
    },
    {
      path: "/settings/canned-responses",
      name: "Canned responses",
      component: () => import("@/views/settings/canned-responses/index.vue"),
      meta: {
        title: "Canned responses",
        roles: [1]
      }
    },
    {
      path: "/settings/chat-settings",
      name: "chat-settings",
      redirect: "/settings/chat-settings",
      meta: {
        title: "Chat settings"
      },
      children: [
        {
          path: "/settings/chat-settings/inactivity-timeouts",
          name: "inactivity-timeouts",
          component: () =>
            import(
              "@/views/settings/chat-settings/inactivity-timeoutes/index.vue"
            ),
          meta: {
            title: "Inactivity timeouts",
            roles: [1]
          }
        }
      ]
    },
    {
      path: "/settings/auto-messages",
      name: "Auto messages",
      component: () => import("@/views/settings/auto-messages/index.vue"),
      meta: {
        title: "Auto messages",
        roles: [1]
      }
    },
    {
      path: "/settings/forms",
      name: "forms",
      redirect: "/settings/forms/pre-chat",
      meta: {
        title: "Forms"
      },
      children: [
        {
          path: "/settings/forms/pre-chat",
          name: "pre-chat",
          component: () =>
            import("@/views/settings/forms/pre-post-chat/index.vue"),
          meta: {
            title: "Pre Chat"
          }
        },
        {
          path: "/settings/forms/post-chat",
          name: "post-chat",
          component: () =>
            import("@/views/settings/forms/pre-post-chat/index.vue"),
          meta: {
            title: "Post Chat"
          }
        }
      ]
    }
  ]
} as RouteConfigsTable;
