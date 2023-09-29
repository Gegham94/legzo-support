<script setup lang="ts">
import { Field, ErrorMessage, useField } from "vee-validate";
import { toRef } from "vue";

const props = defineProps({
  for: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  },
  label: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: undefined
  }
});
const name = toRef(props, "name");
const { errorMessage, meta } = useField(name, undefined, {
  initialValue: props.value
});

async function validateRequired(value) {
  return value ? true : "Required field";
}
</script>

<template>
  <div
    class="TextInput"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <label :for="props.for">{{ props.label }}</label>
    <Field
      :id="props.id"
      :name="props.name"
      class="el-input__inner"
      :disabled="disabled"
      :rules="validateRequired"
      :value="props.value"
    />
    <p class="help-message" v-show="errorMessage">
      <ErrorMessage :name="props.name" />
    </p>
  </div>
</template>

<style scoped>
.TextInput {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
  color: #606266;
  font-size: 14px;
}

input {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: text;
  transition: var(--el-transition-box-shadow);
  transform: translateZ(0);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}

input:focus {
  border-color: var(--primary-color);
}

input:disabled {
  color: #a8abb2;
  cursor: not-allowed;
  background: #f5f7fa;
}

.help-message {
  position: absolute;
  bottom: calc(-1.5 * 1em);
  left: 0;
  margin: 0;
  font-size: 14px;
}

.TextInput.has-error input {
  background-color: var(--error-bg-color);
  color: var(--error-color);
}

.TextInput.has-error input:focus {
  border-color: var(--error-color);
}

.TextInput.has-error .help-message {
  color: var(--error-color);
}
</style>
