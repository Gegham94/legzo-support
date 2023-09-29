import { onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment-timezone";
import { ChatsSatisfaction } from "@/api/reports/interfaces";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { defaultChatSatisfaction } from "@/constants/common";
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

  const fetchRated = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<
          void,
          RequestResult<ChatsSatisfaction[]>
        >("/reports/chats/rated-agents", {
          params: {
            "filters[from]": params.from / 1000,
            "filters[to]": params.to / 1000,
            "filters[agents]": params.agents,
            "filters[groups]": params.groups,
            "filters[tags]": getTags.value,
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
  const fetchDays = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<
          void,
          RequestResult<ChatsSatisfaction[]>
        >("/reports/chats/satisfaction", {
          params: {
            "filters[from]": params.from / 1000,
            "filters[to]": params.to / 1000,
            "filters[agents]": params.agents,
            "filters[groups]": params.groups,
            "filters[tags]": getTags.value,
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
  const getAgentsRated = async () => {
    fetchRated(
      {
        from: getCurrentDateFrom.value,
        to: getCurrentDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getAgentsRated"
    ).then(data => {
      reportHook.setRatedAgents(data);
    });
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
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCurrentDateCurrentAgentCurrentGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        colorGood: "#3dcb69",
        colorBad: "#e23831"
      });
    });
  };
  const getCurrentDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value) {
      reportHook.setSatisfactionCurrentDateCurrentAgentCompareGroup({
        ...defaultChatSatisfaction
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
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCurrentDateCurrentAgentCompareGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        colorGood: "#7ddd9a",
        colorBad: "#e96e69"
      });
    });
  };
  const getCurrentDateCompareAgentCurrentGroup = async () => {
    if (!getCompareAgentsStatus.value) {
      reportHook.setSatisfactionCurrentDateCompareAgentCurrentGroup({
        ...defaultChatSatisfaction
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
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCurrentDateCompareAgentCurrentGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        colorGood: "#29964b",
        colorBad: "#a51d19"
      });
    });
  };
  const getCurrentDateCompareAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setSatisfactionCurrentDateCompareAgentCompareGroup({
        ...defaultChatSatisfaction
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
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCurrentDateCompareAgentCompareGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        colorGood: "#bdeecb",
        colorBad: "#f3b4af"
      });
    });
  };
  const getCompareDateCurrentAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      reportHook.setSatisfactionCompareDateCurrentAgentCurrentGroup({
        ...defaultChatSatisfaction
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
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCompareDateCurrentAgentCurrentGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        colorGood: "#edcc1b",
        colorBad: "#d0377d"
      });
    });
  };
  const getCompareDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareDateStatus.value) {
      reportHook.setSatisfactionCompareDateCurrentAgentCompareGroup({
        ...defaultChatSatisfaction
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCurrentAgents.value,
        groups: getCompareGroupsData.value,
        tags: getTags.value
      },
      "getCompareDateCurrentAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCompareDateCurrentAgentCompareGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        colorGood: "#e8d573",
        colorBad: "#e07caa"
      });
    });
  };
  const getCompareDateCompareAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setSatisfactionCompareDateCompareAgentCurrentGroup({
        ...defaultChatSatisfaction
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCurrentGroups.value,
        tags: getTags.value
      },
      "getCompareDateCompareAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCompareDateCompareAgentCurrentGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        colorGood: "#b2980a",
        colorBad: "#992459"
      });
    });
  };
  const getCompareDateCompareAgentCompareGroup = async () => {
    if (
      !getCompareGroupsStatus.value ||
      !getCompareAgentsStatus.value ||
      !getCompareDateStatus.value
    ) {
      reportHook.setSatisfactionCompareDateCompareAgentCompareGroup({
        ...defaultChatSatisfaction
      });
      return;
    }

    fetchDays(
      {
        from: getCompareDateFrom.value,
        to: getCompareDateTo.value,
        agents: getCompareAgentsData.value,
        groups: getCompareGroupsData.value,
        tags: getTags.value
      },
      "getCompareDateCompareAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item => moment(item.interval).format("DD-MM-YY"));
      const good = data?.map(item => item.good);
      const bad = data?.map(item => item.bad);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setSatisfactionCompareDateCompareAgentCompareGroup({
        label,
        good,
        bad,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        colorGood: "#f9edb2",
        colorBad: "#efb9d1"
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
      getTags
    ],
    async (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue)) {
        getData();
        getAgentsRated();
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

  onMounted(() => {
    getData();
    getAgentsRated();
  });

  return {
    dataLoading
  };
}
