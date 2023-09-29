import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/managers/login/mock",
    method: "post",
    response: ({ body }) => {
      if (body.email === "admin@admin.net") {
        return {
          success: true,
          data: {
            email: "admin@admin.net",
            roles: ["admin"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      } else {
        return {
          success: true,
          data: {
            email: "common",
            roles: ["common"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      }
    }
  }
] as MockMethod[];
