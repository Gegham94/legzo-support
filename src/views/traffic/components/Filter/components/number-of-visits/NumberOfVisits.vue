<script setup lang="ts">
import SvgIcon from "@/lib/components/SvgIcon/SvgIcon.vue";
import { useNumberOfVisitsHooks } from "./hooks";
import { onMounted, ref } from "vue";
import { TrafficFilter } from "@/api/traffic/interfaces";

defineOptions({
  name: "NumberOfVisits"
});
const {
  isInputsEmpty,
  radioValue,
  selectIsExactlyValue,
  selectIsNotValue,
  selectIsGreaterThanValue,
  selectIsGreaterOrEqualValue,
  selectIsLessThanValue,
  selectIsLessOrEqualValue,
  selectIsBetweenFromValue,
  selectIsBetweenToValue,
  filter
} = useNumberOfVisitsHooks();

const props = defineProps({
  filter: {
    type: Object as PropType<TrafficFilter>,
    default: () => null
  }
});

const hoveringOnFilter = ref(false);
const isFiltered = ref(false);

const emit = defineEmits([
  "remove-filter",
  "apply-filter",
  "show-filter-button"
]);
const openFilter = () => {
  filter.value.isOpen = true;
  emit("show-filter-button", false);
};
const closeFilter = (byApply?) => {
  if (byApply) {
    filter.value.used = true;
  } else if (isFiltered.value) {
    filter.value.used = true;
  } else {
    filter.value.used = false;
    removeFilter();
  }
  filter.value.isOpen = false;
  emit("show-filter-button", true);
};
const removeFilter = () => {
  emit("remove-filter", filter.value.id);
};
const applyFilter = () => {
  emit("apply-filter", filter);
  emit("show-filter-button", true);
};
const submit = () => {
  isFiltered.value = true;
  applyFilter();
  closeFilter(true);
};

onMounted(() => {
  if (props.filter) {
    filter.value = props?.filter;
  }
});
</script>

<template>
  <div class="filter">
    <el-tooltip
      content="Number of visits"
      placement="top"
      popper-class="pure-tooltip"
    >
      <div
        class="filter_state"
        @mouseenter="hoveringOnFilter = true"
        @mouseleave="hoveringOnFilter = false"
        @click="openFilter"
      >
        <svg-icon
          :name="hoveringOnFilter ? 'cross' : 'visits'"
          class="filter_state-icon"
          @click="removeFilter"
        />
        <div class="filter_state-text">
          <strong class="filter_state-text-label"
            >{{ filter.label }} {{ filter.params.key }}</strong
          >
          <span
            v-if="filter.params[Object.keys(filter.params)[0]].length === 1"
          >
            {{ filter.params[Object.keys(filter.params)[0]][0] }}
          </span>
          <span v-else>
            <span
              v-for="filterItem in filter.params[Object.keys(filter.params)[0]]"
              :key="filterItem"
              >{{ filterItem }} or
            </span>
          </span>
        </div>
      </div>
    </el-tooltip>
    <div class="content-wrapper" v-show="filter.isOpen">
      <div class="content-wrapper_header">
        <div class="title">
          <svg-icon name="visits" class="title-icon" />
          <div class="title-text">
            <strong>Number of visits</strong>
          </div>
        </div>
        <svg-icon name="cross" class="cross" @click="closeFilter()" />
      </div>
      <div class="content-wrapper_body">
        <el-radio-group v-model="radioValue" class="radio-group">
          <el-radio label="is_exactly" size="large">is exactly</el-radio>
          <el-input-number
            v-show="radioValue === 'is_exactly'"
            v-model="selectIsExactlyValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_not" size="large">is not</el-radio>
          <el-input-number
            v-show="radioValue === 'is_not'"
            v-model="selectIsNotValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_greater_than" size="large"
            >is greater than</el-radio
          >
          <el-input-number
            v-show="radioValue === 'is_greater_than'"
            v-model="selectIsGreaterThanValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_greater_or_equal" size="large"
            >is greater than or equal to</el-radio
          >
          <el-input-number
            v-show="radioValue === 'is_greater_or_equal'"
            v-model="selectIsGreaterOrEqualValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_less_than" size="large">is less than</el-radio>
          <el-input-number
            v-show="radioValue === 'is_less_than'"
            v-model="selectIsLessThanValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_less_or_equal" size="large"
            >is less than or equal to</el-radio
          >
          <el-input-number
            v-show="radioValue === 'is_less_or_equal'"
            v-model="selectIsLessOrEqualValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />

          <el-radio label="is_between" size="large">is between</el-radio>
          <el-input-number
            v-show="radioValue === 'is_between'"
            v-model="selectIsBetweenFromValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />
          <el-input-number
            v-show="radioValue === 'is_between'"
            v-model="selectIsBetweenToValue"
            class="ml-5 number-input"
            :min="1"
            controls-position="right"
          />
        </el-radio-group>
      </div>
      <div class="content-wrapper_action">
        <el-button
          :disabled="isInputsEmpty"
          type="primary"
          class="mt-2 mb-2 apply"
          @click="submit()"
          >Apply</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  &_state {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    width: 220px;
    background: var(--surface-tertiary-default);
    box-shadow: 0px 0px 0px 0.6px var(--border-default);
    border-radius: 4px;
    padding: 0px 10px;
    cursor: pointer;

    &-icon {
      margin-right: 5px;
      border-radius: 2px;
      width: 20px;
      height: 20px;
    }

    &-icon:hover {
      background: var(--border-default);
    }

    &-text {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 31px;
      font-size: 14px;
      color: var(--content-text-default);

      &-label {
        margin-right: 3px;
      }
    }
  }

  .content-wrapper {
    position: absolute;
    top: 37px;
    z-index: 999;
    min-width: 220px;
    max-width: 360px;
    background: var(--surface-primary-default);
    box-shadow: 0px 0px 5px 0px var(--content-disabled);
    padding: 12px;

    &_header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;

        &-icon {
          margin-right: 5px;
          width: 20px;
          height: 20px;
        }

        &-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 32px;
          font-size: 14px;
          color: var(--content-text-default);
        }
      }

      .cross {
        cursor: pointer;
      }
    }

    &_body {
      .radio-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }

    &_action {
      width: 100%;

      .el-button {
        width: 100%;
        padding: 18px;
      }
    }
  }
}

:deep(.number-input) {
  width: 80px;
  margin-bottom: 5px;
}

:deep(.el-input-number__decrease) {
  width: 20px;
}

:deep(.el-input-number__increase) {
  width: 20px;
}
</style>
