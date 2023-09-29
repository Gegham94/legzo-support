<script setup lang="ts">
import { PropType } from "vue";
import { GetAgent } from "@/api/agents/interfaces";

defineOptions({
  name: "AgentCard"
});

defineProps({
  agent: {
    type: Object as PropType<GetAgent>
  }
});
</script>

<template>
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
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ agent.name }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ agent.email }}
      </p>
      <p
        v-if="agent.id"
        class="list-card-item_detail--desc text-text_color_regular"
      >
        ID: {{ agent.id }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  border-radius: 0;
  overflow: hidden;

  .main-info {
    cursor: pointer;
  }

  &_detail {
    flex: 1;
    padding: 8px 16px;
    border-top: 1px solid #efefef;

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
    }

    &--name {
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      font-size: 12px;
    }
  }
}
</style>
