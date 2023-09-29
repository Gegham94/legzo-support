import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { computed, ref } from "vue";

export function useNumberOfVisitsHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is_exactly");
  const selectIsExactlyValue = ref(1);
  const selectIsNotValue = ref(1);
  const selectIsGreaterThanValue = ref(1);
  const selectIsGreaterOrEqualValue = ref(1);
  const selectIsLessThanValue = ref(1);
  const selectIsLessOrEqualValue = ref(1);
  const selectIsBetweenFromValue = ref(1);
  const selectIsBetweenToValue = ref(1);

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is_exactly":
        selectIsNotValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsExactly: [selectIsExactlyValue.value],
          key: "is exactly"
        };
        break;
      case "is_not":
        selectIsExactlyValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsNot: [selectIsNotValue.value],
          key: "is not"
        };
        break;
      case "is_greater_than":
        selectIsExactlyValue.value = 1;
        selectIsNotValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsGreaterThan: [selectIsGreaterThanValue.value],
          key: "is greater than"
        };
        break;
      case "is_greater_or_equal":
        selectIsExactlyValue.value = 1;
        selectIsNotValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsGreaterOrEqual: [selectIsGreaterOrEqualValue.value],
          key: "is greater than or equal to"
        };
        break;
      case "is_less_than":
        selectIsExactlyValue.value = 1;
        selectIsNotValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsLessThan: [selectIsLessThanValue.value],
          key: "is less than"
        };
        break;
      case "is_less_or_equal":
        selectIsExactlyValue.value = 1;
        selectIsNotValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsBetweenFromValue.value = 1;
        selectIsBetweenToValue.value = 1;
        params.value = {
          numberVisitsIsLessOrEqual: [selectIsLessOrEqualValue.value],
          key: "is less than or equal to"
        };
        break;
      case "is_between":
        selectIsExactlyValue.value = 1;
        selectIsNotValue.value = 1;
        selectIsGreaterThanValue.value = 1;
        selectIsGreaterOrEqualValue.value = 1;
        selectIsLessThanValue.value = 1;
        selectIsLessOrEqualValue.value = 1;
        params.value = {
          numberVisitsIsBetween: [
            selectIsBetweenFromValue.value,
            selectIsBetweenToValue.value
          ],
          key: "is between"
        };
        break;
    }
    filter.value = {
      id: "number-of-visits",
      label: "Number of visits",
      icon: "visits",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsExactlyValue.value === 0 &&
      selectIsNotValue.value === 0 &&
      selectIsGreaterThanValue.value === 0 &&
      selectIsGreaterOrEqualValue.value === 0 &&
      selectIsLessThanValue.value === 0 &&
      selectIsLessOrEqualValue.value === 0 &&
      !selectIsBetweenFromValue.value &&
      !selectIsBetweenToValue.value
    );
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsExactlyValue,
    selectIsNotValue,
    selectIsGreaterThanValue,
    selectIsGreaterOrEqualValue,
    selectIsLessThanValue,
    selectIsLessOrEqualValue,
    selectIsBetweenFromValue,
    selectIsBetweenToValue,
    filter
  };
}
