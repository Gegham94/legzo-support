import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { computed, ref } from "vue";

export function useLastPageTitleHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is_exactly");
  const selectIsExactlyValue = ref("");
  const selectIsNotValue = ref("");
  const selectContainsValue = ref("");
  const selectDoseNotContainsValue = ref("");
  const selectHasAnyValue = ref("");

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is_exactly":
        selectIsNotValue.value = "";
        selectContainsValue.value = "";
        selectDoseNotContainsValue.value = "";
        selectHasAnyValue.value = "";
        params.value = {
          lastPageIsExactly: [selectIsExactlyValue.value],
          key: "is exactly"
        };
        break;
      case "is_not":
        selectIsExactlyValue.value = "";
        selectContainsValue.value = "";
        selectDoseNotContainsValue.value = "";
        selectHasAnyValue.value = "";
        params.value = {
          lastPageIsNot: [selectIsNotValue.value],
          key: "is not"
        };
        break;
      case "contains":
        selectIsExactlyValue.value = "";
        selectIsNotValue.value = "";
        selectDoseNotContainsValue.value = "";
        selectHasAnyValue.value = "";
        params.value = {
          lastPageContains: [selectContainsValue.value],
          key: "contains"
        };
        break;
      case "does_not_contains":
        selectIsExactlyValue.value = "";
        selectIsNotValue.value = "";
        selectContainsValue.value = "";
        selectHasAnyValue.value = "";
        params.value = {
          lastPageDoesNotContains: [selectDoseNotContainsValue.value],
          key: "does not contains"
        };
        break;
      case "has_any_value":
        selectIsExactlyValue.value = "";
        selectIsNotValue.value = "";
        selectContainsValue.value = "";
        selectDoseNotContainsValue.value = "";
        selectHasAnyValue.value = "has-any";
        params.value = {
          lastPageHasAnyValue: [selectHasAnyValue.value],
          key: "has any value"
        };
        break;
    }
    filter.value = {
      id: "last-page-title",
      label: "Last page title",
      icon: "earth",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsExactlyValue.value === "" &&
      selectIsNotValue.value === "" &&
      selectContainsValue.value === "" &&
      selectDoseNotContainsValue.value === "" &&
      selectHasAnyValue.value === ""
    );
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsExactlyValue,
    selectIsNotValue,
    selectContainsValue,
    selectDoseNotContainsValue,
    filter
  };
}
