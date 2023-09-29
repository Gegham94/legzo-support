<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
import { useHooks } from "./hooks";
import moment from "moment";

const { dataTitles, dataSeries } = useHooks();

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>, {
  theme
});

const timeFormatter = seconds => {
  if (seconds >= 3600) {
    return moment.utc(seconds * 1000).format("H[h] m[m] s[s]");
  } else if (seconds >= 60) {
    return moment.utc(seconds * 1000).format("m[m] s[s]");
  } else {
    return moment.utc(seconds * 1000).format("s[s]");
  }
};

setOptions({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    },
    formatter: function (params) {
      const formatedTime = params.map(param => {
        const originalTime = param.value;
        const formattedValue = timeFormatter(originalTime);
        return `${formattedValue}`;
      });
      const tooltipContent = `
      <div>${params[0].axisValueLabel}</div>
      <div>${params[0].marker}
        <span>${params[0].seriesName}</span>
        <span style="margin-left:15px;font-weight:600">${formatedTime}</span>
      </div>
      `;
      return tooltipContent;
    }
  },
  toolbox: {
    show: true,
    orient: "vertical",
    left: "right",
    top: "center"
  },
  xAxis: [
    {
      type: "category",
      axisTick: { show: false },
      data: dataTitles
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        formatter: function (seconds) {
          return timeFormatter(seconds);
        }
      }
    }
  ],
  series: dataSeries
});

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="barChartRef" style="width: 100%; height: 60vh" />
</template>
