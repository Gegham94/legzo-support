<script setup lang="ts">
import { useHooks } from "../../hooks";
import Doughnut from "../Doughnut/index.vue";

defineOptions({
  name: "ChartDescription"
});

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const { getTotalSumma } = useHooks();
</script>

<template>
  <div class="chart-container">
    <div class="chart-data">
      <Doughnut :data="props.data" />
      <div class="chart-desc">
        <div class="chart-date">
          <el-tooltip
            class="item"
            :content="props.data.title.date"
            placement="bottom"
            popper-class="pure-tooltip"
          >
            {{ props.data.title.date }}
          </el-tooltip>
        </div>
        <div class="chart-group">
          <el-tooltip
            class="item"
            :content="props.data.title.group"
            placement="bottom"
            popper-class="pure-tooltip"
          >
            {{ props.data.title.group }}
          </el-tooltip>
        </div>
        <div class="chart-agent">
          <el-tooltip
            class="item"
            :content="props.data.title.agent"
            placement="bottom"
            popper-class="pure-tooltip"
          >
            {{ props.data.title.agent }}
          </el-tooltip>
        </div>
        <div class="chart-desc-counts">
          <div class="chart-count good">
            Good: {{ getTotalSumma(props.data.good) }}
          </div>
          <div class="chart-count bad">
            Bad: {{ getTotalSumma(props.data.bad) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.chart-container {
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.chart-data {
  display: flex;
  align-items: center;
  gap: 15px;

  & > div {
    flex: 1;
  }
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
  max-width: 60%;
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

.chart-desc-counts {
  margin-top: 15px;
}

.chart-count {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: #424d57;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
}

.good {
  color: #4bb678;
}

.bad {
  color: #d64746;
}
</style>
