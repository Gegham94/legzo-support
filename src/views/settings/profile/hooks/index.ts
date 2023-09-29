import { reactive, watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { http } from "@/utils/http";
import { message } from "@/utils/message";

export function usePresenter() {
  const usersStore = useUserStoreHook();
  const { getReadyAfterLogin } = storeToRefs(usersStore);

  const form = reactive({
    readyAfterLogin: getReadyAfterLogin.value
  });

  watch(getReadyAfterLogin, async val => {
    form.readyAfterLogin = val;
  });
  const onSubmit = () => {
    http
      .put(`/managers/user`, {
        data: { params: { readyAfterLogin: form.readyAfterLogin } }
      })
      .then(() => {
        message("Successfully", { type: "success" });
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        usersStore.fetchUserInfo();
      });
  };

  return {
    form,
    onSubmit
  };
}
