<script setup lang="ts">
import { computed, PropType } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import { GetAgent } from "@/api/agents/interfaces";
import { ROLES } from "@/utils/role";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { useReportStore } from "@/store/modules/reports";

defineOptions({
  name: "ReCard"
});

const props = defineProps({
  agent: {
    type: Object as PropType<GetAgent>
  },
  active: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "manage-agent",
  "delete-item",
  "set-selected-agent",
  "manager-logout",
  "changes-status",
  "changes-limit-agent"
]);

const router = useRouter();
const { setFilterList, setFilterAgents } = useReportStore();
const handleClickManage = (agent: GetAgent) => {
  emit("manage-agent", agent);
};

const handleClickDelete = (agent: GetAgent) => {
  emit("delete-item", agent);
};

const handleStatusChanges = (agent: GetAgent, type: number) => {
  emit("changes-status", agent, type);
};

const handleSelectedAgent = (agent: GetAgent) => {
  emit("set-selected-agent", agent);
};

const handleChangeLimit = () => {
  emit("changes-limit-agent", props.agent);
};

const goToReports = id => {
  setFilterList("agent");
  setFilterAgents(id);
  router.push("/reports/chats/total");
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.agent.status }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": !props.agent.status }
]);

const agentStatus = computed(() => {
  if (props.agent.onlineStatus === 0) {
    return "Offline";
  }
  if (props.agent.onlineStatus === 1) {
    return "Not accepting chats";
  }
  if (props.agent.onlineStatus === 2) {
    return "Accepting chats";
  }
  return "";
});

const agentStatusColor = computed(() => {
  if (props.agent.onlineStatus === 1) {
    return "not_accepting";
  }
  if (props.agent.onlineStatus === 2) {
    return "accepting";
  }
  return "";
});

const userRole = computed(() => {
  return useUserStoreHook()?.getUser.role === 1;
});

const statusAgent = computed(() => {
  return props.agent.status ? "Deactivate" : "Activate";
});

const changeStatus = computed(() => {
  return userRole.value && props.agent.onlineStatus !== 0;
});
</script>

<template>
  <div :class="cardClass">
    <div
      class="list-card-item_detail bg-bg_color"
      :class="{ 'list-card-item_detail-active': active }"
    >
      <el-row>
        <el-col :span="20" class="main-info" @click="handleSelectedAgent">
          <el-row>
            <el-col :span="12">
              <div class="flex items-center">
                <div :class="cardLogoClass">
                  <img
                    v-if="agent.avatar_link"
                    :src="agent.avatar_link"
                    :alt="agent.name[0].toUpperCase()"
                    width="56"
                    height="56"
                  />
                  <span v-else>
                    {{ agent.name[0].toUpperCase() }}
                  </span>
                </div>
                <div class="user-name">
                  <p
                    class="list-card-item_detail--name text-text_color_primary"
                  >
                    {{ agent.name }}
                  </p>
                  <p
                    class="list-card-item_detail--desc text-text_color_regular"
                  >
                    {{ agent.email }}
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="6" class="flex items-center">
              <p class="list-card-item_detail--desc text-text_color_regular">
                <el-tag effect="plain" class="mb-1 mt-1">
                  {{ ROLES[agent.role] }}
                </el-tag>
              </p>
            </el-col>
            <el-col :span="6" class="flex items-center">
              <div class="list-card-item_detail--operation flex">
                <el-dropdown :trigger="changeStatus ? click : ''">
                  <span
                    class="list-card-item_dropdown--item flex-ac"
                    :class="agentStatusColor"
                  >
                    {{ agentStatus }}
                    <el-icon class="el-icon--right" v-if="changeStatus">
                      <IconifyIconOffline
                        class="close-sidebar"
                        :icon="ArrowDown"
                        width="15px"
                        height="15px"
                      />
                    </el-icon>
                  </span>

                  <template #dropdown v-if="changeStatus">
                    <el-dropdown-menu>
                      <el-dropdown-item
                        class="list-card-item_dropdown--item accepting"
                        @click="handleStatusChanges(agent, 2)"
                      >
                        Accepting chats
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="list-card-item_dropdown--item not_accepting"
                        @click="handleStatusChanges(agent, 1)"
                      >
                        Not accepting chats
                      </el-dropdown-item>
                      <el-dropdown-item
                        class="list-card-item_dropdown--item"
                        @click="handleStatusChanges(agent, 0)"
                      >
                        Log out
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" class="flex items-center justify-end">
          <el-dropdown trigger="click">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown v-if="userRole">
              <el-dropdown-menu :disabled="!agent.status">
                <el-dropdown-item @click="handleClickManage(agent)">
                  Edit profile
                </el-dropdown-item>
                <el-dropdown-item @click="handleChangeLimit">
                  Change chat limit
                </el-dropdown-item>
                <el-dropdown-item @click="goToReports(agent.id)">
                  View agent reports
                </el-dropdown-item>
                <el-dropdown-item @click="handleClickDelete(agent)">
                  {{ statusAgent }} agent
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-radius: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--decor-gray40);

  .main-info {
    cursor: pointer;
  }

  &_detail {
    flex: 1;
    padding: 8px 16px;

    &-active {
      background-color: var(--surface-basic-active);
    }

    &--logo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e0ebff;
      font-size: 32px;
      color: var(--color-blue);
      margin-right: 24px;
      overflow: hidden;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      &--tag {
        border: 0;
      }

      span,
      div {
        outline: none;
      }
    }

    &--name {
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }

  ::v-deep &_dropdown--item {
    &::before {
      content: " ";
      display: inline-block;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      background-color: var(--content-disabled);
      margin-right: 5px;
      border: 1px solid var(--surface-secondary-default);
      box-sizing: border-box;
      background-clip: padding-box;
    }

    &.not_accepting::before {
      background-color: var(--color-negative-default);
    }

    &.accepting::before {
      background-color: var(--color-positive-default);
    }

    &[aria-expanded="true"] {
      i {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
