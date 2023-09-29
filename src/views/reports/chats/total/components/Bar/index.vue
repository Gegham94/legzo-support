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

const { dataTitles, dataSeries } = useHooks();

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>, {
  theme
});

setOptions({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
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
      type: "value"
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
