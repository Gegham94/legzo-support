<script setup lang="ts">
import { useFilterHooks } from "../hooks";
import { useHooks } from "./hooks";
import Emotion from "@iconify-icons/ri/thumb-up-line";

defineOptions({
  name: "FilterRating"
});

const { filters, dataList, ruleFormRef } = useHooks();
const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    key="FilterRating"
    :visible="filters.visible.rating"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('rating', filters.visible.rating)"
      >
        <IconifyIconOffline :icon="Emotion" style="margin-right: 5px" />
        Rating
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Rating" prop="rating">
        <el-select
          v-model="filters.filterRating"
          class="m-2"
          placeholder="Select"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in dataList"
            :key="item.code"
            :label="item.label"
            :value="item.code"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('rating', true)">
          Done
        </el-button>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<style lang="scss">
.el-form-item {
  align-items: center;
}
</style>
