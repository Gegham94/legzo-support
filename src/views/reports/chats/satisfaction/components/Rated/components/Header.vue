<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "Header"
});

const cardClass = computed(() => ["list-card-item"]);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row>
        <el-col :span="9">
          <div
            class="flex items-center text-md text-text_color_regular font-bold"
          >
            <p class="mr-1 cursor-pointer">Name</p>
          </div>
        </el-col>
        <el-col
          :span="3"
          class="text-md text-text_color_regular text-center font-bold"
        >
          <p class="mr-1 cursor-pointer">Total</p>
        </el-col>
        <el-col
          :span="3"
          class="text-md text-text_color_regular text-center font-bold"
        >
          <p class="mr-1 cursor-pointer">Good</p>
        </el-col>
        <el-col
          :span="3"
          class="text-md text-text_color_regular text-center font-bold"
        >
          <p class="mr-1 cursor-pointer">Bad</p>
        </el-col>
        <el-col
          :span="3"
          class="text-md text-text_color_regular text-center font-bold"
        >
          <p class="mr-1 cursor-pointer">No rated</p>
        </el-col>
        <el-col
          :span="3"
          class="text-md text-text_color_regular text-center font-bold"
        >
          <p class="mr-1 cursor-pointer">Score</p>
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

  &_detail {
    flex: 1;
    padding: 8px 16px;
  }
}
</style>
