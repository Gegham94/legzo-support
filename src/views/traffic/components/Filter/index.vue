<script setup lang="ts">
import type { TabsPaneContext } from "element-plus";
import AddedFilter from "./AddedFilter.vue";
import { useFilterHooks } from "./hooks";
import { onMounted, ref } from "vue";
import { TrafficCounter } from "@/api/traffic/interfaces";
import { RequestResult } from "@/api/interfaces";
import { http } from "@/utils/http";

defineOptions({
  name: "Filter"
});

const { filterMatchOptions } = useFilterHooks();
const statusType = ref("all-customers");
const selectedMatch = ref("match-all");
const trafficCounters = ref<TrafficCounter>({
  "all-customers": 0,
  chatting: 0,
  supervised: 0,
  queued: 0,
  inactive: 0
});
const emit = defineEmits(["send-filter", "remove-filter"]);
let filterParams = {};

const handleTabClick = (tab: TabsPaneContext) => {
  statusType.value = tab.props.name.toString();
  emit("send-filter", filterParams, selectedMatch.value, statusType.value);
};

const handleMatchClick = matchValue => {
  selectedMatch.value = matchValue.toString();
  emit("send-filter", filterParams, selectedMatch.value, statusType.value);
};

const sendFilter = filter => {
  filterParams = filter && filter?.value ? filter.value : null;
  emit("send-filter", filterParams, selectedMatch.value, statusType.value);
};

const removeFilter = (filterId, isUpdateTableData) => {
  emit("remove-filter", filterId, isUpdateTableData);
};

const getTrafficCounters = async () => {
  try {
    const { data } = await http.get<void, RequestResult<TrafficCounter>>(
      `/managers/traffic/count`
    );
    trafficCounters.value = data;
  } catch (error) {
    console.error("Error fetching traffic counters:", error);
  }
};

onMounted(async () => {
  await getTrafficCounters();
});
</script>

<template>
  <div class="traffic-filter">
    <div class="traffic-filter__tabs">
      <el-tabs v-model="statusType" @tab-click="handleTabClick">
        <el-tab-pane
          :label="`All customers(${trafficCounters['all-customers']})`"
          name="all-customers"
        />
        <el-tab-pane
          :label="`Chatting(${trafficCounters.chatting})`"
          name="chatting"
        />
        <el-tab-pane
          :label="`Supervised(${trafficCounters.supervised})`"
          name="supervised"
        />
        <el-tab-pane
          :label="`Queued(${trafficCounters.queued})`"
          name="queued"
        />
        <el-tab-pane
          :label="`Inactive(${trafficCounters.inactive})`"
          name="inactive"
        />

        <!-- NEED IN FUTURE -->
        <!-- <el-tab-pane :label="`Waiting for reply()`" name="waiting-reply" /> -->
        <!-- <el-tab-pane :label="`Invited()`" name="invited" /> -->
        <!-- <el-tab-pane :label="`Browsing()`" name="browsing" /> -->
      </el-tabs>
    </div>
    <div class="traffic-filter__select-add">
      <el-row>
        <el-select
          v-model="selectedMatch"
          class="mb-2 mr-1"
          placeholder="Select matching filter"
        >
          <el-option
            v-for="item in filterMatchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click="handleMatchClick(item.value)"
          />
        </el-select>
        <div class="mr-1 mb-2 traffic-filter__select-add-selected--add-filter">
          <AddedFilter
            @send-filter="sendFilter"
            @remove-filter="removeFilter"
          />
        </div>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.traffic-filter {
  &__select-add {
    &-selected--add-filter {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
