<script setup lang="ts">
import { useHooks } from "./hooks";
import ChartDescription from "./components/ChartDescription/index.vue";

const { chatsDuration } = useHooks();
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-if="chatsDuration.currentDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.currentDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.currentDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.currentDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.compareDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.compareDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.compareDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.compareDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.currentDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.currentDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.currentDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.currentDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.compareDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.compareDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsDuration.compareDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsDuration.compareDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
