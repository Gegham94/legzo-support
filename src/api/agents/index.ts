import { http } from "@/utils/http";
import { ManagerStatusResult } from "./interfaces";

export const setManagerStatus = (status: number) => {
  return http.request<ManagerStatusResult>(
    "put",
    `/managers/user/status/${status}`
  );
};
