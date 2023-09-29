<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { useCannedResponses } from "@/views/settings/canned-responses/hooks";
import { Template } from "@/api/settings/interfaces";
import { FormInstance } from "element-plus";
import { ElInput } from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  shortcutsAlreadyError: {
    type: Boolean,
    default: false
  },
  emptyShortcutsError: {
    type: Boolean,
    default: false
  },
  inputVisible: {
    type: Boolean,
    default: false
  },
  shortcutsErrorMassage: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object as PropType<Template>,
    default: () => {}
  }
});

const emit = defineEmits([
  "update:visible",
  "change-group",
  "edit-template",
  "shortcuts-delete",
  "handle-input-confirm",
  "set-template",
  "reset-form",
  "show-input",
  "submit-form-item"
]);

const { groupsList, inputValue } = useCannedResponses();

const ruleFormRef = ref<FormInstance>();
const formVisible = ref(false);
const isEditForm = ref(false);
const emptyShortcuts = ref(false);
const shortcutsAlready = ref(false);
const formData = ref(props.data);
const sortInputVisible = ref(props.inputVisible);
const InputRef = ref<InstanceType<typeof ElInput>>();

const rules = {
  text: [{ required: true, message: "Enter your response.", trigger: "blur" }]
};

const closeDialog = () => {
  emit("reset-form");
  emit("update:visible", false);
  resetForm(ruleFormRef.value);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submitForm = (formEl: FormInstance | undefined) => {
  emit("submit-form-item", formEl, isEditForm.value, formData.value);
};

const changeGroup = name => {
  emit("change-group", name);
};

const showShortcutInput = () => {
  emit("show-input", InputRef);
};

const shortcutsDelete = tag => {
  emit("shortcuts-delete", tag);
};

const handleShortcut = shortcut => {
  inputValue.value = "";
  emit("handle-input-confirm", shortcut);
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
  () => props.inputVisible,
  val => {
    sortInputVisible.value = val;
  }
);

watch(
  () => props.emptyShortcutsError,
  val => {
    emptyShortcuts.value = val;
  }
);

watch(
  () => props.shortcutsAlreadyError,
  val => {
    shortcutsAlready.value = val;
  }
);

watch(
  () => props.isEdit,
  val => {
    isEditForm.value = val;
  }
);
</script>

<template>
  <div class="create_response">
    <el-dialog
      v-model="formVisible"
      title="Create canned response"
      :width="680"
      draggable
      :before-close="closeDialog"
    >
      <el-form
        ref="ruleFormRef"
        :model="formData"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="Group selection">
          <el-select
            v-model="formData.group.name"
            class="create_response--select"
            filterable
            placeholder="Select"
            @change="changeGroup(formData.group.name)"
          >
            <el-option
              v-for="item in groupsList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
              <span class="create_response--logo">
                <span>
                  {{ item.name[0].toUpperCase() }}
                </span>
              </span>
              <span class="create_response--name">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Response text" prop="text">
          <el-input
            v-model="formData.text"
            placeholder="Frequently used response..."
            show-word-limit
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item
          label="Shortcuts (hit enter to add new one)"
          class="sort_caret"
          :class="{ error: emptyShortcuts || shortcutsAlready }"
        >
          <el-tag
            v-for="tag in formData.shortcuts"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="shortcutsDelete(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="sortInputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="ml-1 w-20 shortcuts-input"
            size="small"
            @keyup.enter="handleShortcut(inputValue)"
            @blur="handleShortcut(inputValue)"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showShortcutInput"
          >
            # Type shortcut...
          </el-button>
        </el-form-item>
        <span
          v-if="emptyShortcuts || shortcutsAlready"
          class="sort_caret--error"
        >
          {{ shortcutsErrorMassage }}
        </span>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Submit
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.create_response {
  &--content {
    padding: 0 20px 20px;
  }

  ::v-deep .el-dialog__header {
    display: flex;
    flex: 0 0 64px;
    align-items: center;
    box-shadow: inset 0 -1px 0 var(--border-basic-tertiary);
    padding: 0 20px;
    width: 100%;
    height: 64px;
    color: var(--content-basic-primary);
  }

  &--title {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 4px;
    margin-top: 20px;
  }

  &--select {
    width: 100%;
  }

  &--logo {
    position: relative;
    display: inline-block;
    border-radius: 4px;
    font-weight: 600;
    width: 24px;
    height: 24px;
    line-height: 22px;
    background-color: #e0ebff;
    text-align: center;
    vertical-align: middle;
    color: var(--color-blue);
    padding-top: 2px;
  }

  &--name {
    margin-left: 8px;
    font-size: 14px;
    line-height: 17px;
    color: rgb(66, 77, 87);
    max-width: 350px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  form {
    padding: 20px;
  }

  .el-form-item {
    flex-direction: column;
  }

  .shortcuts-input {
    width: 100px;
    margin-bottom: 5px;
  }

  .is-closable {
    margin-bottom: 5px;
  }

  .el-button--small {
    margin-bottom: 5px;
  }

  .sort_caret {
    > :deep .el-form-item__label {
      min-width: 236px;
      font-size: var(--el-form-label-font-size);
      color: var(--el-text-color-regular);
      font-weight: 700;

      &:before {
        content: "*";
        color: var(--el-color-danger);
        margin-right: 4px;
      }
    }

    :deep .el-form-item__content {
      border: 1px solid var(--el-input-hover-border-color);
      display: flex;
      flex-wrap: wrap;
      margin-top: 4px;
      height: fit-content;
      border-radius: 4px;
      line-height: 1.2;
      padding: 10px 10px 5px;
      width: 100%;
      font-size: 15px;
      color: var(--content-basic-primary);
      background-color: var(--surface-primary-default);
      box-sizing: border-box;
    }

    &.error {
      margin-bottom: 0;

      ::v-deep .el-form-item__content {
        border-color: var(--el-color-danger);
      }
    }

    &--error {
      color: var(--el-color-danger);
      margin-bottom: 20px;
      display: inline-block;
      font-size: 12px;
    }
  }
}
</style>
