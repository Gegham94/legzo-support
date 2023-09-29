import { GetCountry } from "@/api/country/interfaces";
import { RequestResult } from "@/api/interfaces";
import { TrafficFilterParams, TrafficFilter } from "@/api/traffic/interfaces";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { computed, onMounted, ref } from "vue";

export function useCountryHooks() {
  const params = ref<TrafficFilterParams>(null);
  const filter = ref<TrafficFilter>(null);
  const radioValue = ref("is");
  const selectIsValue = ref([]);
  const selectIsNotValue = ref([]);
  const countryList = ref([]);

  const getListCountries = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetCountry[]>>(
        "/managers/lists/country_codes"
      );
      countryList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  const isInputsEmpty = computed(() => {
    switch (radioValue.value) {
      case "is":
        selectIsNotValue.value = [];
        params.value = {
          countryIs: [...selectIsValue.value],
          key: "is"
        };
        break;
      case "is_not":
        selectIsValue.value = [];
        params.value = {
          countryIsNot: [...selectIsNotValue.value],
          key: "is not"
        };
        break;
    }
    filter.value = {
      id: "country",
      label: "Country",
      icon: "location",
      used: true,
      isOpen: true,
      params: params.value
    };
    return (
      selectIsValue.value.length === 0 && selectIsNotValue.value.length === 0
    );
  });

  onMounted(() => {
    getListCountries().catch();
  });

  return {
    isInputsEmpty,
    radioValue,
    selectIsValue,
    selectIsNotValue,
    countryList,
    filter
  };
}
