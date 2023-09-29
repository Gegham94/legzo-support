import { GetAgent } from "@/api/agents/interfaces";
import { RequestResult } from "@/api/interfaces";
import { TrafficFilter, TrafficFilterParams } from "@/api/traffic/interfaces";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { computed, onMounted, ref } from "vue";

export function useAssignedAgentHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is");
  const selectIsValue = ref([]);
  const selectIsNotValue = ref([]);
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

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is":
        selectIsNotValue.value = [];
        params.value = {
          assignedAgentIs: [...selectIsValue.value],
          key: "is"
        };
        break;
      case "is_not":
        selectIsValue.value = [];
        params.value = {
          assignedAgentIsNot: [...selectIsNotValue.value],
          key: "is not"
        };
        break;
    }
    filter.value = {
      id: "assigned-agent",
      label: "Assigned agent",
      icon: "agent",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsValue.value.length === 0 && selectIsNotValue.value.length === 0
    );
  });

  onMounted(() => {
    getListAgents().catch();
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsValue,
    selectIsNotValue,
    agentList,
    filter
  };
}
