<script setup lang="ts">
import FilterAgent from "./components/Agent/index.vue";
import FilterDate from "./components/Date/index.vue";
import FilterGroup from "./components/Group/index.vue";
import FilterTag from "./components/Tag/index.vue";
import FilterCountry from "./components/Country/index.vue";
import FilterRating from "./components/Rating/index.vue";

import { useArchiveRoomsStore } from "@/store/modules/archiveRooms";
import { storeToRefs } from "pinia";

defineOptions({
  name: "Filters"
});

const reportStore = useArchiveRoomsStore();
const { filters } = storeToRefs(reportStore);
</script>

<template>
  <div
    class="bg-bg_color w-100 pl-4 pt-5 flex sticky top-0 z-20 shadow mb-4 mt-1"
  >
    <el-form ref="formRef" :inline="true">
      <el-form-item prop="filter">
        <el-select
          v-model="filters.filterList"
          placeholder="Add filter"
          clearable
          class="!w-[320px]"
          multiple
        >
          <el-option label="Date" value="date" />
          <el-option label="Agent" value="agent" />
          <el-option label="Group" value="group" />
          <el-option label="Tag" value="tag" />
          <el-option label="Country" value="country" />
          <el-option label="Rating" value="rating" />
        </el-select>
      </el-form-item>
    </el-form>

    <FilterDate v-if="filters.filterList?.includes('date')" />
    <FilterAgent v-if="filters.filterList?.includes('agent')" />
    <FilterGroup v-if="filters.filterList?.includes('group')" />
    <FilterTag v-if="filters.filterList?.includes('tag')" />
    <FilterCountry v-if="filters.filterList?.includes('country')" />
    <FilterRating v-if="filters.filterList?.includes('rating')" />
  </div>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  margin-right: 12px;
}
</style>
