import { onMounted, ref } from "vue";
import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { FormInstance } from "element-plus";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetGroup } from "@/api/groups/interfaces";
import { message } from "@/utils/message";

export function useHooks() {
  const reportStore = useReportStore();
  const { filters } = storeToRefs(reportStore);

  const ruleFormRef = ref<FormInstance>();
  const dataList = ref([]);

  const getListData = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetGroup[]>>(
        "/managers/tags"
      );
      dataList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  onMounted(() => {
    getListData().catch();
  });

  return {
    dataList,
    filters,
    ruleFormRef
  };
}
