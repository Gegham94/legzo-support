import { nextTick, onMounted, ref, watchEffect } from "vue";
import { INITIAL_DATA } from "@/api/agents/constants";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetAgent } from "@/api/agents/interfaces";
import { GetGroup } from "@/api/groups/interfaces";
import { debounce } from "lodash";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

export function useGroups() {
  const pagination = ref({
    page: 1,
    perPage: 20,
    "filter[name]": "",
    sort: "-status,name",
    include: "users"
  });

  const totalCount = ref(0);
  const groupList = ref([]);
  const agentList = ref([]);
  const dataLoading = ref(true);
  const formDialogVisible = ref(false);
  const formData = ref({ ...INITIAL_DATA });
  const search = ref("");
  const showCustomersCount = ref(3);
  const isShowMore = ref(false);
  const selectedGroup = ref(null);
  const setSelectedGroup = async group => {
    if (!group) {
      selectedGroup.value = null;
      return;
    }
    const { data } = await http.get<void, RequestResult<GetAgent>>(
      `/admin/groups/${group.id}`
    );

    selectedGroup.value = { ...group, ...data };
  };
  const getListGroups = async () => {
    try {
      const { data, total } = await http.getList<
        void,
        RequestResult<GetGroup[]>
      >("/managers/groups", {
        params: { ...pagination.value }
      });

      groupList.value = data?.map(group => {
        const customers = group?.users?.map(customer => customer.id);
        const onlineStatusCount = group?.users?.filter(
          customer => customer.onlineStatus === 2
        ).length;

        return {
          ...group,
          customers,
          onlineStatusCount,
          customersDetail: group?.users
        };
      });
      if (agentList.value.length) {
        setSelectedGroup(groupList.value[0]).catch();
      }
      totalCount.value = total;
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const getListAgents = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetAgent[]>>(
        "/admin/users"
      );
      agentList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  onMounted(() => {
    getListAgents();
  });

  watchEffect(newSomething => {
    if (newSomething.length > 0) {
      getListGroups();
    }
  });

  const onPageSizeChange = (size: number) => {
    pagination.value.perPage = size;
    pagination.value.page = 1;
  };

  const handleSearch = debounce((text: string) => {
    pagination.value["filter[name]"] = text;
  }, 500);

  const onCurrentChange = (page: number) => {
    pagination.value.page = page;
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

  const handleDeleteItem = group => {
    ElMessageBox.confirm(
      group
        ? `You want to ${group.status ? "deactivate" : "activate"} ${
            group.email
          }?`
        : "",
      "Submit",
      {
        type: "warning"
      }
    )
      .then(() => {
        http
          .put(`/admin/groups/${group.id}`, {
            data: { status: group.status ? 0 : 1 }
          })
          .then(() => {
            message("Successfully", { type: "success" });
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            getListGroups();
          });
      })
      .catch(() => {});
  };

  const handleManageGroup = group => {
    formDialogVisible.value = true;
    nextTick(() => {
      formData.value = { ...group };
    });
  };

  const showMoreCustomers = group => {
    isShowMore.value = !isShowMore.value;
    if (isShowMore.value) {
      showCustomersCount.value = group.customersDetail.length;
      return;
    }
    showCustomersCount.value = 3;
  };

  return {
    formDialogVisible,
    handleSearch,
    search,
    dataLoading,
    groupList,
    totalCount,
    selectedGroup,
    setSelectedGroup,
    handleDeleteItem,
    handleManageGroup,
    pagination,
    onPageSizeChange,
    onCurrentChange,
    formData,
    agentList,
    getListGroups,
    handleSort,
    showMoreCustomers,
    isShowMore,
    showCustomersCount
  };
}
