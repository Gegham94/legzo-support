import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";
import { echoInit } from "@/services/websockets";
import { userData } from "@/store/modules/types";

export interface DataInfo<T> {
  accessToken: string;
  expires: T;
  refreshToken: string;
  roles?: Array<string>;
  user?: userData;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

export function getToken(): DataInfo<number> {
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}

export function setToken(data: DataInfo<Date>) {
  let expires = 0;
  const { accessToken, refreshToken } = data;

  expires = new Date(data.expires).getTime();
  const cookieString = JSON.stringify({ accessToken, expires });

  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString);

  function setSessionKey(roles: Array<string>) {
    useUserStoreHook().setUserData(data.user);
    storageSession().setItem(sessionKey, {
      accessToken,
      refreshToken,
      expires,
      roles
    });
  }

  if (data.roles) {
    const { roles } = data;
    setSessionKey(roles);
  } else {
    const roles =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? [];
    setSessionKey(roles);
  }

  if (window.Echo) {
    window.Echo.connector.pusher.config.auth.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    echoInit();
  }
}

export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
