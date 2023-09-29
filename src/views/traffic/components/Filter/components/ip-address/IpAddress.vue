<script setup lang="ts">
import SvgIcon from "@/lib/components/SvgIcon/SvgIcon.vue";
import { useIpAddressHooks } from "./hooks";
import { onMounted, ref } from "vue";
import { TrafficFilter } from "@/api/traffic/interfaces";

defineOptions({
  name: "IpAddress"
});
const {
  isInputsEmpty,
  radioValue,
  selectSpecificIpAddressValue,
  errorMessage,
  filter
} = useIpAddressHooks();

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
      content="Ip address"
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
          :name="hoveringOnFilter ? 'cross' : 'earth'"
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
          <svg-icon name="earth" class="title-icon" />
          <div class="title-text">
            <strong>IP address</strong>
          </div>
        </div>
        <svg-icon name="cross" class="cross" @click="closeFilter()" />
      </div>
      <div class="content-wrapper_body">
        <el-radio-group v-model="radioValue" class="radio-group">
          <el-radio label="current_ip_address" size="large"
            >My current IP address</el-radio
          >
          <el-radio label="specific_ip_address" size="large"
            >Specific IP address or range</el-radio
          >
          <el-input
            v-show="radioValue === 'specific_ip_address'"
            v-model="selectSpecificIpAddressValue"
            placeholder="Enter IP address..."
            :class="{ inputError: errorMessage }"
          />
        </el-radio-group>
        <div
          class="content-wrapper_body-ip-address"
          v-show="radioValue === 'specific_ip_address'"
        >
          <p v-if="errorMessage" :class="{ feedBackError: errorMessage }">
            {{ errorMessage }}
          </p>
          <p class="ip-address-example">
            You can add many addresses separated with a comma. Examples:
            192.168.0.1, 192.168.*.1, 192.168.0.0/24, 192.0-254.0.1, 192.*
          </p>
        </div>
      </div>
      <div class="content-wrapper_action">
        <el-button
          :disabled="isInputsEmpty || errorMessage !== ''"
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

      &-ip-address {
        width: 100%;
        font-size: 12px;

        .feedBackError {
          color: var(--color-negative-default);
          font-size: 10px;
          margin-bottom: 5px;
        }

        .ip-address-example {
          margin-top: 10px;
          color: var(--content-subtle);
        }
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

:deep(.inputError .el-input__wrapper) {
  border: 1px solid var(--color-negative-default);
}

:deep(.inputError .is-focus) {
  box-shadow: none;
}
</style>
