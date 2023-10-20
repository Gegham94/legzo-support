import { ref } from "vue";
import { useArchiveRoomsStore } from "@/store/modules/archiveRooms";
import { storeToRefs } from "pinia";
import { FormInstance } from "element-plus";

export function useHooks() {
  const reportStore = useArchiveRoomsStore();
  const { filters } = storeToRefs(reportStore);

  const ruleFormRef = ref<FormInstance>();
  const dataList = [
    { label: "Any rating", code: 0 },
    { label: "Not rated", code: 1 },
    { label: "Rated bad", code: 2 },
    { label: "Rated good", code: 3 },
    { label: "Rated & commented", code: 4 },
    { label: "Rated bad & commented", code: 5 },
    { label: "Rated good & commented", code: 6 }
  ];

  return {
    dataList,
    filters,
    ruleFormRef
  };
}
