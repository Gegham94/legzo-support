import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { computed, ref } from "vue";

export function useReturningCustomerHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is_true");

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is_true":
        params.value = {
          returningCustomer: true,
          key: "is true"
        };
        break;
      case "is_false":
        params.value = {
          returningCustomer: false,
          key: "is false"
        };
        break;
    }
    filter.value = {
      id: "returning-customer",
      label: "Returning customer",
      icon: "returning",
      used: true,
      isOpen: true,
      params: params.value
    };
    return false;
  });

  return {
    isInputsEmpty,
    radioValue,
    filter
  };
}
