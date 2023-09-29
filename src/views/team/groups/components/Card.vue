<script setup lang="ts">
import { computed, PropType } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";
import { GetGroup } from "@/api/groups/interfaces";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { useReportStore } from "@/store/modules/reports";

defineOptions({
  name: "GroupCard"
});

const props = defineProps({
  group: {
    type: Object as PropType<GetGroup>
  },
  active: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const { setFilterList, setFilterGroups } = useReportStore();
const emit = defineEmits(["manage-group", "delete-item", "set-selected-group"]);

const handleClickManage = (group: GetGroup) => {
  emit("manage-group", group);
};

const handleClickDelete = (group: GetGroup) => {
  emit("delete-item", group);
};

const handleSelectedGroup = (group: GetGroup) => {
  emit("set-selected-group", group);
};

const goToReports = id => {
  setFilterList("group");
  setFilterGroups(id);
  router.push("/reports/chats/total");
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.group.status }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": !props.group.status }
]);

const userRole = computed(() => {
  return useUserStoreHook()?.getUser.role === 1;
});

const statusGroup = computed(() => {
  return props.group.status ? "Deactivate" : "Activate";
});
</script>

<template>
  <div :class="cardClass">
    <div
      class="list-card-item_detail bg-bg_color"
      :class="{ 'list-card-item_detail-active': active }"
    >
      <el-row>
        <el-col :span="21" class="main-info" @click="handleSelectedGroup">
          <el-row>
            <el-col :span="10">
              <div class="flex items-center">
                <div :class="cardLogoClass">
                  {{
                    group.name
                      .split(" ")
                      .map(gr => gr[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  }}
                </div>
                <div class="user-name">
                  <p class="list-card-item_detail--name">
                    {{ group.name }}
                  </p>
                  <p class="list-card-item_detail--desc">
                    {{ group?.customers?.length ?? 0 }} members
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="5" class="flex items-center">
              <div
                v-for="(item, key) in group?.customersDetail.slice(0, 4)"
                :key="item.id"
              >
                <div
                  class="list-card-item_detail--logo member"
                  :style="{ 'z-index': key }"
                >
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
              </div>
              <div
                v-if="group?.customersDetail.length > 4"
                class="list-card-item_detail--logo member quantity"
              >
                {{ group?.customersDetail.length - 4 }}
              </div>
            </el-col>
            <el-col
              :span="5"
              class="flex items-center list-card-item_accepts--chats"
              :class="{ accepting: group.onlineStatusCount }"
            >
              {{ group.onlineStatusCount }}/{{ group?.customersDetail.length }}
              accepting chats
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="3" class="flex items-center justify-end">
          <div class="list-card-item_detail--operation">
            <el-dropdown trigger="click">
              <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
              <template #dropdown v-if="userRole">
                <el-dropdown-menu :disabled="!group.status">
                  <el-dropdown-item @click="handleClickManage(group)">
                    Edit group
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleClickDelete(group)">
                    {{ statusGroup }} group
                  </el-dropdown-item>
                  <el-dropdown-item @click="goToReports(group.id)">
                    View reports
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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
      width: 38px;
      height: 38px;
      line-height: 38px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e0ebff;
      color: var(--color-blue);
      margin-right: 24px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;

      &__disabled {
        color: #a1c4ff;
      }

      &.member {
        width: 34px;
        height: 34px;
        min-width: 34px;
        margin-left: -10px;
        font-size: 16px;
        margin-right: 0;
        border: 2px solid white;
        position: relative;
        border-radius: 50%;
        overflow: hidden;
      }

      &.quantity {
        z-index: 5;
      }
    }

    &--operation {
      &--tag {
        border: 0;
      }
    }

    &--name {
      font-size: 15px;
      font-weight: 400;
      line-height: 22px;
      color: var(--content-default);
      display: inline-block;
      max-width: 100%;
    }

    &--desc {
      font-size: 14px;
      line-height: 20px;
      color: var(--content-subtle);
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

  &_accepts--chats {
    font-size: 13px;

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

    &.accepting::before {
      background-color: var(--color-positive-default);
    }
  }
}
</style>
