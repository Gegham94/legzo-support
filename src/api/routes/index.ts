import { http } from "@/utils/http";
import { Result } from "./interfaces";

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/getAsyncRoutes");
};
