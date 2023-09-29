<script setup lang="ts">
import { GetAgent } from "@/api/agents/interfaces";
import { INITIAL_DATA } from "@/api/agents/constants";
import { computed, ref, watch } from "vue";
import { useAgents } from "@/views/team/agents/hooks";

const emit = defineEmits(["update:visible", "change-limit"]);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object as PropType<GetAgent>,
    default: () => {
      return { ...INITIAL_DATA };
    }
  }
});

const { formVisible, limit, closeLimitDialog } = useAgents();
const formData = ref(props.data);

const closeDialog = () => {
  emit("update:visible", false);
  closeLimitDialog(props.data);
};

const changesLimit = () => {
  emit("change-limit", props.data.id, limit.value);
};

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;
  }
);

watch(
  () => props.data.params.maxActiveTickets,
  val => {
    limit.value = val;
  }
);

const disabledConfirmButton = computed(() => {
  return formData.value.params.maxActiveTickets === limit.value;
});

const firstLetter = computed(() => {
  return String(formData.value.name[0]).toUpperCase();
});
</script>

<template>
  <div class="limit">
    <el-dialog
      v-model="formVisible"
      title="Лимит чатов"
      width="30%"
      draggable
      :before-close="closeDialog"
    >
      <el-col class="limit_info flex flex-bc">
        <div class="flex flex-c">
          <div class="limit_avatar">
            <img
              v-if="props.data.avatar_link"
              :src="props.data.avatar_link"
              :alt="props.data.name"
              width="56"
              height="56"
            />
            <span v-else>
              {{ firstLetter }}
            </span>
          </div>
          <div>
            <p>{{ props.data.name }}</p>
            <p>{{ props.data.email }}</p>
          </div>
        </div>
        <el-input-number
          v-model="limit"
          :min="1"
          :max="99"
          controls-position="right"
        />
      </el-col>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog"> Cancel </el-button>
          <el-button
            type="primary"
            :disabled="disabledConfirmButton"
            @click="changesLimit"
          >
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.limit {
  &_avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e0ebff;
    font-size: 32px;
    color: var(--color-blue);
    margin-right: 24px;
  }

  &_info {
    padding: 20px;
  }
}
</style>
