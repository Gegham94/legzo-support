import { RequestResult } from "@/api/interfaces";
import { ChatTimeoutes } from "@/api/settings/interfaces";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import { computed, onMounted, ref } from "vue";

export function useInactivityTimeoutes() {
  const dataLoading = ref(true);
  const actionsStatus = ref(false);

  let isTransferActiveLastSave = null;
  let transferMinutesLastSave = 0;
  let isInactiveActiveLastSave = null;
  let inactiveMinutesLastSave = 0;
  let isCloseActiveLastSave = null;
  let closeMinutesLastSave = 0;
  let isOverloadActiveLastSave = null;
  let overloadMinutesLastSave = 0;

  const isTransferActive = ref(null);
  const transferMinutes = ref(0);
  const isInactiveActive = ref(null);
  const inactiveMinutes = ref(0);
  const isCloseActive = ref(null);
  const closeMinutes = ref(0);
  const isOverloadActive = ref(null);
  const overloadMinutes = ref(0);

  const getActionsStatus = computed(() => {
    return actionsStatus.value;
  });

  const onChange = () => {
    if (
      isTransferActive.value === isTransferActiveLastSave &&
      transferMinutes.value === transferMinutesLastSave &&
      isInactiveActive.value === isInactiveActiveLastSave &&
      inactiveMinutes.value === inactiveMinutesLastSave &&
      isCloseActive.value === isCloseActiveLastSave &&
      closeMinutes.value === closeMinutesLastSave &&
      isOverloadActive.value === isOverloadActiveLastSave &&
      overloadMinutes.value === overloadMinutesLastSave
    ) {
      actionsStatus.value = false;
    } else {
      actionsStatus.value = true;
    }
  };

  const setDefaultValues = async () => {
    isTransferActive.value = isTransferActiveLastSave;
    transferMinutes.value = transferMinutesLastSave;

    isCloseActive.value = isCloseActiveLastSave;
    closeMinutes.value = closeMinutesLastSave;

    isInactiveActive.value = isInactiveActiveLastSave;
    inactiveMinutes.value = inactiveMinutesLastSave;

    isOverloadActive.value = isOverloadActiveLastSave;
    overloadMinutes.value = overloadMinutesLastSave;
    await onChange();
  };

  const getChatTimeoutesDefaultValues = async () => {
    try {
      dataLoading.value = true;
      const { data } = await http.get<
        ChatTimeoutes,
        RequestResult<ChatTimeoutes>
      >(`admin/settings/rooms/auto-settings`);
      data.forEach(elem => {
        switch (elem.code) {
          case "transfer_chat_time":
            isTransferActiveLastSave = elem.active;
            transferMinutesLastSave = Number(elem.value);
            break;
          case "inactive_chat_time":
            isInactiveActiveLastSave = elem.active;
            inactiveMinutesLastSave = Number(elem.value);
            break;
          case "archive_chat_time":
            isCloseActiveLastSave = elem.active;
            closeMinutesLastSave = Number(elem.value);
            break;
          case "overloaded_duration_time":
            isOverloadActiveLastSave = elem.active;
            overloadMinutesLastSave = Number(elem.value);
            break;
        }
      });
      await setDefaultValues();
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const saveChanges = async () => {
    try {
      dataLoading.value = true;
      if (
        isTransferActive.value !== isTransferActiveLastSave ||
        transferMinutes.value !== transferMinutesLastSave
      ) {
        await http.put(`admin/settings/transfer_chat_time`, {
          params: {
            active: isTransferActive.value ? 1 : 0,
            value: transferMinutes.value
          }
        });
      }

      if (
        isInactiveActive.value !== isInactiveActiveLastSave ||
        inactiveMinutes.value !== inactiveMinutesLastSave
      ) {
        await http.put(`admin/settings/inactive_chat_time`, {
          params: {
            active: isInactiveActive.value ? 1 : 0,
            value: inactiveMinutes.value
          }
        });
      }

      if (
        isCloseActive.value !== isCloseActiveLastSave ||
        closeMinutes.value !== closeMinutesLastSave
      ) {
        await http.put(`admin/settings/archive_chat_time`, {
          params: {
            active: isCloseActive.value ? 1 : 0,
            value: closeMinutes.value
          }
        });
      }

      if (
        isOverloadActive.value !== isOverloadActiveLastSave ||
        overloadMinutes.value !== overloadMinutesLastSave
      ) {
        await http.put(`admin/settings/overloaded_duration_time`, {
          params: {
            active: isOverloadActive.value ? 1 : 0,
            value: overloadMinutes.value
          }
        });
      }
      await getChatTimeoutesDefaultValues();
      message("Successfully", { type: "success" });
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  onMounted(async () => {
    await getChatTimeoutesDefaultValues();
  });

  return {
    dataLoading,
    getActionsStatus,
    isTransferActive,
    isInactiveActive,
    isCloseActive,
    transferMinutes,
    inactiveMinutes,
    isOverloadActive,
    overloadMinutes,
    closeMinutes,
    onChange,
    saveChanges,
    setDefaultValues
  };
}
