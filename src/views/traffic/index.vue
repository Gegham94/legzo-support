<script setup lang="ts">
import Filter from "./components/Filter/index.vue";
import Table from "./components/Table/index.vue";
import { useTableHooks } from "./components/Table/hooks";
import { onMounted } from "vue";

const { fetchTableData, deleteFilter, dataLoading, tableData } =
  useTableHooks();

const sendFilter = (filter, selectedMatch, statusType) => {
  fetchTableData(filter, selectedMatch, statusType);
};
const removeFilter = (filterId, isUpdateTableData) => {
  deleteFilter(filterId, isUpdateTableData);
};

onMounted(async () => {
  await fetchTableData(null, "match-all", "all-customers");
});
</script>

<template>
  <div class="traffic">
    <Filter @send-filter="sendFilter" @remove-filter="removeFilter" />
    <Table :dataLoading="dataLoading" :tableData="tableData" />
  </div>
</template>
