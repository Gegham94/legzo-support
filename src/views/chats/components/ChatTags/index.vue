<script setup lang="ts">
import { useTags } from "./hooks/";

defineOptions({
  name: "ChatTags"
});

const props = defineProps({
  roomId: {
    type: Number,
    default: 0
  }
});

const { fetchTagsList, addTagToRoom, formTags, showModal } = useTags(props);
</script>

<template>
  <el-dialog
    v-model="showModal"
    @close="$emit('close-modal-room')"
    destroy-on-close
    :title="`Add tag to ${props.roomId}`"
    width="310px"
  >
    <el-form v-if="props.roomId" :inline="true" class="form-inline">
      <el-form-item>
        <el-autocomplete
          ref="InputRef"
          v-model="formTags"
          :fetch-suggestions="fetchTagsList"
          placeholder="Search"
        />
      </el-form-item>
      <el-form-item style="margin-right: 0">
        <el-button type="primary" @click="addTagToRoom">Add</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style scoped lang="scss">
.form-inline {
  padding: 20px;
}
</style>
