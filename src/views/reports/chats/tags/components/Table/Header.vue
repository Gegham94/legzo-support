<script setup lang="ts">
import SvgIcon from "@/lib/components/SvgIcon/SvgIcon.vue";

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
</script>

<template>
  <div class="list-card-item">
    <div class="list-card-item_detail bg-bg_color">
      <el-row>
        <el-col :span="24" class="cursor-pointer">
          <el-row class="list-card-item_detail--title">
            <el-col :span="1">
              <el-tooltip
                :content="'Show on chart (select max 4 tags to compare)'"
                placement="top-start"
                popper-class="pure-tooltip"
              >
                <svg-icon name="storm" class="list-card-item_detail--storm" />
              </el-tooltip>
            </el-col>

            <el-col
              :span="17"
              class="sort-arrow title-name"
              @click="handleSort('name')"
            >
              <span
                v-if="isSortField('name')"
                :class="
                  'title-info_arrow ' +
                  (isSortField('name') === 'asc' ? 'up' : 'down')
                "
              />
              <p class="mr-1 cursor-pointer title-name">Tags</p>
            </el-col>

            <el-col
              :span="3"
              class="sort-arrow title-info"
              @click="handleSort('count')"
            >
              <span
                v-if="isSortField('count')"
                :class="
                  'title-info_arrow ' +
                  (isSortField('count') === 'asc' ? 'up' : 'down')
                "
              />
              <p class="mr-1 cursor-pointer">No. of chats with this tag</p>
            </el-col>

            <el-col
              :span="3"
              class="sort-arrow title-info"
              @click="handleSort('percent')"
            >
              <span
                v-if="isSortField('percent')"
                :class="
                  'title-info_arrow ' +
                  (isSortField('percent') === 'asc' ? 'up' : 'down')
                "
              />
              <p class="mr-1 cursor-pointer">% of tagged chats</p>
            </el-col>
          </el-row>
        </el-col>
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

    &--storm {
      outline: none;
    }

    &--title {
      padding: 10px 16px;
      line-height: 1.3;
      background-color: var(--surface-basic-subtle);
      color: var(--content-default);

      .sort-arrow {
        font-size: 13px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .title-info_arrow::before {
          display: inline-block;
          margin-right: 7px;
          content: " ";
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          transition: transform 0.15s linear 0s;
        }
      }

      .title-name {
        justify-content: flex-start;

        .up::before {
          margin-bottom: 2px;
          border-bottom: 5px solid rgb(66, 77, 87);
        }

        .down::before {
          margin-top: 0;
          border-top: 5px solid rgb(66, 77, 87);
        }
      }

      .title-info {
        justify-content: flex-end;

        .up::before {
          margin-bottom: 2px;
          border-bottom: 5px solid rgb(66, 77, 87);
        }

        .down::before {
          margin-top: 0;
          border-top: 5px solid rgb(66, 77, 87);
        }
      }
    }
  }
}
</style>
