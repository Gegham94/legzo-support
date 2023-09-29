<script setup lang="ts">
import { useCannedResponses } from "@/views/settings/canned-responses/hooks";
import DialogForm from "./components/DialogForm.vue";
import Card from "./components/Card.vue";
import { svg } from "@/constants/common";
import Plus from "@iconify-icons/ep/plus";

const {
  groupsList,
  formDialogVisible,
  groupSelected,
  templates,
  dataLoading,
  groupTemplateItem,
  formData,
  formDialog,
  changeSelectedGroup,
  changeGroup,
  handleClose,
  editTemplate,
  templateEditRequest,
  templateCopy,
  templateDeleteRequest,
  handleInputConfirm,
  inputVisible,
  showInput,
  isEdit,
  resetForm,
  setTemplatesRequest,
  shortcutsAlreadyError,
  emptyShortcutsError,
  shortcutsErrorMassage,
  submitFormItem
} = useCannedResponses();
</script>

<template>
  <div
    class="responses"
    v-loading="dataLoading"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <div class="responses_title">
      <h2>Response list</h2>
    </div>
    <div class="responses_setup__group">
      <div>
        <span class="responses_setup__group-title">Setup for group</span>
        <el-select
          v-model="groupSelected.name"
          class="responses_select"
          filterable
          placeholder="Select"
          @change="changeSelectedGroup(groupSelected.name)"
        >
          <el-option
            v-for="item in groupsList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
            <span class="responses_select--logo">
              <span>
                {{ item.name[0].toUpperCase() }}
              </span>
            </span>
            <span class="responses_select--name">
              {{ item.name }}
            </span>
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-if="!templates.length" class="responses_empty">
      <img src="@/assets/img/canned-responses.png" alt="canned-responses" />
      <div class="responses_empty--info">
        <h3>No canned responses in this group</h3>
        <p>Save frequently used responses under a simple shortcut</p>
        <el-button type="primary" class="responses_canned" @click="formDialog">
          New canned response
        </el-button>
      </div>
    </div>
    <div v-else class="responses_template">
      <div>
        <el-button type="primary" class="responses_canned" @click="formDialog">
          <IconifyIconOffline :icon="Plus" />
          New canned response
        </el-button>
        <div class="responses_info">
          <div class="responses_count">
            {{ templates.length }} canned responses
          </div>
          <div
            v-for="template in templates"
            :key="template.id"
            class="responses_card"
          >
            <Card
              :data="template"
              @template-edit="editTemplate"
              @template-copy="templateCopy"
              @template-delete="templateDeleteRequest"
            />
          </div>
        </div>
      </div>
    </div>
    <DialogForm
      v-model:visible="formDialogVisible"
      :groupItem="groupTemplateItem"
      :data="formData"
      :isEdit="isEdit"
      :inputVisible="inputVisible"
      :shortcutsAlreadyError="shortcutsAlreadyError"
      :emptyShortcutsError="emptyShortcutsError"
      :shortcutsErrorMassage="shortcutsErrorMassage"
      @edit-template="templateEditRequest"
      @set-template="setTemplatesRequest"
      @change-group="changeGroup"
      @shortcuts-delete="handleClose"
      @handle-input-confirm="handleInputConfirm"
      @reset-form="resetForm"
      @show-input="showInput"
      @submit-form-item="submitFormItem"
    />
  </div>
</template>
<style lang="scss" scoped>
.responses.main-content {
  margin: 0;
}

.responses {
  &_title {
    width: 100%;
    height: 52px;
    position: relative;
    text-align: center;
    box-sizing: border-box;
    background-color: var(--surface-primary-default);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;

    h2 {
      width: auto;
      color: var(--content-default);
      font-weight: 600;
      font-size: 20px;
      border-bottom: none;
      margin: 0 20px;
      display: flex;
      align-items: center;
    }
  }

  &_setup__group {
    display: flex;
    min-height: 36px;
    -webkit-box-align: center;
    align-items: center;
    padding: 8px 20px;
    background-color: var(--surface-primary-default);
    border-bottom: 1px solid var(--border-subtle);

    &-title {
      margin-right: 11px;
      font-size: 14px;
      color: var(--content-default);
    }
  }

  &_select {
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
  }

  &_empty {
    padding: 52px 20px 48px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      max-width: 635px;
      max-height: 275px;
      margin-bottom: 48px;
    }

    &--info {
      display: flex;
      flex-direction: column;
      align-items: center;

      h3 {
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
        max-width: 440px;
        margin: 0 auto 12px;
        color: var(--content-basic-primary);
      }

      p {
        margin-bottom: 20px;
        font-size: 15px;
        line-height: 22px;
        opacity: 0.8;
        color: var(--content-basic-primary);
      }
    }
  }

  &_canned {
    font-size: 15px;
    min-width: 36px;
    min-height: 36px;
    font-weight: 600;

    svg {
      margin-right: 5px;
    }
  }

  :deep textarea {
    height: 140px;
  }

  &_template {
    padding: 32px 20px;
    background: var(--surface-primary-default);
  }

  &_info {
    padding-top: 16px;
  }

  &_count {
    padding: 7px 28px;
    background-color: var(--surface-secondary-subtle);
    color: var(--content-default);
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 1px;
    border-radius: 4px;
  }

  &_card {
    border-bottom: 1px solid var(--border-subtle);

    > div {
      padding: 16px 18px 0;
    }
  }
}
</style>
