<script setup lang="ts">
import { useFilterHooks } from "@/views/reports/components/Filter/components/hooks";

defineOptions({
  name: "FilterGroup"
});
import { useHooks } from "./hooks";
import UserSearchLine from "@iconify-icons/ri/team-line";

const { filters, dataList, ruleFormRef } = useHooks();
const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    key="FilterGroup"
    :visible="filters.visible.tag"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('tag', filters.visible.tag)"
      >
        <IconifyIconOffline :icon="UserSearchLine" style="margin-right: 5px" />
        Tag
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Groups" prop="group">
        <el-select
          v-model="filters.filterTags"
          class="m-2"
          placeholder="Select"
          size="large"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in dataList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('tag', true)">
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
