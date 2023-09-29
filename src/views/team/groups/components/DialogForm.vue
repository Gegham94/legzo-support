<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { http } from "@/utils/http";
import { BaseAgent } from "@/api/agents/interfaces";
import { RequestResult } from "@/api/interfaces";
import { BaseGroup, GetGroup } from "@/api/groups/interfaces";
import { INITIAL_DATA } from "@/api/groups/constants";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  customers: {
    type: Array as PropType<BaseAgent>,
    default: () => []
  },
  data: {
    type: Object as PropType<GetGroup>,
    default: () => {
      return { ...INITIAL_DATA };
    }
  }
});

const ruleFormRef = ref<FormInstance>();
const formVisible = ref(false);
const formData = ref(props.data);
const customerList = ref(props.customers);
const isEdit = ref(false);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    const { id, name, status, customers } = formData.value;

    if (valid) {
      const httpRequest = isEdit.value
        ? http.put<BaseGroup, RequestResult<GetGroup>>(`/admin/groups/${id}`, {
            data: {
              name,
              status,
              users: customers
            }
          })
        : http.post<BaseGroup, RequestResult<GetGroup>>("/admin/groups", {
            data: {
              name,
              status,
              users: customers
            }
          });

      httpRequest.then(result => {
        if (result?.success) {
          message("Submitted successfully", { type: "success" });
          formVisible.value = false;
          resetForm(formEl);
          emit("update-list");
        }
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  resetForm(ruleFormRef.value);
  formVisible.value = false;
};

const emit = defineEmits(["update:visible", "update-list"]);
watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
    if (!val) {
      isEdit.value = false;
    }
  }
);

watch(
  () => props.data,
  val => {
    isEdit.value = true;
    formData.value = val;
  }
);

watch(
  () => props.customers,
  val => {
    customerList.value = val;
  }
);

const rules = {
  name: [{ required: true, message: "Please input the name", trigger: "blur" }],
  status: [
    { required: true, message: "Please input the status", trigger: "blur" }
  ]
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="isEdit ? 'Edit group' : 'New group'"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="formData.name"
          :style="{ width: '480px' }"
          placeholder="Name"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">Active</el-radio>
          <el-radio :label="0">Inactive</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Customers" prop="customers">
        <el-select
          v-model="formData.customers"
          clearable
          :style="{ width: '480px' }"
          multiple
          filterable
        >
          <el-option
            v-for="(item, index) in customerList"
            :key="index"
            :value="item.id"
            :label="item.name"
          >
            <span style="float: left">{{ item.name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.email }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Submit
      </el-button>
    </template>
  </el-dialog>
</template>
