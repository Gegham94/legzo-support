import { onMounted, ref, watch, watchEffect } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment-timezone";
import { ChatsTags, TagUsed } from "@/api/reports/interfaces";
import { isEqual, groupBy } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

const offsetUTC = Math.round(new Date().getTimezoneOffset() / 60);
moment.tz.setDefault(`${offsetUTC}:00`);

export function useHooks() {
  const totalCount = ref(0);
  const dataLoading = ref(true);
  const tableData = ref([]);
  const checkedTags = ref([]);
  const pagination = ref({
    page: 1,
    perPage: 20,
    "filter[name]": "",
    sort: "name"
  });
  const reportStore = useReportStore();
  const reportHook = useReportHook();

  const {
    getCurrentDateFrom,
    getCurrentDateTo,
    getCurrentAgents,
    getCurrentGroups,
    getTags,
    getFilterList
  } = storeToRefs(reportStore);

  const fetchTags = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<ChatsTags[]>>(
          "/reports/chats/tags",
          {
            params: {
              "filters[from]": params.from / 1000,
              "filters[to]": params.to / 1000,
              "filters[agents]": params.agents,
              "filters[groups]": params.groups,
              "filters[tags]": getTags.value,
              distribution: "days",
              tzOffset: new Date().getTimezoneOffset(),
              method: method,
              from: moment(params.from).format("DD-MM-YYYY"),
              to: moment(params.to).format("DD-MM-YYYY")
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

  const fetchTotalTags = async params => {
    try {
      dataLoading.value = true;
      if (params.from && params.to) {
        const { data, total } = await http.get<
          void,
          RequestResult<ChatsTags[]>
        >("/reports/chats/tags/total", {
          params: {
            "filters[from]": params.from / 1000,
            "filters[to]": params.to / 1000,
            ...pagination.value
          }
        });
        totalCount.value = total;
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

  const getCurrentTags = async () => {
    const series = [];
    fetchTags(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCurrentAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item => {
        return moment(item.interval).format("DD-MM-YY");
      });

      let totalTags: TagUsed[] = [];
      data?.map(item => {
        totalTags = totalTags.concat(item.tags);
      });

      const result = groupBy(totalTags, "name");

      Object.keys(result).map(key => {
        const current = result[key];

        series.push({
          name: key,
          type: "line",
          smooth: true,
          emphasis: {
            focus: "series"
          },
          data: current.map(data => data.count)
        });
      });

      reportHook.setTags({
        labels: label,
        legend: Object.keys(result),
        series: series
      });
    });
  };

  const getTotalTags = async () => {
    fetchTotalTags({
      from: getCurrentDateFrom.value,
      to: getCurrentDateTo.value
    }).then(data => {
      tableData.value = data;
      return data;
    });
  };

  const getData = () => {
    getCurrentTags().catch();
  };

  const getTotalData = () => {
    getTotalTags().catch();
  };

  const handleCheckedTags = (tag, state) => {
    if (!state) {
      const index = checkedTags.value.findIndex(n => n.name === tag.name);
      if (index !== -1) {
        checkedTags.value.splice(index, 1);
      }
      return;
    }
    checkedTags.value.push({ ...tag });
  };

  const onPageSizeChange = (size: number) => {
    pagination.value.perPage = size;
    pagination.value.page = 1;
  };

  const handleSort = (sort: string) => {
    const currentSorts = pagination.value.sort.split(",");
    const isSortAsc = currentSorts.indexOf(sort);
    const isSortDesc = currentSorts.indexOf(`-${sort}`);

    if (isSortAsc > -1) {
      currentSorts[isSortAsc] = `-${sort}`;
      pagination.value.sort = currentSorts.join(",");
    } else if (isSortDesc > -1) {
      currentSorts[isSortDesc] = sort;
      pagination.value.sort = currentSorts.join(",");
    } else {
      pagination.value.sort = sort;
    }
  };

  const onCurrentChange = (page: number) => {
    pagination.value.page = page;
  };

  watch(
    [
      getCurrentDateFrom,
      getCurrentDateTo,
      getCurrentAgents,
      getCurrentGroups,
      getTags
    ],
    async (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue)) {
        getData();
        getTotalData();
      }
    }
  );

  watch(getFilterList, async (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      if (!newValue.includes("agent")) {
        reportHook.clearFilterAgent();
      }

      if (!newValue.includes("group")) {
        reportHook.clearFilterGroup();
      }

      if (!newValue.includes("tag")) {
        reportHook.clearFilterTag();
      }
    }
  });

  watchEffect(newSomething => {
    if (newSomething.length > 0) {
      getTotalData();
    }
  });

  onMounted(() => {
    getData();
    getTotalData();
  });

  return {
    dataLoading,
    tableData,
    handleCheckedTags,
    checkedTags,
    handleSort,
    pagination,
    totalCount,
    onPageSizeChange,
    onCurrentChange
  };
}
