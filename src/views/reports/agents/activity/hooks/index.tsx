import { onMounted, onUnmounted, ref, watch } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import moment from "moment";
import { isEqual } from "lodash";
import { useReportHook, useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";
import { activityAgents } from "@/store/modules/types";

export function useHooks() {
  const dataLoading = ref(true);
  const isHideEmpty = ref(true);

  const reportStore = useReportStore();
  const reportHook = useReportHook();

  const {
    getCurrentDateCustom,
    getCurrentAgents,
    getCurrentGroups,
    getTags,
    getFilterList
  } = storeToRefs(reportStore);

  const fetchData = async (params, method) => {
    try {
      dataLoading.value = true;

      if (params.date) {
        const { data } = await http.get<void, RequestResult<activityAgents[]>>(
          "/reports/agents/activity",
          {
            params: {
              "filters[date]": params.date / 1000,
              "filters[agents]": params.agents,
              "filters[groups]": params.groups,
              "filters[tags]": getTags.value,
              distribution: "days",
              tzOffset: new Date().getTimezoneOffset(),
              method: method,
              from: moment(params.from).format("DD-MM-YYYY"),
              to: moment(params.to).format("DD-MM-YYYY"),
              isHideEmpty: isHideEmpty.value
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
  const getData = async () => {
    fetchData(
      {
        date: getCurrentDateCustom.value,
        agents: getCurrentAgents.value,
        groups: getCurrentGroups.value
      },
      "getCurrentDateCurrentAgentCurrentGroup"
    ).then(data => {
      const activity = data?.map(item => {
        let leftStart = item.activity[0].start_time;
        let leftTotal = 0;
        const total = {
          accepting_chats: 0,
          not_accepting_chats: 0,
          logged_out: 0
        };

        const formatterActivity = item?.activity?.map(active => {
          const left =
            leftTotal + ((active.start_time - leftStart) * 100) / 86399;
          const width = ((active.end_time - active.start_time) * 100) / 86399;
          const differentTime = active.end_time - active.start_time;
          let background = "var(--color-positive-default)";
          let title = "";

          switch (active.type) {
            case "user.ready":
              title = "Accepting chats";
              background = "var(--color-positive-default)";
              total.accepting_chats += differentTime;
              break;
            case "user.online":
              title = "Not accepting chats";
              background = "var(--color-negative-default)";
              total.not_accepting_chats += differentTime;
              break;
            case "user.offline":
              title = "Logged Out";
              background = "var(--surface-secondary-default)";
              total.logged_out += differentTime;
              break;
          }

          const acceptingTime = `${title}: ${moment
            .utc(differentTime * 1000)
            .format("HH[h] mm[m] ss[s]")}`;
          leftStart = active.start_time;
          leftTotal = left;

          return {
            start_time: active.start_time,
            end_time: active.end_time,
            type: active.type,
            left: left,
            width: width,
            background: background,
            accepting_time: acceptingTime
          };
        });

        return {
          ...item,
          activity: formatterActivity,
          total: total
        };
      });

      reportHook.setAgentsActivity(activity);
    });
  };

  watch(
    [
      getCurrentDateCustom,
      getCurrentAgents,
      getCurrentGroups,
      getTags,
      isHideEmpty
    ],
    async (newValue, oldValue) => {
      if (!isEqual(newValue, oldValue)) {
        getData().catch();
      }
    }
  );

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

      await getData();
    }
  });

  onMounted(async () => {
    await reportHook.setFilterCurrentDateCustom(moment().unix() * 1000);
    await reportHook.setCurrentDateInterval("today");
    getData().catch();
  });

  onUnmounted(() => {
    reportHook.setCurrentDateInterval("last_7_days");
  });

  return {
    dataLoading,
    isHideEmpty
  };
}
