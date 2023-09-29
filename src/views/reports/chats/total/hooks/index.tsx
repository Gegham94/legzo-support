import { onMounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment-timezone";
import { ChatsTotal } from "@/api/reports/interfaces";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { defaultChatTotal } from "@/constants/common";
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
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setCurrentDateCurrentAgentCurrentGroup({
        label,
        count,
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
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setCurrentDateCurrentAgentCompareGroup({
        label,
        count,
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
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setCurrentDateCompareAgentCurrentGroup({
        label,
        count,
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
      const dateTitle = `${moment(getCurrentDateFrom.value).format(
        "ll"
      )} - ${moment(getCurrentDateTo.value).format("ll")}`;

      reportHook.setCurrentDateCompareAgentCompareGroup({
        label,
        count,
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
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setCompareDateCurrentAgentCurrentGroup({
        label,
        count,
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
        groups: getCompareGroupsData.value,
        tags: getTags.value
      },
      "getCompareDateCurrentAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setCompareDateCurrentAgentCompareGroup({
        label,
        count,
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
        groups: getCurrentGroups.value,
        tags: getTags.value
      },
      "getCompareDateCompareAgentCurrentGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setCompareDateCompareAgentCurrentGroup({
        label,
        count,
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
        groups: getCompareGroupsData.value,
        tags: getTags.value
      },
      "getCompareDateCompareAgentCompareGroup"
    ).then(data => {
      const label = data?.map(item =>
        moment.unix(item.interval).format("DD-MM-YY")
      );
      const count = data?.map(item => item.count);
      const dateTitle = `${moment(getCompareDateFrom.value).format(
        "ll"
      )} - ${moment(getCompareDateTo.value).format("ll")}`;

      reportHook.setCompareDateCompareAgentCompareGroup({
        label,
        count,
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
    getHoursTotal().catch();
  });

  return {
    dataLoading
  };
}
