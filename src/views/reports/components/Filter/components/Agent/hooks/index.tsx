import { onMounted, ref } from "vue";
import { useReportStore, useReportHook } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { FormInstance } from "element-plus";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetAgent } from "@/api/agents/interfaces";
import { message } from "@/utils/message";

export function useHooks() {
  const reportStore = useReportStore();
  const { filters } = storeToRefs(reportStore);

  const ruleFormRef = ref<FormInstance>();
  const agentList = ref([]);

  const getListAgents = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetAgent[]>>(
        "/admin/users"
      );
      agentList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  const setVisible = data => {
    useReportHook().setVisible(data);
  };
  onMounted(() => {
    getListAgents().catch();
  });

  return {
    agentList,
    filters,
    setVisible,
    ruleFormRef
  };
}
