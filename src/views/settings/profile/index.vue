<script setup lang="ts">
import { svg } from "@/constants/common";
import { usePresenter } from "./hooks";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";
import { watch } from "vue";

const {
  dataLoading,
  formData,
  rules,
  selectedList,
  groupList,
  getRoleLabel,
  ruleFormRef,
  isPasswordChangeAction,
  uploadFile,
  fileList,
  isEmptyAvatar,
  avatarErrorTitle,
  isFormDataChanged,
  getFileMsg,
  handleRemoveImage,
  changeGroupSelect,
  handleInputNumber,
  onSubmit
} = usePresenter();
defineOptions({
  name: "Profile"
});

watch(
  () => formData?.value,
  val => {
    formData.value = val;
    if (formData.value.avatar) {
      fileList.value[0] = {
        url: formData.value.avatar
      };
    } else {
      fileList.value = [];
    }
  }
);
</script>

<template>
  <div class="inactivity" v-loading="dataLoading" :element-loading-svg="svg">
    <div class="inactivity_title">
      <h2>Edit Profile</h2>
    </div>
    <el-card class="box-card" v-if="formData">
      <div class="flex justify-left items-center pb-4">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          ref="uploadFile"
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          :on-change="getFileMsg"
          class="upload-avatar"
          :class="{ hideAddCard: fileList[0]?.url }"
        >
          <IconifyIconOffline
            class="dark:text-white"
            width="20px"
            height="20px"
            :icon="Plus"
          />
          <template #file="{ file }">
            <div>
              <img
                v-if="fileList[0]?.url"
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemoveImage()"
                >
                  <IconifyIconOffline
                    class="dark:text-white"
                    width="20px"
                    height="20px"
                    :icon="Delete"
                  />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <div class="box-card_user-info">
          <span class="author">Owner</span>
          <span class="name">{{ formData.name }}</span>
          <span class="role">{{ getRoleLabel }}</span>
        </div>
      </div>
      <span v-if="isEmptyAvatar" class="error-label">{{
        avatarErrorTitle
      }}</span>
      <el-form :model="formData" :rules="rules" ref="ruleFormRef">
        <div class="card-header">
          <h3>Details</h3>
        </div>
        <el-row :gutter="24" class="box-card_details-form">
          <el-col :span="8" class="box-card_details-form_details-item">
            <el-form-item label="Name" prop="name">
              <el-input
                v-model="formData.name"
                :style="{ width: '480px' }"
                placeholder="Name"
              />
            </el-form-item>
            <el-tooltip
              content="Email is not editable"
              placement="top"
              popper-class="pure-tooltip"
            >
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="formData.email"
                  type="email"
                  :style="{ width: '480px' }"
                  placeholder="Email"
                  :disabled="true"
                /> </el-form-item
            ></el-tooltip>

            <el-form-item label="Chat limit" prop="chat_limit">
              <el-input-number
                v-model="formData.params.maxActiveTickets"
                :min="1"
                :max="99"
                controls-position="right"
                @input="handleInputNumber"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="box-card_details-form_switcher-item">
            <div
              :class="
                isPasswordChangeAction
                  ? 'box-card_change-password box-card_change-password-up'
                  : 'box-card_change-password'
              "
            >
              <span class="box-card_change-password_title"
                >Switch to change current password</span
              >
              <el-switch
                v-model="isPasswordChangeAction"
                style="margin-left: 20px"
                size="small"
                inline-prompt
              />
            </div>
            <el-form-item
              label="Password"
              prop="password"
              v-if="isPasswordChangeAction"
            >
              <el-input
                v-model="formData.password"
                type="text"
                autocomplete="off"
                :style="{ width: '480px' }"
              />
            </el-form-item>
            <el-form-item
              label="Confirm"
              prop="password_confirmation"
              v-if="isPasswordChangeAction"
            >
              <el-input
                v-model="formData.password_confirmation"
                type="text"
                autocomplete="off"
                :style="{ width: '480px' }"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="card-header">
          <h3>Member of {{ formData.groups.length }} Groups</h3>
        </div>
        <div class="groups-wrapper">
          <el-form-item
            label="Groups"
            v-if="formData.role !== 1 && formData.role !== 2"
          >
            <div v-if="selectedList.length" class="groups-names">
              <span
                v-for="item in selectedList"
                :key="item.id"
                class="groups-names_item"
              >
                <span class="logo">
                  {{ item[0].toUpperCase() }}
                </span>
                {{ item }}
              </span>
            </div>
          </el-form-item>
          <el-form-item v-else label="Groups">
            <el-select
              v-model="selectedList"
              clearable
              class="mb-3"
              :style="{ width: '480px' }"
              multiple
              @change="changeGroupSelect(selectedList)"
            >
              <el-option
                v-for="(item, index) in groupList"
                :key="index"
                :value="item.name"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
            <div v-if="selectedList.length" class="groups-names">
              <span
                v-for="item in selectedList"
                :key="item.id"
                class="groups-names_item"
              >
                <span class="logo">
                  {{ item[0].toUpperCase() }}
                </span>
                {{ item }}
              </span>
            </div>
          </el-form-item>
        </div>

        <div class="card-header">
          <h3>Agent status after logging in</h3>
        </div>
        <el-form-item>
          <el-radio-group
            v-model="formData.params.readyAfterLogin"
            class="flex flex-col items-start"
            style="align-items: flex-start"
          >
            <el-radio size="large" :label="true">
              <span>Accept chats</span>
            </el-radio>
            <el-radio size="large" :label="false">
              <span>Don't accept chats</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-tooltip
            v-if="isFormDataChanged"
            content="There is no changes"
            placement="top"
            popper-class="pure-tooltip"
          >
            <el-button type="primary" :disabled="isFormDataChanged"
              >Save</el-button
            >
          </el-tooltip>
          <el-button
            v-else
            type="primary"
            @click="onSubmit(ruleFormRef)"
            :disabled="isFormDataChanged"
            :loading="dataLoading"
            >Save</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
  margin: 16px 0 28px 0;

  h3 {
    margin-bottom: 5px;
  }
}

