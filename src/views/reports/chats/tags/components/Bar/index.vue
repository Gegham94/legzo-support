<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import ChartDescription from "./components/ChartDescription/index.vue";
import {
  delay,
  useDark,
  useECharts,
  type EchartOptions
} from "@pureadmin/utils";
import { useHooks } from "./hooks";

const { isDark } = useDark();
const theme: EchartOptions["theme"] = computed(() => {
  return isDark.value ? "dark" : "light";
});
const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions, resize } = useECharts(barChartRef as Ref<HTMLDivElement>, {
  theme
});

const {
  chatParams,
  taggedChatsColor,
  taggedChatsCount,
  taggedChatsPercent,
  notTaggedChatsColor,
  notTaggedChatsCount,
  notTaggedChatsPercent
} = useHooks();

// @ts-expect-error
setOptions(chatParams);
watch(
  () => useAppStoreHook().getSidebarStatus,
  () => {
    delay(600).then(() => resize());
  }
);
watch(chatParams, () => {
  setTimeout(() => {
    // @ts-expect-error
    setOptions(chatParams);
    resize();
  }, 500);
});
</script>

<template>
  <div class="description-tags">
    <div>
      <ChartDescription
        :title="'Tagged chats'"
        :color="taggedChatsColor"
        :chatsCount="taggedChatsCount"
        :chatsPercent="taggedChatsPercent"
      />
    </div>
    <div>
      <ChartDescription
        :title="'Not tagged chats'"
        :color="notTaggedChatsColor"
        :chatsCount="notTaggedChatsCount"
        :chatsPercent="notTaggedChatsPercent"
      />
    </div>
  </div>
  <div ref="barChartRef" style="width: 100%; height: 60vh" />
</template>

<style>
.description-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 22px;
}
</style>
