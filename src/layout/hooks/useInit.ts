import { onMounted, watch } from "vue";
import {
  echoInit,
  listenManagerIdChannel,
  listenManagersChannel,
  listenRoomsChannel
} from "@/services/websockets";
import { random } from "lodash";
import { useAgentsStoreHook } from "@/store/modules/agents";
import { useGroupsStoreHook } from "@/store/modules/groups";
import { storeToRefs } from "pinia";
import { useRoomsStoreHook } from "@/store/modules/rooms";
import { useUserStoreHook } from "@/store/modules/user";
import { deviceDetection } from "@pureadmin/utils";
import { useAppStoreHook } from "@/store/modules/app";

export function useInit() {
  const roomStore = useRoomsStoreHook();
  const usersStore = useUserStoreHook();
  const agentsStoreHook = useAgentsStoreHook();
  const groupsStoreHook = useGroupsStoreHook();
  const { getRooms } = storeToRefs(roomStore);
  const { getUser } = storeToRefs(usersStore);
  const isMobile = deviceDetection();

  watch(
    getRooms,
    newVal => {
      newVal?.map(room => {
        setTimeout(() => {
          listenRoomsChannel(room.id);
        }, random(100, 300));
      });
    },
    { deep: true }
  );

  watch(
    getUser,
    (newVal, oldValue) => {
      if (!window.Echo) {
        echoInit();
      }

      if (newVal !== oldValue && newVal.id) {
        listenManagersChannel();
        listenManagerIdChannel(newVal.id);
      }
    },
    { deep: true }
  );

  function toggle(device: string, bool: boolean) {
    useAppStoreHook().toggleDevice(device);
    useAppStoreHook().toggleSideBar(bool, "resize").catch();
  }

  onMounted(async () => {
    await usersStore.fetchUserInfo();
    await roomStore.fetchRooms().catch();
    await groupsStoreHook.fetchGroupsList().catch();

    if (getUser.value.role === 1) {
      await agentsStoreHook.fetchAgentsList().catch();
    }

    if (isMobile) {
      toggle("mobile", false);
    }
  });

  return {
    toggle,
    isMobile
  };
}
