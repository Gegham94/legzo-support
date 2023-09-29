<script setup lang="ts">
import { Form, Field, FieldArray, ErrorMessage } from "vee-validate";
import TextInput from "@/views/components/text-input/index.vue";
import { usePresenter } from "../hooks";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";
import Close from "@iconify-icons/ep/close";

defineOptions({
  name: "PreChat"
});

const {
  groupsList,
  groupSelected,
  dataLoading,
  changeSelectedGroup,
  initialValues,
  onSubmit,
  title,
  setActiveForm,
  schema
} = usePresenter();
</script>

<template>
  <div class="responses" v-loading="dataLoading">
    <div class="responses_title">
      <h2>{{ title }}</h2>
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
            v-slot="{ values, meta: { dirty } }"
            class="w-full"
            :initial-values="initialValues"
            :validation-schema="schema"
            @submit="onSubmit"
          >
            <ErrorMessage name="active" />
            <div>
              <FieldArray name="questions" v-slot="{ fields, push, remove }">
                <div class="ml-2 mb-3">
                  <Field
                    v-slot="{ field }"
                    name="active"
                    type="checkbox"
                    :value="true"
                    :unchecked-value="false"
                  >
                    <label>
                      <input
                        type="checkbox"
                        name="active"
                        v-bind="field"
                        :value="field.checked"
                        @click="setActiveForm(values, push, remove)"
                      />
                      {{ title }}
                    </label>
                  </Field>
                </div>
                <div v-show="values.active">
                  <div class="flex flex-wrap">
                    <fieldset
                      class="flex InputGroup"
                      style="width: 33%; padding: 1rem"
                      v-for="(item, questionsId) in fields"
                      :key="`question${questionsId}`"
                    >
                      <el-card class="box-card mb-6">
                        <template #header>
                          <div class="card-header">
                            <span v-if="item.value.id">
                              <strong>ID: {{ item.value.id }}</strong>
                            </span>
                            <TextInput
                              :label="'ID'"
                              :name="`questions[${questionsId}].id`"
                              :for="`question_id`"
                              :id="`question_id`"
                              hidden
                            />
                            <Field
                              v-slot="{ field }"
                              :name="`questions[${questionsId}].required`"
                              type="checkbox"
                              :value="true"
                              :unchecked-value="false"
                            >
                              <label class="required_title">
                                <input
                                  type="checkbox"
                                  :name="`questions[${questionsId}].required`"
                                  v-bind="field"
                                  :value="item.value.required"
                                />
                                Required
                              </label>
                            </Field>
                            <el-button
                              v-if="fields.length > 1"
                              type="info"
                              circle
                              @click="remove(questionsId)"
                            >
                              <IconifyIconOffline :icon="Delete" />
                            </el-button>
                          </div>
                        </template>
                        <div>
                          <TextInput
                            :label="'Question'"
                            :name="`questions[${questionsId}].question`"
                            :for="`answers_${questionsId}_question`"
                            :id="`answers_${questionsId}_question`"
                            :value="values.questions[questionsId].question"
                          />
                          <FieldArray
                            :name="`questions[${questionsId}].answers`"
                            v-slot="{ fields, push, remove }"
                          >
                            <fieldset
                              class="InputGroup"
                              v-for="(answers, answersId) in fields"
                              :key="`answers${answersId}`"
                            >
                              <div class="flex items-center gap-4">
                                <TextInput
                                  :label="answers.value.label"
                                  :name="`questions[${questionsId}].answers[${answersId}]`"
                                  :for="`answers_${answersId}`"
                                  :id="`answers_${answersId}`"
                                  :value="
                                    values.questions[questionsId].answers[
                                      answersId
                                    ]
                                  "
                                />
                                <el-button
                                  :disabled="fields.length < 3"
                                  type="text"
                                  :icon="Close"
                                  circle
                                  @click="remove(answersId)"
                                >
                                  <IconifyIconOffline :icon="Close" />
                                </el-button>
                              </div>
                            </fieldset>
                            <el-button
                              v-if="fields.length < 5"
                              type="text"
                              @click="push('')"
                            >
                              <IconifyIconOffline :icon="Plus" class="mr-2" />
                              Add Answer
                            </el-button>
                          </FieldArray>
                        </div>
                      </el-card>
                    </fieldset>
                  </div>
                  <el-button
                    type="text"
                    @click="
                      push({
                        id: '',
                        question: '',
                        type: 'radio',
                        required: false,
                        answers: ['', '']
                      })
                    "
                  >
                    <IconifyIconOffline :icon="Plus" class="mr-2" /> Add
                    Question
                  </el-button>
                </div>
              </FieldArray>
              <el-divider v-show="values.active" />
              <el-card v-show="values.active" class="mb-6 m-4 w-1/2">
                <template #header>
                  <div class="card-header">
                    <label>Information</label>
                  </div>
                </template>
                <div>
                  <TextInput
                    :label="'Message'"
                    :name="`info`"
                    :for="`answers_info`"
                    :id="`answers_info`"
                  />
                </div>
              </el-card>
              <el-divider />
            </div>
            <button
              :disabled="!dirty"
              type="submit"
              class="el-button el-button--primary m-2"
            >
              <span>Submit</span>
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.el-button--primary:disabled {
  color: var(--el-button-disabled-text-color);
  cursor: not-allowed;
  background-image: none;
  background-color: var(--el-button-disabled-bg-color);
  border-color: var(--el-button-disabled-border-color);
}

.responses.main-content {
  margin: 0;
}

label {
  &.required_title {
    font-size: 14px;
    font-weight: 500;
  }

  input {
    margin-right: 5px;
  }
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
