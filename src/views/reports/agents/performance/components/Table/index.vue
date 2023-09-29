<script setup lang="ts">
import { ElAutoResizer } from "element-plus";
import { useHooks } from "./hooks";

const { columns, data } = useHooks();
</script>

<template>
  <div style="height: 75vh">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
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
  }
}
</style>
