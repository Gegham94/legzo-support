<script setup lang="ts">
import { useFilterHooks } from "@/views/reports/components/Filter/components/hooks";
import { useHooks } from "./hooks";
import BarChartGroupedFill from "@iconify-icons/ri/bar-chart-grouped-fill";

defineOptions({
  name: "FilterGroup"
});

const props = defineProps({
  isCompare: {
    type: Boolean,
    default: true
  }
});

const { filters, groupList, ruleFormRef } = useHooks();
const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    :visible="filters.visible.group"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('group', filters.visible.group)"
      >
        <IconifyIconOffline
          :icon="BarChartGroupedFill"
          style="margin-right: 5px"
        />
        Group
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
          v-model="filters.filterGroups.current"
          class="m-2"
          placeholder="Select"
          size="large"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="props.isCompare"
        label="Compare to..."
        prop="compareGroup"
        style="margin-left: 10px"
      >
        <el-switch v-model="filters.filterGroups.compare.status" />
      </el-form-item>

      <el-form-item
        v-if="props.isCompare && filters.filterGroups.compare.status"
        label="Groups"
        prop="compareFiltersGroup"
      >
        <el-select
          v-model="filters.filterGroups.compare.data"
          class="m-2"
          placeholder="Select"
          size="large"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('group', true)">
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
