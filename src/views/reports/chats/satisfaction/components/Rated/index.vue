<script setup lang="ts">
import { useHooks } from "./hooks/index";

import Header from "./components/Header.vue";
import Card from "./components/Card.vue";

const { getRatedAgents } = useHooks();
</script>

<template>
  <div
    v-loading="false"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-empty description="Not Data" v-show="getRatedAgents.length === 0" />
    <template v-if="getRatedAgents.length > 0">
      <el-row :gutter="24">
        <el-col>
          <Header />
        </el-col>
        <el-col
          v-for="(agent, index) in getRatedAgents"
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
