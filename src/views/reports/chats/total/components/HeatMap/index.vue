<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
import { useHooks } from "./hooks/index";

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const heatMapRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(heatMapRef as Ref<HTMLDivElement>, {
  theme
});

const { chatsTotal } = useHooks();

setOptions(
  {
    tooltip: {
      position: "top"
    },
    grid: {
      height: "80%",
      top: "5%",
      left: "5%",
      right: "5%",
      bottom: "10%"
    },
    xAxis: {
      type: "category",
      data: chatsTotal.value.currentHours.labelX as [],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: "category",
      data: chatsTotal.value.currentHours.labelY as [],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: chatsTotal.value.currentHours.maxValue,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "0",
      inRange: {
        color: ["#f5f9ff", "#53a7ff"]
      }
    },
    series: [
      {
        name: "Chats",
        type: "heatmap",
        data: chatsTotal.value.currentHours.count as [],
        label: {
          show: chatsTotal.value.currentHours.count.length < 10
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: "#fff",
          borderRadius: 4
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            shadowBlur: 5,
            shadowColor: "#53a7ff"
          }
        }
      }
    ]
  },
  {
    name: "click",
    callback: params => {
      console.log("click", params);
    }
  }
);

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="heatMapRef" style="width: 100%; height: 75vh" />
</template>
