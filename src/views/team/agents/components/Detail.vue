<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import { GetAgent } from "@/api/agents/interfaces";
import { ROLES } from "@/utils/role";

defineOptions({
  name: "Detail"
});

const props = defineProps({
  agent: {
    type: Object as PropType<GetAgent>
  }
});

const showGroupsCount = ref(3);
const isShowMore = ref(false);

const showMoreGroups = () => {
  isShowMore.value = !isShowMore.value;
  if (isShowMore.value) {
    showGroupsCount.value = props.agent.groups.length;
    return;
  }
  showGroupsCount.value = 3;
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.agent.status }
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

const showGroupsDetail = computed(() => {
  return props.agent.groups.slice(0, showGroupsCount.value);
});
</script>

<template>
  <div class="sticky top-2 detail" :class="cardClass">
    <el-row class="detail-row">
      <el-col :span="24" class="flex">
        <div class="flex user-main-info">
          <div class="list-card-item_detail--logo">
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
            <p class="list-card-item_detail--name text-text_color_primary">
              {{ agent.name }}
              <el-tag effect="plain" class="mb-1 mt-1">
                {{ ROLES[agent.role] }}
              </el-tag>
            </p>
            <p class="list-card-item_detail--desc text-text_color_regular">
              {{ agent.email }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="detail-row">
      <el-col :span="24">
        <p class="list-card-item_detail--name text-text_color_primary">
          Chat limit:
          <strong>{{ agent.params.maxActiveTickets }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Status:
          <strong>{{ agentStatus }}</strong>
        </p>
      </el-col>
    </el-row>
    <el-row class="detail-row">
      <h4 class="mb-4">Groups ({{ agent?.groups?.length }})</h4>
      <el-col :span="24">
        <div
          v-for="item in showGroupsDetail"
          :key="item.id"
          class="flex items-center mb-1.5"
        >
          <div class="list-card-item_detail--logo group">
            <img
              v-if="item.avatar_link"
              :src="item.avatar_link"
              :alt="item.name"
              width="56"
              height="56"
            />
            <span v-else>
              {{ item.name[0].toUpperCase() }}
            </span>
          </div>
          <span>
            {{ item.name }}
          </span>
        </div>
      </el-col>
      <el-button
        v-if="agent.groups.length > 3"
        @click="showMoreGroups"
        type="primary"
        link
        class="mt-2.5"
      >
        <span v-if="isShowMore"> Hide </span>
        <span v-else> Show {{ agent.groups.length - 3 }} more </span>
      </el-button>
    </el-row>
    <el-row class="detail-row">
      <h4 class="mb-4">Performance</h4>
      <el-col :span="24">
        <p class="list-card-item_detail--name text-text_color_primary">
          Total chats: <strong>{{ agent.performance?.total }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Chats during last 7 days:
          <strong>{{ agent.performance?.past_7_days }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Rated good: <strong>{{ agent.performance?.satisfaction }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Rated good last 7 days:
          <strong>{{ agent.performance?.satisfaction_past_7_days }}</strong>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 8px 20px 8px 8px;

  h4 {
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
  }
}

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-radius: 0;
  overflow: hidden;
  border: none;
  box-shadow: none;

  .close-sidebar {
    cursor: pointer;
  }

  &_detail {
    flex: 1;
    padding: 16px 24px;

    .user-main-info {
      display: flex;
      align-items: center;
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

      &.group {
        position: relative;
        box-sizing: border-box;
        border: 2px solid var(--surface-secondary-default);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 10px;
        margin-right: 5px;
      }
    }

    &--operation {
      &--tag {
        border: 0;
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
}

.detail-row {
  border: solid 1px var(--border-basic-secondary);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 8px;
}
</style>
