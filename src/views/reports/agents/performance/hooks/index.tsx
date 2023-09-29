import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import {
  AgentsPerformance,
  AgentsPerformanceTotal
} from "@/store/modules/types";
import { message } from "@/utils/message";
import { onMounted, ref, watch } from "vue";
import { isEqual } from "lodash";

export function useHooks() {
  const reportStore = useReportStore();
  const dataLoading = ref(true);
  const reportHook = useReportHook();

  const {
    getCurrentDateFrom,
    getCurrentDateTo,
    getCompareDateStatus,
    getCompareDateFrom,
    getCompareDateTo,
    getCurrentGroups,
    getFilterList
  } = storeToRefs(reportStore);

  const fetchPerformance = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<AgentsPerformance>>(
          "/reports/agents/performance",
          {
            params: {
              "filters[from]": params.from / 1000,
              "filters[to]": params.to / 1000,
              "filters[groups]": params.groups,
              distribution: "days",
              tzOffset: new Date().getTimezoneOffset(),
              method: method
            }
          }
        );

        return data;
      }
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };
  const fetchPerformanceTotal = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<
          void,
          RequestResult<AgentsPerformanceTotal>
        >("/reports/agents/performance-total", {
          params: {
            "filters[from]": params.from / 1000,
            "filters[to]": params.to / 1000,
            "filters[groups]": params.groups,
            distribution: "days",
            tzOffset: new Date().getTimezoneOffset(),
            method: method
          }
        });

        return data;
      }
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const getCurrentDateCurrentGroup = async () => {
    fetchPerformanceTotal(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsPerformanceCurrentDateCurrentGroup(data);
    });

    fetchPerformance(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsDetailsCurrentDateCurrentGroup(data);
    });
  };

  const getCompareDateCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      return;
    }

    fetchPerformanceTotal(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        groups: getCurrentGroups.value
      },
      "getCompareDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsPerformanceCompareDateCurrentGroup(data);
    });

    fetchPerformance(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        groups: getCurrentGroups.value
      },
      "getCompareDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsDetailsCompareDateCurrentGroup(data);
    });
  };

  const getData = () => {
    getCurrentDateCurrentGroup().catch();
    getCompareDateCurrentGroup().catch();
  };

  watch(
    [
      getCurrentDateFrom,
      getCurrentDateTo,
      getCompareDateFrom,
      getCompareDateTo,
      getCurrentGroups
    ],
    async (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue)) {
        getData();
      }
    }
  );

  watch(getCompareDateStatus, async newValue => {
    if (!newValue) {
      reportHook.setFilterCompareDateFrom(0);
      reportHook.setFilterCompareDateTo(0);
    }
  });

  watch(getFilterList, async (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      if (!newValue.includes("group")) {
        reportHook.clearFilterGroup();
      }
    }
  });

  onMounted(() => {
    getData();
  });

  return {
    dataLoading
  };
}
