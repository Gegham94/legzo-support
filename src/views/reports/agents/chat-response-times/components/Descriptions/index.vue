<script setup lang="ts">
import { useHooks } from "./hooks";
import ChartDescription from "./components/ChartDescription/index.vue";

const { agentsResponseTime } = useHooks();
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-if="
        agentsResponseTime.currentDateCurrentAgentCurrentGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.currentDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.currentDateCompareAgentCurrentGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.currentDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.compareDateCurrentAgentCurrentGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.compareDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.compareDateCompareAgentCurrentGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.compareDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.currentDateCurrentAgentCompareGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.currentDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.currentDateCompareAgentCompareGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.currentDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.compareDateCurrentAgentCompareGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.compareDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="
        agentsResponseTime.compareDateCompareAgentCompareGroup.label?.length
      "
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="agentsResponseTime.compareDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
