<script setup lang="ts">
import { useHooks } from "./hooks";
import ChartDescription from "./components/ChartDescription/index.vue";

const { chatsSatisfaction } = useHooks();
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-if="chatsSatisfaction.currentDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.currentDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.currentDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.currentDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.compareDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.compareDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.compareDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.compareDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.currentDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.currentDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.currentDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.currentDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.compareDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.compareDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsSatisfaction.compareDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsSatisfaction.compareDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
