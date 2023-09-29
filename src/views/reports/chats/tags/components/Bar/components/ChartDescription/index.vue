<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "ChartDescription"
});

const props = defineProps({
  title: {
    type: String,
    default: () => ""
  },
  color: {
    type: String,
    default: () => ""
  },
  chatsCount: {
    type: Number,
    default: () => 0
  },
  chatsPercent: {
    type: Number,
    default: () => 0
  }
});

const setChartOptions = computed(() => {
  const count = props.chatsCount.toLocaleString("en-US");
  const percent = props.chatsPercent.toFixed(2);
  return {
    title: props.title,
    color: props.color,
    chatsCount: count,
    chatsPercent: percent
  };
});
</script>

<template>
  <div class="chart-tags-wrapper">
    <div class="chart-description">
      <div class="chart-description_title">
        <div
          class="chart-description_title--icon"
          :style="`background-color: ${setChartOptions.color}`"
        />
        <div class="chart-description_title--name">
          {{ setChartOptions.title }}
        </div>
      </div>
      <div class="chart-description_content">
        <div class="chart-description_content--count">
          {{ setChartOptions.chatsCount }}
        </div>
        <div class="chart-description_content--percent">
          ({{ setChartOptions.chatsPercent }}%)
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.chart-tags-wrapper {
  min-width: 170px;

  .chart-description {
    display: block;
    padding: 10px 16px;

    &_title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      &--icon {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        margin: 0 5px 0 0;
        flex: 0 0 auto;
        opacity: 0.6;
        box-shadow: 0px 0px 5px 0px var(--content-disabled);
      }

      &-name {
        word-wrap: none;
      }
    }

    &_content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: var(--content-basic-primary);
      min-width: 160px;
      font-weight: 600;
      margin-top: 4px;
      margin-bottom: 2px;
      margin-left: 16px;
      white-space: nowrap;

      &--count {
        font-size: 20px;
        line-height: 28px;
      }

      &--percent {
        color: var(--content-basic-primary);
        font-size: 14px;
        line-height: 20px;
        margin-left: 6px;
        background: var(--surface-secondary-default);
        padding: 0px 4px;
        border-radius: 4px;
      }
    }
  }
}
</style>
