import { MockMethod } from "vite-plugin-mock";

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "Permission",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "PermissionPage",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "PermissionButton",
        roles: ["admin", "common"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
      }
    }
  ]
};

export default [
  {
    url: "/getAsyncRoutes/mock",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter]
      };
    }
  }
] as MockMethod[];
