import { defineStore } from "pinia";
import { store } from "@/store";
import { userType, userData } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { getLogin, getLogOut, getUserInfo, refreshTokenApi } from "@/api/auth";
import { LoginResult, RefreshTokenResult } from "@/api/auth/interfaces";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { setToken, removeToken } from "@/utils/auth";
import { useAppStoreHook } from "@/store/modules/app";
import { useRoomsStoreHook } from "@/store/modules/rooms";
import Cookies from "js-cookie";
import { echoDestroy } from "@/services/websockets";
export const sessionTime = "time-info";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    user: {
      id: "",
      status: 0,
      online: {
        id: "",
        status: 0,
        updated_at: 0
      },
      email: "",
      role: 0,
      name: "",
      avatar_link: "",
      params: {
        readyAfterLogin: null,
        maxActiveTickets: 0
      },
      created_at: 0,
      updated_at: 0,
      roleLabel: ""
    }
  }),
  getters: {
    getUser() {
      return this.user;
    },
    getCurrentUserId() {
      return this.user.id;
    },
    getOnlineStatus() {
      return this.user?.online?.status ?? 0;
    },
    getReadyAfterLogin() {
      return this.user?.params?.readyAfterLogin ?? false;
    }
  },
  actions: {
    setUserData(data: userData) {
      this.user = data;
    },
    async loginByEmail(data) {
      return new Promise<LoginResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              const differenceServerTime =
                new Date().valueOf() - new Date(data.data.serverTime).valueOf();

              Cookies.set(sessionTime, differenceServerTime.toString());
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    logOut() {
      getLogOut()
        .then(() => {
          this.clearAuthData();
        })
        .catch(() => {
          this.clearAuthData();
        });
    },
    fetchUserInfo() {
      getUserInfo()
        .then(data => {
          useUserStoreHook().setUserData(data.data.user);
        })
        .catch(() => {
          this.clearAuthData();
        });
    },
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            this.clearAuthData();
            reject(error);
          });
      });
    },
    async clearAuthData() {
      echoDestroy();
      useAppStoreHook().toggleInOnline(false);
      useRoomsStoreHook().clearData().catch();
      clearInterval(useAppStoreHook().getInOnlineInterval);
      useAppStoreHook().setInOnlineInterval(null);
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      window.Echo = null;
      this.user = {
        id: "",
        status: 0,
        online: {
          id: "",
          status: 0,
          updated_at: 0
        },
        email: "",
        role: 0,
        name: "",
        avatar_link: "",
        params: {
          readyAfterLogin: false,
          maxActiveTickets: 0
        },
        created_at: 0,
        updated_at: 0,
        roleLabel: ""
      };
      resetRouter();
      router.push("/login").catch();
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
