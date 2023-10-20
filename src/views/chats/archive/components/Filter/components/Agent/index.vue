<script setup lang="ts">
import { useFilterHooks } from "../hooks";
import { useHooks } from "./hooks";
import UserSearchLine from "@iconify-icons/ri/group-line";

defineOptions({
  name: "FilterAgent"
});

const { filters, agentList, ruleFormRef } = useHooks();
const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    key="FilterAgent"
    :visible="filters.visible.agent"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('agent', filters.visible.agent)"
      >
        <IconifyIconOffline :icon="UserSearchLine" style="margin-right: 5px" />
        Agent
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Agents" prop="agent">
        <el-select
          v-model="filters.filterAgents.current"
          class="m-2"
          placeholder="Select"
          size="large"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in agentList"
            :key="item.id"
            :label="item.email"
            :value="item.id"
            style="width: 100%"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('agent', true)">
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
