import { onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment";
import { ChatsTotal } from "@/api/reports/interfaces";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { defaultChatTotal } from "@/constants/common";
import { useGroupsStore } from "@/store/modules/groups";
import { useAgentsStore } from "@/store/modules/agents";

export function useHooks() {
  const dataLoading = ref(true);
  const reportStore = useReportStore();
  const reportHook = useReportHook();
  const groupsStore = useGroupsStore();
  const agentsStore = useAgentsStore();
  const { groupList } = storeToRefs(groupsStore);
  const { agentList } = storeToRefs(agentsStore);

  const {
    getCurrentDateFrom,
    getCurrentDateTo,
    getCompareDateStatus,
    getCompareDateFrom,
    getCompareDateTo,
    getCurrentAgents,
    getCompareAgentsData,
    getCompareAgentsStatus,
    getCurrentGroups,
    getCompareGroupsData,
    getCompareGroupsStatus,
    getTags,
    getCountry,
    getFilterList
  } = storeToRefs(reportStore);

  const getGroupsName = data =>
    data
      ?.map(group => groupList.value.find(item => item.id === group)?.name)
      .join(" | ");

  const getAgentsName = data =>
    data
      ?.map(agent => agentList.value.find(item => item.id === agent)?.email)
      .join(" | ");

  const getDateName = (from, to) => {
    const fromLL = moment(from).format("ll");
    const toLL = moment(to).format("ll");

    return fromLL !== toLL ? `${fromLL} - ${toLL}` : fromLL;
  };

  const fetchHours = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<ChatsTotal[]>>(
          "/reports/chats/total",
          {
            params: {
              "filters[from]": params.from / 1000,
              "filters[to]": params.to / 1000,
              "filters[agents]": params.agents,
              "filters[groups]": params.groups,
              "filters[tags]": getTags.value,
              "filters[country]": getCountry.value,
              distribution: "hour",
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
  const getHoursTotal = async () => {
    const labelX = [];
    const labelY = [];
    const hoursCount = [];

    fetchHours(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getHoursTotal"
    ).then(data => {
      let x = -1;
      let y = -1;
      let day = "";
      let maxValue = 0;
      data.forEach(item => {
        const intervalsDays = moment.unix(item.interval).format("DD-MM");
        const intervalsHour = moment.unix(item.interval).format("HH-mm");
        if (day !== intervalsDays) {
          y++;
          x = -1;
          day = intervalsDays;
          if (!labelX.includes(intervalsDays)) {
            labelX.push(intervalsDays);
          }
        } else {
          x++;
          if (!labelY.includes(intervalsHour)) {
            labelY.push(intervalsHour);
          }
        }

        maxValue = maxValue < item.count ? item.count : maxValue;
        hoursCount.push([y, x, item.count]);
        reportHook.setCurrentHours(labelX, labelY, hoursCount);
      });

      reportHook.setCurrentHoursMaxValue(maxValue);
    });
  };
  const fetchDays = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<ChatsTotal[]>>(
          "/reports/chats/total",
          {
            params: {
              "filters[from]": params.from / 1000,
              "filters[to]": params.to / 1000,
              "filters[agents]": params.agents,
              "filters[groups]": params.groups,
              "filters[tags]": getTags.value,
              "filters[country]": getCountry.value,
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

  const getCurrentDateCurrentAgentCurrentGroup = async () => {
    fetchDays(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCurrentAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setCurrentDateCurrentAgentCurrentGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "#5470c6"
      });
    });
  };
  const getCurrentDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value) {
      reportHook.setCurrentDateCurrentAgentCompareGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCompareGroupsData.value
      },
      "getCurrentDateCurrentAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setCurrentDateCurrentAgentCompareGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "#91cc75"
      });
    });
  };
  const getCurrentDateCompareAgentCurrentGroup = async () => {
    if (!getCompareAgentsStatus.value) {
      reportHook.setCurrentDateCompareAgentCurrentGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCompareAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setCurrentDateCompareAgentCurrentGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "#fac858"
      });
    });
  };
  const getCurrentDateCompareAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setCurrentDateCompareAgentCompareGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCompareGroupsData.value
      },
      "getCurrentDateCompareAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setCurrentDateCompareAgentCompareGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "#ee6666"
      });
    });
  };
  const getCompareDateCurrentAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      reportHook.setCompareDateCurrentAgentCurrentGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getCompareDateCurrentAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setCompareDateCurrentAgentCurrentGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "#73c0de"
      });
    });
  };
  const getCompareDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareDateStatus.value) {
      reportHook.setCompareDateCurrentAgentCompareGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCompareGroupsData.value
      },
      "getCompareDateCurrentAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setCompareDateCurrentAgentCompareGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "#3ba272"
      });
    });
  };
  const getCompareDateCompareAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setCompareDateCompareAgentCurrentGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCurrentGroups.value
      },
      "getCompareDateCompareAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setCompareDateCompareAgentCurrentGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "#fc8452"
      });
    });
  };
  const getCompareDateCompareAgentCompareGroup = async () => {
    if (
      !getCompareGroupsStatus.value ||
      !getCompareAgentsStatus.value ||
      !getCompareDateStatus.value
    ) {
      reportHook.setCompareDateCompareAgentCompareGroup({
        ...defaultChatTotal
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCompareGroupsData.value
      },
      "getCompareDateCompareAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setCompareDateCompareAgentCompareGroup({
        label,
        count,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "#9a60b4"
      });
    });
  };

  const getData = () => {
    getCurrentDateCurrentAgentCurrentGroup().catch();
    getCurrentDateCurrentAgentCompareGroup().catch();
    getCurrentDateCompareAgentCurrentGroup().catch();
    getCurrentDateCompareAgentCompareGroup().catch();
    getCompareDateCurrentAgentCurrentGroup().catch();
    getCompareDateCurrentAgentCompareGroup().catch();
    getCompareDateCompareAgentCurrentGroup().catch();
    getCompareDateCompareAgentCompareGroup().catch();
  };

  watch(
    [
      getCurrentDateFrom,
      getCurrentDateTo,
      getCurrentAgents,
      getCurrentGroups,
      getTags,
      getCountry
    ],
    async (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue)) {
        getData();
        getHoursTotal().catch();
      }
    }
  );

  watch(
    [
      getCompareDateFrom,
      getCompareDateTo,
      getCompareAgentsData,
      getCompareGroupsData
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

  watch(getCompareAgentsStatus, async newValue => {
    if (!newValue) {
      reportHook.setFilterCompareAgentData([]);
    }
  });

  watch(getCompareGroupsStatus, async newValue => {
    if (!newValue) {
      reportHook.setFilterCompareGroupData([]);
    }
  });

  watch(getFilterList, async (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      if (!newValue.includes("agent")) {
        await reportHook.clearFilterAgent();
      }

      if (!newValue.includes("group")) {
        await reportHook.clearFilterGroup();
      }

      if (!newValue.includes("tag")) {
        await reportHook.clearFilterTag();
      }

      if (!newValue.includes("country")) {
        await reportHook.clearFilterCountry();
      }

      await getData();
    }
  });

  onMounted(() => {
    getData();
    getHoursTotal().catch();
  });

  return {
    dataLoading
  };
}
