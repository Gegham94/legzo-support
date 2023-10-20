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
import { SortBy, TableV2SortOrder } from "element-plus";

export function useHooks() {
  const reportStore = useReportStore();
  const dataLoading = ref(true);
  const sort = ref("email");
  const reportHook = useReportHook();

  const sortBy = ref<SortBy>({
    key: "email",
    order: TableV2SortOrder.ASC
  });
  const onSort = (_sortBy: SortBy) => {
    sortBy.value = _sortBy;
    handleSort(sortBy.value.key);
  };

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
              method: method,
              sort: sort.value
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

  const getTotalCurrentDateCurrentGroup = async () => {
    fetchPerformanceTotal(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        groups: getCurrentGroups.value
      },
      "getTotalCurrentDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsPerformanceCurrentDateCurrentGroup(data);
    });
  };
  const getCurrentDateCurrentGroup = async () => {
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

  const getTotalCompareDateCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      return;
    }

    fetchPerformanceTotal(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        groups: getCurrentGroups.value
      },
      "getTotalCompareDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsPerformanceCompareDateCurrentGroup(data);
    });
  };

  const getCompareDateCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      return;
    }

    fetchPerformance(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        groups: getCurrentGroups.value
      },
      "getCompareDateCurrentGroup"
    ).then(data => {
      reportHook.setAgentsDetailsCompareDateCurrentGroup(data);
    });
  };

  const getData = () => {
    getTotalCurrentDateCurrentGroup().catch();
    getTotalCompareDateCurrentGroup().catch();
    getCurrentDateCurrentGroup().catch();
    getCompareDateCurrentGroup().catch();
  };

  const handleSort = data => {
    const currentSorts = sort.value?.split(",");
    const isSortAsc = currentSorts.indexOf(data);
    const isSortDesc = currentSorts.indexOf(`-${data}`);

    if (isSortAsc > -1) {
      currentSorts[isSortAsc] = `-${data}`;
      sort.value = currentSorts.join(",");
    } else if (isSortDesc > -1) {
      currentSorts[isSortDesc] = data;
      sort.value = currentSorts.join(",");
    } else {
      sort.value = data;
    }
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

  watch([sort], async (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      getCurrentDateCurrentGroup().catch();
      getCompareDateCurrentGroup().catch();
    }
  });

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
    dataLoading,
    handleSort,
    onSort,
    sortBy
  };
}
