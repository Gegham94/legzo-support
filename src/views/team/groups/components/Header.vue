<script setup lang="ts">
import { computed } from "vue";
import sortAsc from "@iconify-icons/ep/top";
import sortDesc from "@iconify-icons/ep/bottom";

defineOptions({
  name: "Header"
});

const props = defineProps({
  sort: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["handle-sort"]);

const handleSort = (field: string) => {
  emit("handle-sort", field);
};

const isSortField = (field: string): string => {
  const currentSorts = props.sort.split(",");
  const isSortAsc = currentSorts.indexOf(field);
  const isSortDesc = currentSorts.indexOf(`-${field}`);

  if (isSortAsc > -1) {
    return "asc";
  } else if (isSortDesc > -1) {
    return "desc";
  }

  return "";
};

const cardClass = computed(() => ["list-card-item"]);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row>
        <el-col :span="21" class="cursor-pointer">
          <el-row>
            <el-col :span="10">
              <div
                class="flex items-center text-md text-text_color_regular"
                @click="handleSort('name')"
              >
                <p class="mr-1 cursor-pointer">Name</p>
                <IconifyIconOffline
                  v-if="isSortField('name')"
                  :icon="isSortField('name') === 'asc' ? sortAsc : sortDesc"
                />
              </div>
            </el-col>
            <el-col
              :span="5"
              class="flex items-center text-md text-text_color_regular"
              @click="handleSort('users')"
            >
              <p class="mr-1 cursor-pointer">Members</p>
              <IconifyIconOffline
                v-if="isSortField('users')"
                :icon="isSortField('users') === 'asc' ? sortAsc : sortDesc"
              />
            </el-col>
            <el-col
              :span="4"
              class="flex items-center text-md text-text_color_regular"
              @click="handleSort('usersOnline')"
            >
              <p class="mr-1 cursor-pointer">Status</p>
              <IconifyIconOffline
                v-if="isSortField('usersOnline')"
                :icon="
                  isSortField('usersOnline') === 'asc' ? sortAsc : sortDesc
                "
              />
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :span="3"
          class="flex items-center text-md text-text_color_regular justify-end pr-2"
        />
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-radius: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--decor-gray40);

  &_detail {
    flex: 1;
    padding: 8px 16px;
  }
}
</style>
