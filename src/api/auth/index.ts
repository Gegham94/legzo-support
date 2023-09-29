import { http } from "@/utils/http";
import { getToken, formatToken } from "@/utils/auth";
import { LoginResult, RefreshTokenResult, UserInfo } from "./interfaces";

export const getLogin = (data?: object) => {
  return http.request<LoginResult>("post", "/managers/login", { data });
};

export const inOnline = () => {
  return http.request<boolean>("get", "/managers/in_online");
};

export const getLogOut = () => {
  return http.request<boolean>("get", "/managers/logout");
};

export const getUserInfo = () => {
  return http.request<UserInfo>("get", "/managers/info");
};

export const refreshTokenApi = (data?: object) => {
  const token = getToken();
  return http.request<RefreshTokenResult>(
    "get",
    "/managers/refreshToken",
    { data },
    { headers: { Authorization: formatToken(token.refreshToken) } }
  );
};
