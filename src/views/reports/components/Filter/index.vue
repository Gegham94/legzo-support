<script setup lang="ts">
import FilterAgent from "./components/Agent/index.vue";
import FilterDate from "./components/Date/index.vue";
import FilterGroup from "./components/Group/index.vue";
import FilterTag from "./components/Tag/index.vue";

import { useReportStore } from "@/store/modules/reports";
import { storeToRefs } from "pinia";

defineOptions({
  name: "Filters"
});

const props = defineProps({
  isGroup: {
    type: Boolean,
    default: true
  },
  isAgent: {
    type: Boolean,
    default: true
  },
  isDateCompare: {
    type: Boolean,
    default: true
  },
  isGroupCompare: {
    type: Boolean,
    default: true
  },
  isAgentCompare: {
    type: Boolean,
    default: true
  },
  isTag: {
    type: Boolean,
    default: true
  },
  isSinglePeriod: {
    type: Boolean,
    default: false
  }
});

const reportStore = useReportStore();
const { filters } = storeToRefs(reportStore);
</script>

<template>
  <div class="bg-bg_color w-100 pl-8 pt-5 flex sticky top-0 z-10 shadow">
    <el-form ref="formRef" :inline="true">
      <el-form-item label="Filter：" prop="filter">
        <el-select
          v-model="filters.filterList"
          placeholder="Add filter"
          clearable
          class="!w-[320px]"
          multiple
        >
          <el-option v-if="props.isAgent" label="Agent" value="agent" />
          <el-option v-if="props.isGroup" label="Group" value="group" />
          <el-option v-if="props.isTag" label="Tag" value="tag" />
        </el-select>
      </el-form-item>
    </el-form>

    <FilterDate
      :is-compare="isDateCompare"
      :is-single-period="isSinglePeriod"
    />
    <FilterAgent
      v-if="props.isAgent && filters.filterList?.includes('agent')"
      :is-compare="isAgentCompare"
    />
    <FilterGroup
      v-if="props.isGroup && filters.filterList?.includes('group')"
      :is-compare="isGroupCompare"
    />
    <FilterTag v-if="props.isTag && filters.filterList?.includes('tag')" />
  </div>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  margin-right: 12px;
}
</style>
