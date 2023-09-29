<script setup lang="ts">
import { Form } from "vee-validate";
import TextInput from "@/views/components/text-input/index.vue";
import { usePresenter } from "./hooks";

defineOptions({
  name: "AutoMessages"
});

const {
  groupsList,
  groupSelected,
  dataLoading,
  changeSelectedGroup,
  initialData,
  schema,
  onSubmit,
  getInitialData
} = usePresenter();
</script>

<template>
  <div class="responses" v-loading="dataLoading">
    <div class="responses_title">
      <h2>Auto messages</h2>
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
    <div class="responses_template">
      <div class="main">
        <div class="w-full flex mb-4 pb-4">
          <Form
            v-if="!dataLoading"
            class="w-full"
            :initial-values="initialData"
            :validation-schema="schema"
            @submit="onSubmit"
          >
            <TextInput
              label="Welcome message"
              name="welcome_message"
              for="welcome_message"
              id="welcome_message"
            />
            <button type="submit" class="el-button el-button--primary mt-6">
              <span>Save</span>
            </button>
            <span
              @click="getInitialData"
              class="el-button el-button--default mt-6"
            >
              <span>Cancel</span>
            </span>
          </Form>
        </div>
      </div>
    </div>
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

  &_template {
    padding: 32px 20px;
    background: var(--surface-primary-default);
  }
}
</style>
