import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { computed, ref } from "vue";

export function useIpAddressHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("current_ip_address");
  const selectCurrentIpAddressValue = ref(null);
  const selectSpecificIpAddressValue = ref("");
  const ipRegex =
    /^(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}\.\*\.(\d{1,3}|\*)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}|\d{1,3}-(\d{1,3}|\*)\.\d{1,3}\.\d{1,3})$/;
  const errorMessage = ref("");

  const getCurrentIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      selectCurrentIpAddressValue.value = data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "current_ip_address":
        selectSpecificIpAddressValue.value = "";
        errorMessage.value = "";
        getCurrentIpAddress();
        params.value = {
          ip: [selectCurrentIpAddressValue.value],
          key: "My current IP address"
        };
        break;
      case "specific_ip_address":
        selectCurrentIpAddressValue.value = null;
        errorMessage.value = ipRegex.test(
          selectSpecificIpAddressValue.value.trim()
        )
          ? ""
          : "Invalid IP address";

        params.value = {
          ip: [selectSpecificIpAddressValue.value],
          key: "Specific IP address or range"
        };
        break;
    }
    filter.value = {
      id: "ip",
      label: "IP address",
      icon: "earth",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectSpecificIpAddressValue.value === "" &&
      errorMessage.value !== "" &&
      selectCurrentIpAddressValue.value === null
    );
  });

  return {
    isInputsEmpty,
    radioValue,
    selectCurrentIpAddressValue,
    selectSpecificIpAddressValue,
    errorMessage,
    filter
  };
}
