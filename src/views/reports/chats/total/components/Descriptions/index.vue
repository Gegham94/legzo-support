<script setup lang="ts">
import { useHooks } from "./hooks";
import ChartDescription from "./components/ChartDescription/index.vue";

const { chatsTotal } = useHooks();
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-if="chatsTotal.currentDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.currentDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.currentDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.currentDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.compareDateCurrentAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.compareDateCurrentAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.compareDateCompareAgentCurrentGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.compareDateCompareAgentCurrentGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.currentDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.currentDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.currentDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.currentDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.compareDateCurrentAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.compareDateCurrentAgentCompareGroup"
        />
      </el-card>
    </el-col>
    <el-col
      v-if="chatsTotal.compareDateCompareAgentCompareGroup.label?.length"
      :span="6"
      class="mb-5"
    >
      <el-card shadow="hover">
        <ChartDescription
          :data="chatsTotal.compareDateCompareAgentCompareGroup"
        />
      </el-card>
    </el-col>
  </el-row>
</template>
