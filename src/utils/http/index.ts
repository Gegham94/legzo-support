import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";
import { getToken, formatToken } from "@/utils/auth";
import { sessionTime, useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { isEmpty } from "lodash";
import Cookies from "js-cookie";
const { VITE_BASE_URL } = import.meta.env;

const defaultConfig: AxiosRequestConfig = {
  baseURL: VITE_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  private static requests = [];

  private static isRefreshing = false;

  private static initConfig: PureHttpRequestConfig = {};

  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig) => {
        NProgress.start();
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        const whiteList = ["/refreshToken", "/login"];
        return whiteList.some(v => config.url.indexOf(v) > -1)
          ? config
          : new Promise(resolve => {
              const data = getToken();

              if (data) {
                const now = new Date().getTime();
                const difference = JSON.parse(Cookies.get(sessionTime));
                const expired = parseInt(data.expires) - now + difference <= 0;

                if (expired) {
                  if (!PureHttp.isRefreshing) {
                    PureHttp.isRefreshing = true;
                    useUserStoreHook()
                      .handRefreshToken({ refreshToken: data.refreshToken })
                      .then(res => {
                        const token = res.data.accessToken;
                        config.headers["Authorization"] = formatToken(token);
                        PureHttp.requests.forEach(cb => cb(token));
                        PureHttp.requests = [];
                      })
                      .catch(error => {
                        console.log("refresh error", error);
                        useUserStoreHook().logOut();
                      })
                      .finally(() => {
                        PureHttp.isRefreshing = false;
                      });
                  }
                  resolve(PureHttp.retryOriginalRequest(config));
                } else {
                  config.headers["Authorization"] = formatToken(
                    data.accessToken
                  );
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        const total = response.headers["x-total-count"];
        const $data = { ...response.data, total: total ? Number(total) : 0 };

        NProgress.done();
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return $data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return $data;
        }
        return $data;
      },
      (error: PureHttpError) => {
        if (error.response?.status === 401) {
          useUserStoreHook().clearAuthData();
        }
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        NProgress.done();
        return Promise.reject($error);
      }
    );
  }

  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          if (!response?.success && !isEmpty(response?.errors?.errors)) {
            Object.keys(response.errors.errors).forEach(field => {
              response.errors.errors[field].map(error => {
                message(error, { type: "error" });
              });
            });
          }
          resolve(response);
        })
        .catch(error => {
          message(error?.message, { type: "error" });
          reject(error);
        });
    });
  }

  public getList<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }

  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }

  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  public put<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("put", url, params, config);
  }

  public delete<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("delete", url, params, config);
  }
}

export const http = new PureHttp();
