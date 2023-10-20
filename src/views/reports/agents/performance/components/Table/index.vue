<script setup lang="ts">
import { ElAutoResizer } from "element-plus";
import { useHooks } from "./hooks";

const props = defineProps({
  sortBy: {
    type: Object,
    default: () => ({})
  },
  onSort: {
    type: Object,
    default: () => ({})
  }
});
const { columns, data } = useHooks();
</script>

<template>
  <div style="height: 75vh">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :sort-by="props.sortBy"
          :width="width"
          :height="height"
          fixed
          @column-sort="props.onSort"
        />
      </template>
    </el-auto-resizer>
  </div>
</template>
<style lang="scss">
.totals {
  .el-table-v2__header-row {
    border-top: 1px solid #ebeef5;
  }

  .el-table-v2__header-cell,
  .el-table-v2__row-cell {
    border-right: 0.5px solid #ebeef5;
    border-left: 0.5px solid #ebeef5;
    justify-content: space-around;
  }
}

.total-value {
  display: flex;
  justify-content: space-around;
  min-width: 150px;
}

.compare-value {
  text-align: center;
  min-width: 50px;
}

.compare-icon {
  width: 0;
  height: 0;
  border-style: solid;
  border-right-color: transparent;
  border-left-color: transparent;
  border-width: 7px 4px 0;

  &.text-green-600 {
    border-width: 0 4px 7px;
  }
}

.vs-value {
  padding: 0 5px;
  color: #acadae;
}

.current-value {
  text-align: center;
  display: flex;
  flex-direction: column;

  span {
    line-height: 1.1;
  }

  .difference-count {
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    margin-top: 5px;
  }
}
</style>
