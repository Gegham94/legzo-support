<script setup lang="ts">
import Descriptions from "./components/Descriptions/index.vue";
import Bar from "./components/Bar/index.vue";
import Table from "./components/Table/index.vue";
import Filter from "../../components/Filter/index.vue";
import { useHooks } from "./hooks";
import InformationLine from "@iconify-icons/ri/information-line";

defineOptions({
  name: "ReportAgentsResponseTime"
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
              <span class="font-medium"> Total chats </span>
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
            <div class="card-header flex gap-2 items-center">
              <el-tooltip
                raw-content
                placement="right"
                :content="`На этой диаграмме показано, сколько времени в среднем требуется агенту, чтобы<br />
                ответить на первое сообщение посетителя. В случае переданных чатов отсчет<br />
                ведется с момента назначения агента в чат.`"
              >
                <IconifyIconOffline :icon="InformationLine" />
              </el-tooltip>
              <span class="font-medium"> First response time </span>
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
              <span class="font-medium"> First response time breakdown </span>
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

<style lang="scss">
.el-tooltip__popper {
  max-width: 300px;
}
</style>
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
