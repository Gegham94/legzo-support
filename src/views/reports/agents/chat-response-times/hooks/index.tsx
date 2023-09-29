import { onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment-timezone";
import { ChatsResponseTime } from "@/api/reports/interfaces";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { defaultChatResponseTime } from "@/constants/common";
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

  const fetchDays = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.from && params.to) {
        const { data } = await http.get<
          void,
          RequestResult<ChatsResponseTime[]>
        >("/reports/agents/response-times", {
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
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCurrentDateCurrentAgentCurrentGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "rgb(84 112 198)"
      });
    });
  };
  const getCurrentDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value) {
      reportHook.setResponseTimeCurrentDateCurrentAgentCompareGroup({
        ...defaultChatResponseTime
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
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCurrentDateCurrentAgentCompareGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "rgb(145 203 116)"
      });
    });
  };
  const getCurrentDateCompareAgentCurrentGroup = async () => {
    if (!getCompareAgentsStatus.value) {
      reportHook.setResponseTimeCurrentDateCompareAgentCurrentGroup({
        ...defaultChatResponseTime
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
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCurrentDateCompareAgentCurrentGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "rgb(115 191 222)"
      });
    });
  };
  const getCurrentDateCompareAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setResponseTimeCurrentDateCompareAgentCompareGroup({
        ...defaultChatResponseTime
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
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCurrentDateCompareAgentCompareGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "rgb(238 102 102)"
      });
    });
  };
  const getCompareDateCurrentAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value) {
      reportHook.setResponseTimeCompareDateCurrentAgentCurrentGroup({
        ...defaultChatResponseTime
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
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCompareDateCurrentAgentCurrentGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "rgb(234 124 204)"
      });
    });
  };
  const getCompareDateCurrentAgentCompareGroup = async () => {
    if (!getCompareGroupsStatus.value || !getCompareDateStatus.value) {
      reportHook.setResponseTimeCompareDateCurrentAgentCompareGroup({
        ...defaultChatResponseTime
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
      const count = data?.map(item => item.count);
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCompareDateCurrentAgentCompareGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCurrentAgents.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "rgb(59 162 114)"
      });
    });
  };
  const getCompareDateCompareAgentCurrentGroup = async () => {
    if (!getCompareDateStatus.value || !getCompareAgentsStatus.value) {
      reportHook.setResponseTimeCompareDateCompareAgentCurrentGroup({
        ...defaultChatResponseTime
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
      const count = data?.map(item => item.count);
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCompareDateCompareAgentCurrentGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCurrentGroups.value)
        },
        color: "rgb(153 96 180)"
      });
    });
  };
  const getCompareDateCompareAgentCompareGroup = async () => {
    if (
      !getCompareGroupsStatus.value ||
      !getCompareAgentsStatus.value ||
      !getCompareDateStatus.value
    ) {
      reportHook.setResponseTimeCompareDateCompareAgentCompareGroup({
        ...defaultChatResponseTime
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
      const count = data?.map(item => item.count);
      const first_response_time = data?.map(item => item.first_response_time);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setResponseTimeCompareDateCompareAgentCompareGroup({
        label,
        count,
        first_response_time,
        title: {
          date: dateTitle,
          agent: getAgentsName(getCompareAgentsData.value),
          group: getGroupsName(getCompareGroupsData.value)
        },
        color: "rgb(252 132 82)"
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
  });

  return {
    dataLoading
  };
}
