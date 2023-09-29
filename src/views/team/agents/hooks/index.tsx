import { nextTick, onMounted, ref, watchEffect } from "vue";
import { INITIAL_DATA } from "@/api/agents/constants";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { GetAgent } from "@/api/agents/interfaces";
import { GetGroup } from "@/api/groups/interfaces";
import { debounce } from "lodash";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

export function useAgents() {
  const pagination = ref({
    page: 1,
    perPage: 20,
    "filter[name]": "",
    sort: "-status,name"
  });

  const totalCount = ref(0);
  const agentList = ref([]);
  const groupList = ref([]);
  const dataLoading = ref(true);
  const formDialogVisible = ref(false);
  const formLimitVisible = ref(false);
  const formData = ref({ ...INITIAL_DATA });
  const search = ref("");
  const selectedAgent = ref(null);
  const formLimitData = ref({ ...INITIAL_DATA });
  const formVisible = ref(false);
  const limit = ref(1);

  const setSelectedAgent = async agent => {
    if (!agent) {
      selectedAgent.value = null;
      return;
    }
    const { data } = await http.get<void, RequestResult<GetAgent>>(
      `/admin/users/${agent.id}`
    );

    selectedAgent.value = { ...agent, ...data };
  };

  const getListAgents = async () => {
    try {
      const { data, total } = await http.getList<
        void,
        RequestResult<GetAgent[]>
      >("/admin/users", {
        params: { ...pagination.value }
      });

      agentList.value = data;
      totalCount.value = total;
      if (agentList.value.length) {
        setSelectedAgent(agentList.value[0]).catch();
      }
    } catch (error) {
      message(error, { type: "error" });
    } finally {
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };

  const getListGroups = async () => {
    try {
      const { data } = await http.getList<void, RequestResult<GetGroup[]>>(
        "/managers/groups"
      );
      groupList.value = data;
    } catch (error) {
      message(error, { type: "error" });
    }
  };

  onMounted(() => {
    getListGroups().catch();
  });

  watchEffect(newSomething => {
    if (newSomething.length > 0) {
      getListAgents().catch();
    }
  });

  const onPageSizeChange = (size: number) => {
    pagination.value.perPage = size;
    pagination.value.page = 1;
  };

  const handleSearch = debounce((text: string) => {
    pagination.value["filter[name]"] = text;
  }, 500);

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

  const handleDeleteItem = agent => {
    ElMessageBox.confirm(
      agent
        ? `You want to ${agent.status ? "deactivate" : "activate"} ${
            agent.email
          }?`
        : "",
      "Submit",
      {
        type: "warning"
      }
    )
      .then(() => {
        http
          .put(`/admin/users/${agent.id}`, {
            data: { status: agent.status ? 0 : 1 }
          })
          .then(() => {
            message("Successfully", { type: "success" });
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            getListAgents();
          });
      })
      .catch(() => {});
  };

  const handleLogoutManager = agent => {
    ElMessageBox.confirm(
      agent ? `You want to log out ${agent.email}?` : "",
      "Submit",
      {
        type: "warning"
      }
    )
      .then(() => {
        http
          .get(`/admin/users/${agent.id}/logout`)
          .then(() => {
            message("Successfully", { type: "success" });
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            getListAgents();
          });
      })
      .catch(() => {});
  };

  const handleManageAgent = agent => {
    formDialogVisible.value = true;
    nextTick(() => {
      formData.value = { ...agent };
    });
  };

  const handleStatusChanges = (agent, type) => {
    http
      .put(`/admin/users/${agent.id}/online/${type}`)
      .then(() => {
        agentList.value.find(item => item.id === agent.id).onlineStatus = type;
        selectedAgent.value.onlineStatus = type;
        message("Successfully", { type: "success" });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleChangeLimit = agent => {
    formLimitVisible.value = true;
    formLimitData.value = { ...agent };
  };

  const changeLimitAgent = (id, limit) => {
    if (id) {
      http
        .put(`/admin/users/${id}`, {
          data: { params: { maxActiveTickets: limit } }
        })
        .then(() => {
          message("Successfully", { type: "success" });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          formLimitVisible.value = false;
          getListAgents();
        });
    } else {
      http
        .post("/admin/users", {
          data: { params: { maxActiveTickets: limit } }
        })
        .then(() => {
          message("Successfully", { type: "success" });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          formLimitVisible.value = false;
          getListAgents();
        });
    }
  };
  const closeLimitDialog = data => {
    limit.value = data.params.maxActiveTickets;
    formVisible.value = false;
  };

  const changeGroupSelect = groups => {
    formData.value.groups = [];
    groups.forEach(item => {
      const groupsItem = groupList.value.find(group => group.name === item).id;
      if (groupsItem) {
        formData.value.groups.push(groupsItem);
      }
    });
  };
  return {
    formDialogVisible,
    formLimitVisible,
    handleSearch,
    search,
    dataLoading,
    agentList,
    totalCount,
    handleDeleteItem,
    handleManageAgent,
    handleLogoutManager,
    pagination,
    onPageSizeChange,
    onCurrentChange,
    formData,
    groupList,
    getListAgents,
    selectedAgent,
    setSelectedAgent,
    formLimitData,
    handleSort,
    handleStatusChanges,
    handleChangeLimit,
    changeLimitAgent,
    formVisible,
    limit,
    closeLimitDialog,
    changeGroupSelect
  };
}
