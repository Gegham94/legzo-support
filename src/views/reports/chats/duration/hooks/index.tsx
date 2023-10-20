import { onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment";
import { ChatsDuration } from "@/api/reports/interfaces";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { defaultChatDuration } from "@/constants/common";
import { useGroupsStore } from "@/store/modules/groups";
import { useAgentsStore } from "@/store/modules/agents";

const offsetUTC = Math.round(new Date().getTimezoneOffset() / 60);
moment.tz.setDefault(`${offsetUTC}:00`);

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

  const fetchDays = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<void, RequestResult<ChatsDuration[]>>(
          "/reports/chats/duration",
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setDurationCurrentDateCurrentAgentCurrentGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCurrentDateCurrentAgentCompareGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setDurationCurrentDateCurrentAgentCompareGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCurrentDateCompareAgentCurrentGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setDurationCurrentDateCompareAgentCurrentGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCurrentDateCompareAgentCompareGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCurrentDateFrom.value,
        getCurrentDateTo.value
      );

      reportHook.setDurationCurrentDateCompareAgentCompareGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCompareDateCurrentAgentCurrentGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setDurationCompareDateCurrentAgentCurrentGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCompareDateCurrentAgentCompareGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setDurationCompareDateCurrentAgentCompareGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCompareDateCompareAgentCurrentGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setDurationCompareDateCompareAgentCurrentGroup({
        label,
        count,
        duration,
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
      reportHook.setDurationCompareDateCompareAgentCompareGroup({
        ...defaultChatDuration
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
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const count = data?.map(item => item.count);
      const duration = data?.map(item => item.duration);
      const dateTitle = getDateName(
        getCompareDateFrom.value,
        getCompareDateTo.value
      );

      reportHook.setDurationCompareDateCompareAgentCompareGroup({
        label,
        count,
        duration,
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
  });

  return {
    dataLoading
  };
}
