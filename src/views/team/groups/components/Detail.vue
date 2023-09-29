<script setup lang="ts">
import { PropType, computed } from "vue";
import { GetGroup } from "@/api/groups/interfaces";
import { useGroups } from "@/views/team/groups/hooks";

defineOptions({
  name: "Detail"
});

const props = defineProps({
  group: {
    type: Object as PropType<GetGroup>
  }
});

const { showMoreCustomers, isShowMore, showCustomersCount } = useGroups();

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.group.status }
]);

const showCustomersDetail = computed(() => {
  return props.group.customersDetail.slice(0, showCustomersCount.value);
});
</script>

<template>
  <div class="sticky top-2 detail" :class="cardClass">
    <el-row class="detail-row">
      <el-col :span="24" class="flex">
        <div class="flex user-main-info">
          <div class="list-card-item_detail--logo">
            <span>
              {{ group.name[0].toUpperCase() }}
            </span>
          </div>
          <div class="user-name">
            <p class="list-card-item_detail--name text-text_color_primary">
              {{ group.name }}
            </p>
            <p class="list-card-item_detail--desc text-text_color_regular">
              ID: {{ group.id }}
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="detail-row">
      <h4 class="mb-4">Members ({{ group?.customers?.length }})</h4>
      <el-col :span="24">
        <div
          v-for="item in showCustomersDetail"
          :key="item.id"
          class="flex items-center mb-1.5"
        >
          <div class="list-card-item_detail--logo customer">
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
        v-if="group?.customers?.length > 3"
        @click="showMoreCustomers(group)"
        type="primary"
        link
        class="mt-2.5"
      >
        <span v-if="isShowMore"> Hide </span>
        <span v-else> Show {{ group?.customers?.length - 3 }} more </span>
      </el-button>
    </el-row>
    <el-row class="detail-row">
      <h4 class="mb-4">Performance</h4>
      <el-col :span="24">
        <p class="list-card-item_detail--name text-text_color_primary">
          Total chats: <strong>{{ group.performance?.total }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Chats during last 7 days:
          <strong>{{ group.performance?.past_7_days }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Rated good: <strong>{{ group.performance?.satisfaction }}</strong>
        </p>
        <p class="list-card-item_detail--name text-text_color_primary">
          Rated good last 7 days:
          <strong>{{ group.performance?.satisfaction_past_7_days }}</strong>
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
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e0ebff;
      font-size: 32px;
      color: var(--color-blue);
      margin-right: 24px;
      border-radius: 4px;
      font-weight: 600;
      width: 64px;
      height: 64px;
      line-height: 64px;
      text-align: center;
      overflow: hidden;

      &__disabled {
        color: #a1c4ff;
      }

      &.customer {
        position: relative;
        box-sizing: border-box;
        border: 2px solid var(--surface-secondary-default);
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
