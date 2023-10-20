import { onMounted } from "vue";
import { useRoomsStoreHook } from "@/store/modules/archiveRooms";
export function useFilterHooks() {
  const setVisible = (data, status) => {
    if (!status) {
      useRoomsStoreHook().setVisible(data);
    } else {
      useRoomsStoreHook().setVisible("");
    }
  };

  onMounted(() => {
    useRoomsStoreHook().setVisible("");
  });

  return {
    setVisible
  };
}
