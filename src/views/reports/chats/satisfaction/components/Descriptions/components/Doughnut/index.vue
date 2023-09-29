<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const { isDark } = useDark();

const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(lineChartRef as Ref<HTMLDivElement>, {
  theme
});

setOptions({
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["70%", "90%"],
      tooltip: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: ["#4bb678", "#d64746"],
      data: [
        { value: props.data?.good, name: "Good" },
        { value: props.data?.bad, name: "Bad" }
      ]
    }
  ]
});

watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
</script>

<template>
  <div ref="lineChartRef" style="width: 100px; height: 100px" />
</template>
