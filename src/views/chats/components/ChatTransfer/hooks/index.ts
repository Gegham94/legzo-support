import { nextTick, ref, watch, computed } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetAgent } from "@/api/agents/interfaces";
import { Room } from "@/api/chats/interfaces";
import { GetGroup } from "@/api/groups/interfaces";
import { message } from "@/utils/message";
import { debounce } from "lodash";

export function useTransfer(props) {
  const showModal = ref(false);
  const activeTabPane = ref("0");
  const dataLoading = ref(true);
  const search = ref("");

  const agentList = ref([]);
  const groupList = ref([]);
  const agentPagination = ref({
    page: 1,
    perPage: 20,
    "filter[name]": "",
    sort: "name"
  });
  const groupPagination = ref({
    page: 1,
    perPage: 20,
    "filter[name]": "",
    "filter[status]": "1",
    sort: "name"
  });
  const agentTotalCount = ref(0);
  const groupTotalCount = ref(0);
  const agentDisabled = computed(
    () => agentList.value.length >= agentTotalCount.value
  );
  const groupDisabled = computed(
    () => groupList.value.length >= agentTotalCount.value
  );

  const transferToAgent = async (roomId, managerId) => {
    try {
      const data = await http.post<void, RequestResult<Room>>(
        `/managers/room/${roomId}/pass-manager/${managerId}`
      );

      if (data.success) {
        clearData();
      } else if (data.message) {
        message(data.message, { type: "error" });
      }
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };
  const transferToGroup = async (roomId, lineId) => {
    try {
      const data = await http.post<void, RequestResult<Room>>(
        `/managers/room/${roomId}/pass-line/${lineId}`
      );

      if (data.success) {
        clearData();
      } else if (data.message) {
        message(data.message, { type: "error" });
      }
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };
  const getListAgentsOnline = async () => {
    try {
      dataLoading.value = true;
      const { data, total } = await http.getList<
        void,
        RequestResult<GetAgent[]>
      >("/managers/users/get-online", {
        params: { ...agentPagination.value }
      });

      agentList.value = [...agentList.value, ...data];
      agentTotalCount.value = total;
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const getListGroupsOnline = async () => {
    try {
      dataLoading.value = true;
      const { data, total } = await http.getList<
        void,
        RequestResult<GetGroup[]>
      >("/managers/groups", {
        params: { ...groupPagination.value }
      });

      groupList.value = [...groupList.value, ...data];
      groupTotalCount.value = total;
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const agentLoadMore = () => {
    agentPagination.value.page++;
    getListAgentsOnline().catch();
  };

  const groupLoadMore = () => {
    groupPagination.value.page++;
    getListGroupsOnline().catch();
  };

  const tabChange = tabPaneName => {
    activeTabPane.value = tabPaneName.toString();
    search.value = "";
    clearData();
    init();
  };

  const closeModal = () => {
    clearData();
    search.value = "";
  };

  const clearData = () => {
    agentPagination.value.page = 1;
    agentPagination.value["filter[name]"] = "";
    agentTotalCount.value = 0;
    agentList.value = [];

    groupPagination.value.page = 1;
    groupPagination.value["filter[name]"] = "";
    groupTotalCount.value = 0;
    groupList.value = [];
  };

  const handleSearch = debounce((text: string) => {
    clearData();
    if (activeTabPane.value === "0") {
      agentPagination.value["filter[name]"] = text;
      getListAgentsOnline().then();
    } else {
      groupPagination.value["filter[name]"] = text;
      getListGroupsOnline().catch();
    }
  }, 500);

  const init = () => {
    if (activeTabPane.value === "0") {
      getListAgentsOnline().then();
    } else {
      getListGroupsOnline().catch();
    }
  };

  watch(props, async val => {
    if (val.roomId) {
      showModal.value = true;
      await nextTick();
    }
  });

  return {
    agentLoadMore,
    groupLoadMore,
    agentList,
    groupList,
    showModal,
    agentTotalCount,
    transferToAgent,
    transferToGroup,
    agentDisabled,
    groupDisabled,
    closeModal,
    init,
    search,
    handleSearch,
    tabChange
  };
}
