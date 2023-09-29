<script setup lang="ts">
import { useInactivityTimeoutes } from "./hooks";
import { svg } from "@/constants/common";

defineOptions({
  name: "Inactivity timeoutes"
});

const {
  dataLoading,
  isActionsActive,
  isTransferChacked,
  isInactiveChecked,
  isCloseChecked,
  transferMinutes,
  inactiveMinutes,
  closeMinutes,
  saveChanges,
  discardChanges,
  onChangeInput,
  onChangeCheckbox
} = useInactivityTimeoutes();
</script>

<template>
  <div
    class="inactivity"
    v-loading="dataLoading"
    :element-loading-svg="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <div class="inactivity_title">
      <h2>Inactivity timeouts</h2>
    </div>
    <div class="inactivity_form">
      <div class="wrapper">
        <div>
          <el-checkbox
            label="transfer"
            v-model="isTransferChacked"
            @change="onChangeCheckbox()"
          >
            <span class="title">When the agent is not responding for</span>
          </el-checkbox>
          <el-input-number
            v-model="transferMinutes"
            class="ml-1 mr-1"
            :min="1"
            :max="60"
            controls-position="right"
            @change="onChangeInput()"
            :disabled="!isTransferChacked"
          />
          <span class="title"
            >minutes, transfer the visitor to another agent.</span
          >
        </div>
        <span class="sub-title"
          >Applies only if the chat has just started. All following responses
          can be longer and won't result in a transfer.</span
        >
      </div>

      <div class="wrapper">
        <div>
          <el-checkbox
            label="inactive"
            v-model="isInactiveChecked"
            @change="onChangeCheckbox()"
          >
            <span class="title"
              >When there are no new messages in the chat for</span
            >
          </el-checkbox>
          <el-input-number
            v-model="inactiveMinutes"
            class="ml-1 mr-1"
            :min="1"
            :max="60"
            controls-position="right"
            @change="onChangeInput()"
            :disabled="!isInactiveChecked"
          />
          <span class="title"> minutes, make the chat inactive.</span>
        </div>

        <span class="sub-title"
          >Inactive chats are not included in agents' concurrent chats
          limit.</span
        >
      </div>

      <div class="wrapper">
        <div>
          <el-checkbox
            label="close"
            v-model="isCloseChecked"
            @change="onChangeCheckbox()"
          >
            <span class="title">
              When there are no new messages in the chat for
            </span>
          </el-checkbox>
          <el-input-number
            v-model="closeMinutes"
            class="ml-1 mr-1"
            :min="1"
            :max="60"
            controls-position="right"
            @change="onChangeInput()"
            :disabled="!isCloseChecked"
          />
          <span class="title"> minutes, close the chat. </span>
        </div>
      </div>
      <div class="actions">
        <el-button
          :disabled="!isActionsActive"
          type="primary"
          @click="saveChanges"
          >Save changes</el-button
        >
        <el-button :disabled="!isActionsActive" @click="discardChanges"
          >Discard changes</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

  .inactivity_form {
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 15px;

      .title {
        color: var(--content-basic-primary);
      }

      .sub-title {
        font-size: 13px;
        padding: 7px 0px 0 25px;
        color: var(--content-disabled);
      }

      .el-input-number {
        width: 90px;
      }
    }

    .actions {
      .el-button {
        margin-right: 10px;
        padding: 16px 20px;
        font-weight: 600;
        line-height: 1.5;
      }
    }
  }
}
</style>
