<script setup lang="ts">
import SvgIcon from "@/lib/components/SvgIcon/SvgIcon.vue";
import Activity from "./components/activity/Activity.vue";
import AssignedAgent from "./components/assigned-agent/AssignedAgent.vue";
import Group from "./components/group/Group.vue";
import Country from "./components/country/Country.vue";
import City from "./components/city/City.vue";
import Region from "./components/region/Region.vue";
import Name from "./components/name/Name.vue";
import Email from "./components/email/Email.vue";
import ReturningCustomer from "./components/returning-customer/ReturningCustomer.vue";
// import NumberOfVisits from "./components/number-of-visits/NumberOfVisits.vue";
import IpAddress from "./components/ip-address/IpAddress.vue";
import CameFrom from "./components/came-from/CameFrom.vue";
import LastPageTitle from "./components/last-page-title/LastPageTitle.vue";
import { ref } from "vue";
import { useFilterHooks } from "./hooks";

defineOptions({
  name: "AddedFilter"
});

const { filterItemsList, isShowFilterButton } = useFilterHooks();
const emit = defineEmits(["apply-filter", "send-filter", "remove-filter"]);

const filtersArray = ref([...filterItemsList]);

const handleFilterButton = buttonState => {
  isShowFilterButton.value = buttonState;
};

const addFilter = filterItemId => {
  const foundIndex = filtersArray.value.findIndex(
    item => item.id === filterItemId
  );
  if (foundIndex !== -1) {
    const foundItem = filtersArray.value.splice(foundIndex, 1)[0];
    foundItem.used = true;
    foundItem.isOpen = true;
    filtersArray.value.push(foundItem);
    handleFilterButton(false);
  }
};

const removeFilter = filterId => {
  filtersArray.value.forEach(item => {
    if (item.id === filterId) {
      item.used = false;
      item.isOpen = false;
      handleFilterButton(true);
      emit("remove-filter", filterId, true);
    }
  });
};

const applyFilter = appliedfilter => {
  const existingFilterIndex = filtersArray.value.findIndex(
    filter => filter.id === appliedfilter.value.id
  );
  if (existingFilterIndex !== -1) {
    filtersArray.value[existingFilterIndex] = appliedfilter.value;
  }
  emit("send-filter", appliedfilter);
};
</script>

<template>
  <div class="filter-wrapper">
    <div
      class="filter-wrapper_added-filter"
      v-for="filter in filtersArray"
      :key="filter.id"
      :style="{ 'margin-right': filter.used ? '5px' : '0' }"
    >
      <template v-if="filter.id === 'activity' && filter.used">
        <Activity
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'assigned-agent' && filter.used">
        <AssignedAgent
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'group' && filter.used">
        <Group
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'country' && filter.used">
        <Country
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'city' && filter.used">
        <City
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'region' && filter.used">
        <Region
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'name' && filter.used">
        <Name
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'email' && filter.used">
        <Email
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'returning-customer' && filter.used">
        <ReturningCustomer
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <!-- NEED IN FUTURE -->
      <!-- <template v-if="filter.id === 'number-of-visits' && filter.used">
        <NumberOfVisits
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template> -->
      <template v-if="filter.id === 'ip' && filter.used">
        <IpAddress
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'came-from' && filter.used">
        <CameFrom
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
      <template v-if="filter.id === 'last-page-title' && filter.used">
        <LastPageTitle
          @apply-filter="applyFilter"
          @remove-filter="removeFilter"
          :filter="filter"
          @show-filter-button="handleFilterButton"
        />
      </template>
    </div>
  </div>
  <el-dropdown v-if="isShowFilterButton">
    <el-button class="select-add-button"
      ><svg-icon name="plus" class="add-icon" />Add Filter</el-button
    >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="filterItem in filterItemsList"
          :key="filterItem.id"
          class="select-add-option"
          @click="addFilter(filterItem.id)"
          ><svg-icon :name="filterItem.icon" class="select-add-option-icon" />{{
            filterItem.label
          }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;

  &_added-filter {
    position: relative;
    margin-right: 5px;
  }
}

.select-add-button {
  outline: none;
  color: var(--color-action-default);

  &:hover {
    border-color: var(--color-blue);
    color: var(--color-blue);
  }

  .add-icon {
    width: 12px;
    height: 12px;
    margin: 0 6px 1px 0;
    color: var(--color-blue);
  }
}

.select-add-option {
  cursor: pointer;
  color: var(--content-text-default);

  &:hover {
    background-color: var(--picker-list-option-background-hover);
    color: var(--content-text-default);
  }

  &-icon {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
}
</style>
