<script setup lang="ts">
import { useHooks } from "./hooks";
import CalendarFill from "@iconify-icons/ri/calendar-2-fill";
import { useFilterHooks } from "../hooks";

defineOptions({
  name: "FilterDate"
});

const props = defineProps({
  isSinglePeriod: {
    type: Boolean,
    default: false
  }
});

const { options, dateIntervalCalc, ruleFormRef, getIntervalLabel, filters } =
  useHooks(props.isSinglePeriod);

const disabledDateCurrent = (time: Date) => {
  const fromDate = new Date(filters.value.filterDate.current.from);
  return fromDate && time < fromDate;
};

const { setVisible } = useFilterHooks();
</script>

<template>
  <el-popover
    :visible="filters.visible.date"
    placement="bottom"
    :width="500"
    trigger="click"
  >
    <template #reference>
      <el-button
        type="primary"
        plain
        @click="setVisible('date', filters.visible.date)"
      >
        <IconifyIconOffline :icon="CalendarFill" style="margin-right: 5px" />
        {{ getIntervalLabel() }}
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Interval" prop="interval">
        <el-select-v2
          v-model="filters.filterDate.current.interval"
          placeholder="Select interval"
          style="width: 100%"
          :options="options"
          :height="240"
          @change="dateIntervalCalc"
        />
      </el-form-item>
      <el-form-item
        v-if="filters.filterDate.current.interval === 'custom_period'"
        label="Custom period"
        required
      >
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              v-model="filters.filterDate.current.from"
              value-format="x"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker
              v-model="filters.filterDate.current.to"
              value-format="x"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
              :disabled-date="disabledDateCurrent"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="filters.filterDate.current.interval === 'custom_day'"
        label="Custom date"
        required
      >
        <el-col :span="11">
          <el-form-item prop="date">
            <el-date-picker
              v-model="filters.filterDate.current.date"
              value-format="x"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setVisible('date', true)">
          Done
        </el-button>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<style lang="scss" scoped></style>
