<script setup lang="ts">
import { useHooks } from "./hooks";

const { cardList, getTotalTime } = useHooks();
</script>

<template>
  <el-row :gutter="15">
    <el-col v-for="(item, index) in cardList" :key="index" :span="4">
      <el-card shadow="hover">
        <div class="chart-container">
          <div class="chart-title">{{ item.title }}</div>
          <span
            v-if="item.title === 'First response time'"
            style="font-weight: 600"
            >{{ getTotalTime([item.currentCount]) }}</span
          >
          <span v-else style="font-weight: 600">{{ item.currentCount }}</span>
          <div class="chart-compare">
            <div
              class="compare-icon"
              :class="item.difference > 0 ? 'text-green-600' : 'text-red-600'"
            />
            <div
              class="compare-count"
              :class="item.difference > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ item.compareCount }}
              <span v-if="item.title === 'First response time'">{{
                `(${getTotalTime([item.difference])})`
              }}</span>
              <span v-else>{{
                item.difference !== 0 ? `(${item.difference})` : ""
              }}</span>
            </div>
          </div>
          <div class="compare-period">from compared period</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<style scoped lang="scss">
.chart-container {
  overflow: hidden;
  padding-right: 16px;
  position: relative;
  box-sizing: border-box;
}

.chart-title {
  font-weight: 600;
  color: #424d57;
}

.chart-count {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: #424d57;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  white-space: nowrap;
  padding: 5px 0;
}

.chart-compare {
  display: flex;
  font-size: 14px;
  line-height: 22px;
  gap: 5px;

  .compare-icon {
    width: 0;
    height: 0;
    border-style: solid;
    border-right-color: transparent;
    border-left-color: transparent;
    border-width: 7px 4px 0;
    margin-top: 7px;
  }
}

.compare-period {
  color: #677179;
  font-size: 13px;
}

.chart-data {
  display: flex;
}

.chart-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 10px;
  margin-top: 5px;
  flex: 0 0 auto;
}

.chart-desc {
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #424d57;
  max-width: 100%;
}

.chart-date {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 22px;
  font-weight: 400;
  color: #424d57;
  max-width: 100%;
}

.chart-group {
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-agent {
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
