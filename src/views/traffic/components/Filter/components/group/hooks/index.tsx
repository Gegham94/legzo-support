import { GetGroup } from "@/api/groups/interfaces";
import { RequestResult } from "@/api/interfaces";
import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { computed, onMounted, ref } from "vue";

export function useGroupHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is");
  const selectIsValue = ref([]);
  const selectIsNotValue = ref([]);
  const groupList = ref([]);

  const getListGroups = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetGroup[]>>(
        "/admin/groups"
      );
      groupList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is":
        selectIsNotValue.value = [];
        params.value = {
          groupIs: [...selectIsValue.value],
          key: "is"
        };
        break;
      case "is_not":
        selectIsValue.value = [];
        params.value = {
          groupIsNot: [...selectIsNotValue.value],
          key: "is not"
        };
        break;
    }
    filter.value = {
      id: "group",
      label: "Group",
      icon: "group",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsValue.value.length === 0 && selectIsNotValue.value.length === 0
    );
  });

  onMounted(() => {
    getListGroups().catch();
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsValue,
    selectIsNotValue,
    groupList,
    filter
  };
}