.box-card {
  width: calc(100% - 60px);
  margin: 30px;

  @media only screen and (max-width: 768px) {
    &_details-form {
      flex-direction: column;

      &_switcher-item,
      &_details-item {
        margin-bottom: 15px;
      }
    }
  }

  .error-label {
    font-size: 14px;
    color: var(--el-color-danger);
  }

  .el-input-number {
    width: 100px;
  }

  &_user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 20px;
    height: 100px;
    width: 100%;

    .author {
      background: var(--content-default);
      color: var(--surface-secondary-default);
      border-radius: 4px;
      max-width: 80px;
      text-align: center;
    }

    .name {
      font-size: 20px;
      color: var(--content-subtle);
      font-weight: 600;
    }

    .role {
      font-size: 14px;
      color: var(--content-subtle);
    }
  }

  &_details-form {
    display: flex;
    flex-direction: row;

    &_switcher-item {
      position: relative;
    }
  }

  .disablePassword {
    pointer-events: none;
    opacity: 0.5;

    .el-form-item__error {
      display: none !important;
    }
  }

  &_change-password-up {
    top: -26px !important;
  }

  &_change-password {
    position: absolute;
    top: -5px;
    transition: top 0.1s;
    white-space: nowrap;

    &_title {
      font-style: italic;
      font-size: 12px;
      color: var(--content-subtle);
    }
  }

  .el-row {
    margin-bottom: 18px;
    column-gap: 30px;
  }

  .groups-wrapper {
    margin-bottom: 30px;

    :deep(.el-form-item__content) {
      flex-direction: column !important;
      align-items: flex-start !important;
    }

    .groups-names {
      display: flex;
      flex-wrap: wrap;
      column-gap: 5px;
      row-gap: 5px;

      &_item {
        background: var(--content-background-default);
        color: var(--content-text-default);
        border-radius: 4px;
        text-align: center;
        margin-right: 5px;
        padding: 0 10px;
      }

      .logo {
        position: relative;
        border-radius: 4px;
        font-weight: 600;
        text-align: center;
        background: var(--content-logo-background);
        color: var(--surface-secondary-default);
        padding: 2px 5px;
      }
    }
  }
}

.inactivity.main-content {
  margin: 0;
}

.inactivity {
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

  &_form {
    padding: 32px 20px 120px;
    box-sizing: border-box;
    max-width: 960px;
  }
}
</style>
