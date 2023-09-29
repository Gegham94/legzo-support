import { TrafficFilter, TrafficFilterParams } from "@/api/traffic/interfaces";
import { computed, ref } from "vue";

export function useActivityHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is");
  const selectIsValue = ref([]);
  const selectIsNotValue = ref([]);
  const activityForm = ref([
    { label: "Supervised", value: "Supervised" },
    { label: "Chatting", value: "Chatting" },
    { label: "Queued", value: "Queued" },
    { label: "Inactive", value: "inactive" }
  ]);

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is":
        selectIsNotValue.value = [];
        params.value = {
          activityIs: [...selectIsValue.value],
          key: "is"
        };
        break;
      case "is_not":
        selectIsValue.value = [];
        params.value = {
          activityIsNot: [...selectIsNotValue.value],
          key: "is not"
        };
        break;
    }
    filter.value = {
      id: "activity",
      label: "Activity",
      icon: "chart",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsValue.value.length === 0 && selectIsNotValue.value.length === 0
    );
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsValue,
    selectIsNotValue,
    activityForm,
    filter
  };
}
