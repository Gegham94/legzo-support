<script setup lang="ts">
import { useFilterHooks } from "@/views/reports/components/Filter/components/hooks";
import { useHooks } from "./hooks";
import MapPin from "@iconify-icons/ri/map-pin-2-line";

defineOptions({
  name: "FilterCountry"
});

const { filters, dataList, ruleFormRef } = useHooks();
const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    key="FilterCountry"
    :visible="filters.visible.country"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('country', filters.visible.country)"
      >
        <IconifyIconOffline :icon="MapPin" style="margin-right: 5px" />
        Country
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Country" prop="country">
        <el-select
          v-model="filters.filterCountry"
          class="m-2"
          placeholder="Select"
          size="large"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in dataList"
            :key="item"
            :label="item"
            :value="item"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('country', true)">
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
