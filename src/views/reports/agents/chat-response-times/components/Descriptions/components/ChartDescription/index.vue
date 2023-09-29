<script setup lang="ts">
import { useHooks } from "../../hooks";

defineOptions({
  name: "ChartDescription"
});

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const { getTotalSumma, getTotalTime } = useHooks();
</script>

<template>
  <div class="chart-container">
    <div class="chart-data">
      <div
        class="chart-icon"
        :style="`background-color: ${props.data.color}`"
      />
      <div class="chart-desc">
        <div class="chart-date">{{ props.data.title.date }}</div>
        <div class="chart-group">{{ props.data.title.group }}</div>
        <div class="chart-agent">{{ props.data.title.agent }}</div>
        <div class="chart-date">
          <strong
            >Number of chat: {{ getTotalSumma(props.data?.count) }}</strong
          >
        </div>
      </div>
    </div>
    <div class="chart-count">
      {{ getTotalTime(props.data.first_response_time) }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.chart-container {
  overflow: hidden;
  padding-right: 16px;
  position: relative;
  box-sizing: border-box;
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

.chart-count {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: #424d57;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  min-width: 160px;
  margin-top: 4px;
  margin-bottom: 2px;
  margin-left: 22px;
  white-space: nowrap;
}
</style>
