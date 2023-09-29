<script setup lang="ts">
import { useHooks } from "./hooks/index";

import Card from "./components/Card.vue";
import Header from "./components/Header.vue";

const { getAgentsActivity } = useHooks();
</script>

<template>
  <div
    v-loading="false"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-empty description="Not Data" v-show="getAgentsActivity?.length === 0" />
    <template v-if="getAgentsActivity?.length > 0">
      <el-row :gutter="24">
        <el-col :span="24" class="mb-1">
          <Header />
        </el-col>
        <el-col
          v-for="(agent, index) in getAgentsActivity"
          :key="index"
          :span="24"
          class="mb-1"
        >
          <Card :agent="agent" />
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<style lang="scss"></style>
