import { RequestResult } from "@/api/interfaces";
import { Traffic } from "@/api/traffic/interfaces";
import { useRouter } from "vue-router";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useUserStore } from "@/store/modules/user";
import { useRoomsStore } from "@/store/modules/rooms";
import { storeToRefs } from "pinia";

export function useTableHooks() {
  const usersStore = useUserStore();
  const { getCurrentUserId } = storeToRefs(usersStore);

  const roomsStore = useRoomsStore();
  const { setMessageStatus } = roomsStore;

  const router = useRouter();
  const dataLoading = ref(true);
  const tableData = ref([]);
  const tableHeight = ref(400);
  const tableColWidth = ref(250);
  const isDropdownOpen = ref(false);
  const selectAll = ref(false);
  const tableHeaderTitles = ref([
    {
      label: "Agent name",
      isSelected: true,
      value: "agent_name"
    },
    {
      label: "User name",
      isSelected: true,
      value: "user_name"
    },
    {
      label: "Email",
      isSelected: true,
      value: "email"
    },
    {
      label: "Actions",
      isSelected: true,
      value: "actions"
    },
    {
      label: "Room ID",
      isSelected: true,
      value: "room_id"
    },
    {
      label: "Activity",
      isSelected: true,
      value: "activity"
    },
    {
      label: "Country",
      isSelected: true,
      value: "country_code"
    },
    {
      label: "City",
      isSelected: true,
      value: "city"
    },
    {
      label: "Groups",
      isSelected: true,
      value: "group_name"
    },
    {
      label: "Last page",
      isSelected: false,
      value: "last_page_title"
    },
    {
      label: "No. of chats",
      isSelected: false,
      value: "chats_count"
    },
    {
      label: "Customer ID",
      isSelected: false,
      value: "customer_id"
    },
    {
      label: "Browser",
      isSelected: false,
      value: "prefs_browser"
    },
    {
      label: "Operating System",
      isSelected: false,
      value: "prefs_os"
    },
    {
      label: "IP",
      isSelected: false,
      value: "ip"
    }
  ]);
  const totalCount = ref(0);
  const pagination = ref({
    page: 1,
    perPage: 20
  });
  const apiParams = {
    ...pagination.value
  };

  const filteredTableHeaderTitles = computed(() => {
    return tableHeaderTitles.value.filter(option => option.isSelected);
  });

  const currentUserId = computed(() => {
    return getCurrentUserId.value;
  });

  watch(tableHeaderTitles.value, val => {
    const all = val.some(item => item.isSelected === false);
    selectAll.value = !all;
    handleTableColWidth();
  });

  const selectAllCheckbox = (state: boolean) => {
    tableHeaderTitles.value.forEach(option => {
      if (option.value !== "agent_name") {
        option.isSelected = state;
      }
    });
  };

  const fetchFilterParamsRemove = filterId => {
    if (apiParams && typeof apiParams === "object") {
      for (const key in apiParams) {
        if (key.startsWith(`filters[${filterId}]`)) {
          delete apiParams[key];
          dataLoading.value = true;
        }
      }
    }
  };

  const deleteFilter = async (filterId, isUpdateTableData) => {
    isUpdateTableData
      ? (dataLoading.value = false)
      : (dataLoading.value = true);
    fetchFilterParamsRemove(filterId);
    try {
      const { data, total } = await http.get<void, RequestResult<Traffic[]>>(
        "/managers/traffic",
        {
          params: apiParams
        }
      );
      totalCount.value = total;
      await fillTableData(data);
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 400);
    }
  };

  const fetchTableData = async (filterParams, match, statusType) => {
    // Matching Filter
    if (match) {
      apiParams["filters[match]"] = match;
    }

    // Status type Filter
    if (statusType) {
      apiParams["filters[status-type]"] = statusType;
    }

    if (filterParams && filterParams.params) {
      // Activity Filter
      if (filterParams.params.activityIs) {
        fetchFilterParamsRemove("activity");
        apiParams["filters[activity][is]"] =
          filterParams.params.activityIs.join(",");
      }
      if (filterParams.params.activityIsNot) {
        fetchFilterParamsRemove("activity");
        apiParams["filters[activity][is-not]"] =
          filterParams.params.activityIsNot.join(",");
      }

      // Assigned Agent Filter
      if (filterParams.params.assignedAgentIs) {
        fetchFilterParamsRemove("assigned-agent");
        apiParams["filters[assigned-agent][is]"] =
          filterParams.params.assignedAgentIs.join(",");
      }
      if (filterParams.params.assignedAgentIsNot) {
        fetchFilterParamsRemove("assigned-agent");
        apiParams["filters[assigned-agent][is-not]"] =
          filterParams.params.assignedAgentIsNot.join(",");
      }

      // Came from Filter
      if (filterParams.params.cameFromIsExactly) {
        fetchFilterParamsRemove("came-from");
        apiParams["filters[came-from][is-exactly]"] =
          filterParams.params.cameFromIsExactly.join(",");
      }
      if (filterParams.params.cameFromIsNot) {
        fetchFilterParamsRemove("came-from");
        apiParams["filters[came-from][is-not]"] =
          filterParams.params.cameFromIsNot.join(",");
      }
      if (filterParams.params.cameFromContains) {
        fetchFilterParamsRemove("came-from");
        apiParams["filters[came-from][contains]"] =
          filterParams.params.cameFromContains.join(",");
      }
      if (filterParams.params.cameFromDoesNotContains) {
        fetchFilterParamsRemove("came-from");
        apiParams["filters[came-from][not-contains]"] =
          filterParams.params.cameFromDoesNotContains.join(",");
      }
      if (filterParams.params.cameFromHasAnyValue) {
        fetchFilterParamsRemove("came-from");
        apiParams["filters[came-from][has-any]"] =
          filterParams.params.cameFromHasAnyValue.join(",");
      }

      // City Filter
      if (filterParams.params.cityIsExactly) {
        fetchFilterParamsRemove("city");
        apiParams["filters[city][is-exactly]"] =
          filterParams.params.cityIsExactly.join(",");
      }
      if (filterParams.params.cityIsNot) {
        fetchFilterParamsRemove("city");
        apiParams["filters[city][is-not]"] =
          filterParams.params.cityIsNot.join(",");
      }
      if (filterParams.params.cityContains) {
        fetchFilterParamsRemove("city");
        apiParams["filters[city][contains]"] =
          filterParams.params.cityContains.join(",");
      }
      if (filterParams.params.cityDoesNotContains) {
        fetchFilterParamsRemove("city");
        apiParams["filters[city][not-contains]"] =
          filterParams.params.cityDoesNotContains.join(",");
      }
      if (filterParams.params.cityHasAnyValue) {
        fetchFilterParamsRemove("city");
        apiParams["filters[city][has-any]"] =
          filterParams.params.cityHasAnyValue.join(",");
      }

      // Country Filter
      if (filterParams.params.countryIs) {
        fetchFilterParamsRemove("country");
        apiParams["filters[country][is]"] =
          filterParams.params.countryIs.join(",");
      }
      if (filterParams.params.countryIsNot) {
        fetchFilterParamsRemove("country");
        apiParams["filters[country][is-not]"] =
          filterParams.params.countryIsNot.join(",");
      }

      // Email Filter
      if (filterParams.params.emailIsExactly) {
        fetchFilterParamsRemove("email");
        apiParams["filters[email][is-exactly]"] =
          filterParams.params.emailIsExactly.join(",");
      }
      if (filterParams.params.emailIsNot) {
        fetchFilterParamsRemove("email");
        apiParams["filters[email][is-not]"] =
          filterParams.params.emailIsNot.join(",");
      }
      if (filterParams.params.emailContains) {
        fetchFilterParamsRemove("email");
        apiParams["filters[email][contains]"] =
          filterParams.params.emailContains.join(",");
      }
      if (filterParams.params.emailDoesNotContains) {
        fetchFilterParamsRemove("email");
        apiParams["filters[email][not-contains]"] =
          filterParams.params.emailDoesNotContains.join(",");
      }
      if (filterParams.params.emailHasAnyValue) {
        fetchFilterParamsRemove("email");
        apiParams["filters[email][has-any]"] =
          filterParams.params.emailHasAnyValue.join(",");
      }

      // Group Filter
      if (filterParams.params.groupIs) {
        fetchFilterParamsRemove("group");
        apiParams["filters[group][is]"] = filterParams.params.groupIs.join(",");
      }
      if (filterParams.params.groupIsNot) {
        fetchFilterParamsRemove("group");
        apiParams["filters[group][is-not]"] =
          filterParams.params.groupIsNot.join(",");
      }

      // Ip Address Filter
      if (filterParams.params.ip) {
        fetchFilterParamsRemove("ip");
        apiParams["filters[ip]"] = filterParams.params.ip.join(",");
      }

      // Last Page Title Filter
      if (filterParams.params.lastPageIsExactly) {
        fetchFilterParamsRemove("last-page-title");
        apiParams["filters[last-page-title][is-exactly]"] =
          filterParams.params.lastPageIsExactly.join(",");
      }
      if (filterParams.params.lastPageIsNot) {
        fetchFilterParamsRemove("last-page-title");
        apiParams["filters[last-page-title][is-not]"] =
          filterParams.params.lastPageIsNot.join(",");
      }
      if (filterParams.params.lastPageContains) {
        fetchFilterParamsRemove("last-page-title");
        apiParams["filters[last-page-title][contains]"] =
          filterParams.params.lastPageContains.join(",");
      }
      if (filterParams.params.lastPageDoesNotContains) {
        fetchFilterParamsRemove("last-page-title");
        apiParams["filters[last-page-title][not-contains]"] =
          filterParams.params.lastPageDoesNotContains.join(",");
      }
      if (filterParams.params.lastPageHasAnyValue) {
        fetchFilterParamsRemove("last-page-title");
        apiParams["filters[last-page-title][has-any]"] =
          filterParams.params.lastPageHasAnyValue.join(",");
      }

      // Name Filter
      if (filterParams.params.nameIsExactly) {
        fetchFilterParamsRemove("name");
        apiParams["filters[name][is-exactly]"] =
          filterParams.params.nameIsExactly.join(",");
      }
      if (filterParams.params.nameIsNot) {
        fetchFilterParamsRemove("name");
        apiParams["filters[name][is-not]"] =
          filterParams.params.nameIsNot.join(",");
      }
      if (filterParams.params.nameContains) {
        fetchFilterParamsRemove("name");
        apiParams["filters[name][contains]"] =
          filterParams.params.nameContains.join(",");
      }
      if (filterParams.params.nameDoesNotContains) {
        fetchFilterParamsRemove("name");
        apiParams["filters[name][not-contains]"] =
          filterParams.params.nameDoesNotContains.join(",");
      }
      if (filterParams.params.nameHasAnyValue) {
        fetchFilterParamsRemove("name");
        apiParams["filters[name][has-any]"] =
          filterParams.params.nameHasAnyValue.join(",");
      }

      // NEED IN FUTURE
      // Number of Visits Filter
      // if (filterParams.params.numberVisitsIsExactly) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][is-exactly]"] =
      //     filterParams.params.numberVisitsIsExactly.join(",");
      // }
      // if (filterParams.params.numberVisitsIsNot) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][is-not]"] =
      //     filterParams.params.numberVisitsIsNot.join(",");
      // }
      // if (filterParams.params.numberVisitsIsGreaterThan) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][greater-than]"] =
      //     filterParams.params.numberVisitsIsGreaterThan.join(",");
      // }
      // if (filterParams.params.numberVisitsIsGreaterOrEqual) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][grater-or-equal]"] =
      //     filterParams.params.numberVisitsIsGreaterOrEqual.join(",");
      // }
      // if (filterParams.params.numberVisitsIsLessThan) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][less-than]"] =
      //     filterParams.params.numberVisitsIsLessThan.join(",");
      // }
      // if (filterParams.params.numberVisitsIsLessOrEqual) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][less-or-equal]"] =
      //     filterParams.params.numberVisitsIsLessOrEqual.join(",");
      // }
      // if (filterParams.params.numberVisitsIsBetween) {
      //   fetchFilterParamsRemove("number-of-visits");
      //   apiParams["filters[number-of-visits][is-between]"] =
      //     filterParams.params.numberVisitsIsBetween.join(",");
      // }

      // Returning Customer Filter
      if (
        filterParams.params.returningCustomer === true ||
        filterParams.params.returningCustomer === false
      ) {
        fetchFilterParamsRemove("returning-customer");
        apiParams["filters[returning-customer]"] =
          filterParams.params.returningCustomer;
      }

      // Region Filter
      if (filterParams.params.regionIsExactly) {
        fetchFilterParamsRemove("region");
        apiParams["filters[region][is-exactly]"] =
          filterParams.params.stateIsExactly.join(",");
      }
      if (filterParams.params.regionIsNot) {
        fetchFilterParamsRemove("region");
        apiParams["filters[region][is-not]"] =
          filterParams.params.regionIsNot.join(",");
      }
      if (filterParams.params.regionContains) {
        fetchFilterParamsRemove("region");
        apiParams["filters[region][contains]"] =
          filterParams.params.regionContains.join(",");
      }
      if (filterParams.params.regionDoesNotContains) {
        fetchFilterParamsRemove("region");
        apiParams["filters[region][not-contains]"] =
          filterParams.params.regionDoesNotContains.join(",");
      }
      if (filterParams.params.regionHasAnyValue) {
        fetchFilterParamsRemove("region");
        apiParams["filters[region][has-any]"] =
          filterParams.params.regionHasAnyValue.join(",");
      }
    }

    try {
      dataLoading.value = true;
      const { data, total } = await http.get<void, RequestResult<Traffic[]>>(
        "/managers/traffic",
        {
          params: apiParams
        }
      );
      totalCount.value = total;
      await fillTableData(data);
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 400);
    }
  };

  const fillTableData = data => {
    tableData.value = data.map(item => ({
      agent_name:
        item.primary_manager && item.primary_manager.name
          ? item.primary_manager.name
          : "—",
      user_name: item.name ? item.name : "—",
      email: item.email ? item.email : "—",
      activity: item.activity ? item.activity : "—",
      country_code: item.country_code ? item.country_code : "—",
      group_name: item.group_name ? item.group_name : "—",
      ip: item.ip ? item.ip : "—",
      managers: item.managers ? item.managers : null,
      room_id: item.id ? item.id : "—",
      chats_count: item.chats_count ? item.chats_count : 0,
      last_page_title:
        item.last_page && item.last_page.title ? item.last_page.title : "—",
      last_page_url:
        item.last_page && item.last_page.url ? item.last_page.url : "—",
      login: item.login ? item.login : "—",
      customer_id: item.customer_id ? item.customer_id : "—",
      prefs_browser:
        item.prefs && item.prefs.browser ? item.prefs.browser : "—",
      prefs_os: item.prefs && item.prefs.os ? item.prefs.os : "—",
      city:
        item.prefs && item.prefs.geolocation && item.prefs.geolocation.city
          ? item.prefs.geolocation.city
          : "—"
    }));
  };

  const chatAction = async (row, startChatStatus) => {
    const room_id = row.room_id;
    if (startChatStatus) {
      await setMessageStatus(true);
      router.push("/chats");
      await http.post(`/managers/room/${room_id}/connect`);
    }
    if (!startChatStatus) {
      await setMessageStatus(true);
      router.push("/chats");
      await http.post(
        `/managers/room/${room_id}/connect-manager/${currentUserId.value}`
      );
    }
  };

  const handleTableHeightResize = () => {
    tableHeight.value = Math.round(window.innerHeight * 0.6);
  };

  const handleTableColWidth = () => {
    if (filteredTableHeaderTitles.value.length < 8) {
      tableColWidth.value = null;
    }
    if (filteredTableHeaderTitles.value.length >= 8) {
      tableColWidth.value = 250;
    }
  };

  const onPageSizeChange = (size: number) => {
    pagination.value.perPage = size;
    pagination.value.page = 1;
  };

  const onCurrentChange = (page: number) => {
    pagination.value.page = page;
  };

  onMounted(() => {
    tableHeight.value = Math.round(window.innerHeight * 0.6);
    window.addEventListener("resize", handleTableHeightResize);
    handleTableColWidth();
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleTableHeightResize);
  });

  return {
    dataLoading,
    tableData,
    tableHeight,
    tableColWidth,
    isDropdownOpen,
    selectAll,
    tableHeaderTitles,
    filteredTableHeaderTitles,
    pagination,
    totalCount,
    selectAllCheckbox,
    chatAction,
    onCurrentChange,
    onPageSizeChange,
    fetchTableData,
    deleteFilter
  };
}
