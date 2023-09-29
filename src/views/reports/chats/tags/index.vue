<script setup lang="ts">
import Bar from "./components/Bar/index.vue";
import Header from "./components/Table/Header.vue";
import Card from "./components/Table/Card.vue";
import Filter from "@/views/reports/components/Filter/index.vue";
import { useHooks } from "./hooks/index";

defineOptions({
  name: "ReportsChatsTags"
});

const {
  dataLoading,
  tableData,
  handleCheckedTags,
  checkedTags,
  handleSort,
  pagination,
  totalCount,
  onPageSizeChange,
  onCurrentChange
} = useHooks();
</script>

<template>
  <div class="totals">
    <Filter
      :is-group-compare="false"
      :is-date-compare="false"
      :is-agent-compare="false"
    />
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
              <span class="font-medium"> Tags usage </span>
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
              <span class="font-medium"> Tags usage breakdown</span>
            </div>
          </template>

          <el-row :gutter="16">
            <el-col>
              <el-row :gutter="16">
                <el-col>
                  <Header :sort="pagination.sort" @handle-sort="handleSort" />
                </el-col>
                <el-col
                  v-for="(usageTag, index) in tableData"
                  :key="index"
                  :span="24"
                  class="team_table"
                >
                  <Card
                    :usageTag="usageTag"
                    :checkedTags="checkedTags"
                    @handle-checked-tags="handleCheckedTags"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-pagination
            class="float-right pt-4 pb-4 mr-6"
            v-model:currentPage="pagination.page"
            :page-size="pagination.perPage"
            :total="totalCount"
            :page-sizes="[20, 40, 80]"
            :background="true"
            layout="sizes, prev, pager, next, jumper"
            @size-change="onPageSizeChange"
            @current-change="onCurrentChange"
          />
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
