<script setup lang="ts">
import { useTransfer } from "./hooks/";

defineOptions({
  name: "ChatTransfer"
});

const props = defineProps({
  roomId: {
    type: Number,
    default: 0
  }
});

const {
  agentLoadMore,
  groupLoadMore,
  agentList,
  groupList,
  showModal,
  transferToAgent,
  transferToGroup,
  agentDisabled,
  groupDisabled,
  closeModal,
  init,
  search,
  handleSearch,
  tabChange
} = useTransfer(props);
</script>

<template>
  <el-dialog
    v-model="showModal"
    @open="init"
    @close="
      () => {
        closeModal();
        $emit('close-modal-room');
      }
    "
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">Transfer chat to ...</h4>

        <el-input
          style="width: 300px; margin-right: 20px"
          v-model="search"
          placeholder="Name"
          clearable
          @input="handleSearch"
        >
          <template #suffix>
            <el-icon class="el-input__icon">
              <IconifyIconOffline v-show="search.length === 0" :icon="Search" />
            </el-icon>
          </template>
        </el-input>
      </div>
    </template>
    <el-tabs type="border-card" class="demo-tabs" @tab-change="tabChange">
      <el-tab-pane label="Agent">
        <div class="infinite-list-wrapper" style="overflow: auto">
          <ul
            v-if="agentList.length"
            v-infinite-scroll="agentLoadMore"
            class="list"
            :infinite-scroll-disabled="agentDisabled"
            key="agents"
          >
            <li
              v-for="agent in agentList"
              :key="agent.id"
              class="infinite-list-item"
              @click="transferToAgent(props.roomId, agent.id)"
            >
              <div class="list-card-item">
                <div class="list-card-item_detail bg-bg_color">
                  <el-row>
                    <el-col :span="10">
                      <div class="flex items-center">
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
                  </el-row>
                </div>
              </div>
              <el-divider style="margin: 0" />
            </li>
          </ul>
          <div v-else class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Group">
        <div class="infinite-list-wrapper" style="overflow: auto">
          <ul
            v-if="groupList.length"
            v-infinite-scroll="groupLoadMore"
            class="list"
            :infinite-scroll-disabled="groupDisabled"
            key="groups"
          >
            <li
              v-for="group in groupList"
              :key="group.id"
              class="infinite-list-item"
              @click="transferToGroup(props.roomId, group.id)"
            >
              <div class="list-card-item">
                <div class="list-card-item_detail bg-bg_color">
                  <el-row>
                    <el-col :span="10">
                      <div class="flex items-center">
                        <div class="list-card-item_detail--logo">
                          <span>
                            {{ group.name[0].toUpperCase() }}
                          </span>
                        </div>
                        <div class="user-name">
                          <p
                            class="list-card-item_detail--name text-text_color_primary"
                          >
                            {{ group.name }}
                          </p>
                          <p
                            class="list-card-item_detail--desc text-text_color_regular"
                          >
                            ID: {{ group.id }}
                          </p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-divider style="margin: 0" />
            </li>
          </ul>
          <div v-else class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.infinite-list-wrapper {
  height: 45vh;

  .list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .system-class {
    text-align: center;
    padding: 10px 5px;
    background: #f5f7fa;
    margin-top: 10px;
  }
}

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;

  &_detail {
    flex: 1;
    padding: 5px;

    &--logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e0ebff;
      font-size: 24px;
      color: var(--color-blue);
      margin-right: 16px;
      overflow: hidden;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      &--tag {
        border: 0;
      }
    }

    &--name {
      font-size: 14px;
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
</style>
