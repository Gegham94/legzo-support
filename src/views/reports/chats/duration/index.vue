<script setup lang="ts">
import Bar from "./components/Bar/index.vue";
import Table from "./components/Table/index.vue";
import Descriptions from "./components/Descriptions/index.vue";
import Filter from "../../components/Filter/index.vue";
import { useHooks } from "./hooks";

defineOptions({
  name: "ReportChatsDuration"
});

const { dataLoading } = useHooks();
</script>

<template>
  <div class="totals">
    <Filter />
    <el-row :gutter="24" style="margin: 20px">
      <el-col
        :xs="24"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="font-medium"> Chat duration </span>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="dataLoading">
            <template #default>
              <Descriptions />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="font-medium"> Chat duration </span>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="dataLoading">
            <template #default>
              <Bar />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <div class="card-header">
              <span class="font-medium"> Chat duration breakdown </span>
            </div>
          </template>
          <el-skeleton animated :rows="7" :loading="dataLoading">
            <template #default>
              <Table />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 0 !important;
}

.welcome {
  height: 100%;
}
</style>
