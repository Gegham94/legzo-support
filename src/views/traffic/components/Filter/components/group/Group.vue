<script setup lang="ts">
import SvgIcon from "@/lib/components/SvgIcon/SvgIcon.vue";
import { useGroupHooks } from "./hooks";
import { onMounted, ref } from "vue";
import { TrafficFilter } from "@/api/traffic/interfaces";

defineOptions({
  name: "Group"
});
const {
  isInputsEmpty,
  radioValue,
  selectIsValue,
  selectIsNotValue,
  groupList,
  filter
} = useGroupHooks();

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
    <el-tooltip content="Group" placement="top" popper-class="pure-tooltip">
      <div
        class="filter_state"
        @mouseenter="hoveringOnFilter = true"
        @mouseleave="hoveringOnFilter = false"
        @click="openFilter"
      >
        <svg-icon
          :name="hoveringOnFilter ? 'cross' : 'group'"
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
          <svg-icon name="group" class="title-icon" />
          <div class="title-text">
            <strong>Group</strong>
          </div>
        </div>
        <svg-icon name="cross" class="cross" @click="closeFilter()" />
      </div>
      <div class="content-wrapper_body">
        <el-radio-group v-model="radioValue" class="radio-group">
          <el-radio label="is" size="large">is</el-radio>
          <el-select
            v-show="radioValue === 'is'"
            v-model="selectIsValue"
            multiple
            clearable
            placeholder="Search..."
          >
            <el-option
              v-for="group in groupList"
              :key="group.id"
              :label="group.name"
              :value="group.name"
              class="flex justify-start items-center"
              ><img
                v-if="group.image"
                :src="group.image"
                :alt="group.name[0].toUpperCase()"
                class="option-item-avatar"
              />
              <span v-else>
                <div class="group-logo">
                  <span>{{ group.name[0].toUpperCase() }}</span>
                </div>
              </span>
              <span>{{ group.name }}</span></el-option
            >
          </el-select>
          <el-radio label="is_not" size="large">is not</el-radio>
          <el-select
            v-show="radioValue === 'is_not'"
            v-model="selectIsNotValue"
            multiple
            clearable
            placeholder="Search..."
          >
            <el-option
              v-for="group in groupList"
              :key="group.id"
              :label="group.name"
              :value="group.name"
              class="flex justify-start items-center"
              ><img
                v-if="group.image"
                :src="group.image"
                :alt="group.name[0].toUpperCase()"
                class="option-item-avatar"
              />
              <span v-else>
                <div class="group-logo">
                  <span>{{ group.name[0].toUpperCase() }}</span>
                </div>
              </span>
              <span>{{ group.name }}</span></el-option
            >
          </el-select>
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

:deep(.radio-group_option-item) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
}

:deep(.option-item-avatar) {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
}

:deep(.group-logo) {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e0ebff;
  font-size: 18px;
  color: var(--color-blue);
  margin-right: 10px;
  overflow: hidden;
}
</style>
