import { http } from "@/utils/http";
import { ManagerStatusResult } from "./interfaces";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";

export const setManagerStatus = (status: number) => {
  return http
    .request<ManagerStatusResult>("put", `/managers/user/status/${status}`)
    .then(() => {
      updateManagerStatusStore(status);
    })
    .catch(error => {
      console.log("Error: ", error);
    });
};

export const updateManagerStatusStore = (status: number) => {
  const usersStore = useUserStoreHook();
  const { getUser } = storeToRefs(usersStore);

  const updatedUser = getUser.value;
  updatedUser.online.status = status;
  usersStore.setUserData(updatedUser);
};
