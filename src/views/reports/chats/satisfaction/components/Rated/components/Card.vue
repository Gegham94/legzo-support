<script setup lang="ts">
import { PropType } from "vue";
import { ratedAgents } from "@/store/modules/types";
import ThumbDownLine from "@iconify-icons/ri/thumb-down-fill";
import ThumbUpLine from "@iconify-icons/ri/thumb-up-fill";
import AgentCard from "@/views/components/agent-card/index.vue";

defineOptions({
  name: "RatedCard"
});

defineProps({
  agent: {
    type: Object as PropType<ratedAgents>
  }
});
</script>

<template>
  <div class="list-card-item_detail bg-bg_color">
    <el-row>
      <el-col :span="9">
        <AgentCard :agent="agent" />
      </el-col>
      <el-col :span="3" class="card-count">
        <p class="list-card-item_detail--count text-text_color_regular">
          {{ agent.total }}
        </p>
      </el-col>
      <el-col :span="3" class="card-count text-green-600">
        <IconifyIconOffline :icon="ThumbUpLine" />
        <p class="list-card-item_detail--count text-text_color_regular">
          {{ agent.good }}
        </p>
      </el-col>
      <el-col :span="3" class="card-count text-red-600">
        <IconifyIconOffline :icon="ThumbDownLine" />
        <p class="list-card-item_detail--count text-text_color_regular">
          {{ agent.bad }}
        </p>
      </el-col>
      <el-col :span="3" class="card-count">
        <p class="list-card-item_detail--count text-text_color_regular">
          {{ agent.no_rated }}
        </p>
      </el-col>
      <el-col :span="3" class="card-count">
        <p class="list-card-item_detail--count text-text_color_regular">
          {{ agent.score }}
        </p>
      </el-col>
    </el-row>
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

    &--operation {
      &--tag {
        border: 0;
      }
    }

    &--name {
      font-size: 16px;
      font-weight: 400;
    }
  }
}

.card-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>
