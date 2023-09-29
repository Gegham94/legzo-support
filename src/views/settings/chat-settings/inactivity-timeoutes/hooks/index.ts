import { RequestResult } from "@/api/interfaces";
import { ChatTimeoutes } from "@/api/settings/interfaces";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import { onMounted, ref } from "vue";

export function useInactivityTimeoutes() {
  const dataLoading = ref(true);
  const isActionsActive = ref(false);

  const isTransferChacked = ref(true);
  const transferMinutes = ref(10);

  const isInactiveChecked = ref(true);
  const inactiveMinutes = ref(12);

  const isCloseChecked = ref(true);
  const closeMinutes = ref(15);

  const params = ref({
    chat_timeout_transfer: 10,
    chat_timeout_inactive: 12,
    chat_timeout_close: 15
  });

  const onChangeCheckbox = () => {
    isActionsActive.value = true;
  };

  const onChangeInput = () => {
    isActionsActive.value = true;
  };

  const saveChanges = () => {
    if (!isTransferChacked.value) {
      delete params.value.chat_timeout_transfer;
    }
    if (!isInactiveChecked.value) {
      delete params.value.chat_timeout_inactive;
    }
    if (!isCloseChecked.value) {
      delete params.value.chat_timeout_close;
    }
    setCHatTimeoutesParams();
  };

  const discardChanges = () => {
    transferMinutes.value = params.value.chat_timeout_transfer;
    inactiveMinutes.value = params.value.chat_timeout_inactive;
    closeMinutes.value = params.value.chat_timeout_close;
  };

  const getCHatTimeoutesParams = async () => {
    try {
      dataLoading.value = true;
      const { data } = await http.get<void, RequestResult<ChatTimeoutes>>(
        "/settings/chat-settings"
      );
      params.value = data;
      transferMinutes.value = params.value.chat_timeout_transfer;
      inactiveMinutes.value = params.value.chat_timeout_inactive;
      closeMinutes.value = params.value.chat_timeout_close;
      return data;
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const setCHatTimeoutesParams = async () => {
    try {
      dataLoading.value = true;
      await http.put<void, RequestResult<ChatTimeoutes>>(
        "/settings/chat-settings",
        { params }
      );
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  onMounted(() => {
    getCHatTimeoutesParams().catch();
  });

  return {
    dataLoading,
    isActionsActive,
    isTransferChacked,
    isInactiveChecked,
    isCloseChecked,
    transferMinutes,
    inactiveMinutes,
    closeMinutes,
    saveChanges,
    discardChanges,
    onChangeInput,
    onChangeCheckbox
  };
}
