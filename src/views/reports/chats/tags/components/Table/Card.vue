<script setup lang="ts">
import { TagUsed } from "@/api/reports/interfaces";
import { computed } from "vue";

const props = defineProps({
  usageTag: {
    type: Object,
    default: () => {}
  },
  checkedTags: {
    type: Array as () => TagUsed[],
    default: () => []
  }
});

const emit = defineEmits(["handle-checked-tags"]);
const handleCheckedTags = (usageTag, state) => {
  emit("handle-checked-tags", usageTag, state);
};

const disabledTag = computed(() => {
  if (props.checkedTags.length < 4) return false;
  return (
    props.checkedTags.findIndex(n => n.name === props.usageTag.name) === -1
  );
});
</script>

<template>
  <div :class="'list-card-item' + (disabledTag ? ' disable-tag' : '')">
    <div class="list-card-item_detail bg-bg_color">
      <el-row>
        <el-col :span="24" class="main-info">
          <el-row>
            <el-col :span="1">
              <el-checkbox
                size="small"
                @change="handleCheckedTags(usageTag, $event)"
              />
            </el-col>
            <el-col :span="17">
              <p class="list-card-item_detail--name">
                {{ usageTag.name }}
              </p>
            </el-col>
            <el-col :span="3">
              <div class="list-card-item_detail--count">
                {{ usageTag.count }}
              </div>
            </el-col>
            <el-col :span="3">
              <div class="list-card-item_detail--percent">
                {{ usageTag.percent }}
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.disable-tag {
  pointer-events: none;
  opacity: 0.5;
}

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
  border-radius: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--decor-gray40);

  .main-info {
    cursor: pointer;
  }

  &_detail {
    flex: 1;
    padding: 8px 16px;

    &--name {
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 13px;
    }

    &--count {
      cursor: pointer;
      text-align: right;
      color: var(--color-action-default);
      font-size: 13px;

      &:hover {
        text-decoration: underline;
      }
    }

    &--percent {
      cursor: pointer;
      text-align: right;
      font-size: 13px;
    }
  }
}
</style>
