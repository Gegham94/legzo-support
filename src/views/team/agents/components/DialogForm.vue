<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { http } from "@/utils/http";
import { BaseAgent, GetAgent } from "@/api/agents/interfaces";
import { INITIAL_DATA } from "@/api/agents/constants";
import UploadAvatar from "@/views/team/agents/components/UploadAvatar.vue";
import { GetGroup } from "@/api/groups/interfaces";
import { RequestResult } from "@/api/interfaces";
import { useUserStoreHook } from "@/store/modules/user";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array as PropType<GetGroup>,
    default: () => []
  },
  data: {
    type: Object as PropType<GetAgent>,
    default: () => {
      return { ...INITIAL_DATA };
    }
  }
});

const ruleFormRef = ref<FormInstance>();
const formVisible = ref(false);
const formData = ref(props.data);
const groupList = ref(props.groups);
const isResetForm = ref(false);
const isEdit = ref(false);
const isEmptyAvatar = ref(false);
const selectedList = ref([]);
const limit = ref(1);
const dataLoading = ref(false);

const user = computed(() => {
  return useUserStoreHook()?.getUser;
});

const submitForm = async (formEl: FormInstance | undefined) => {
  dataLoading.value = true;
  changeGroupSelect();
  if (!formEl) {
    dataLoading.value = false;
    return;
  }
  if (isEdit.value) {
    if (isEmptyAvatar.value) {
      dataLoading.value = false;
      return;
    }
  } else {
    if (!formData.value.avatar) {
      dataLoading.value = false;
      isEmptyAvatar.value = true;
      return;
    }
  }
  await formEl.validate(valid => {
    const {
      id,
      email,
      name,
      role,
      status,
      logging_status,
      groups,
      avatar,
      password,
      password_confirmation
    } = formData.value;

    if (valid) {
      const httpRequest = isEdit.value
        ? http.put<BaseAgent, RequestResult<GetAgent>>(`/admin/users/${id}`, {
            data: {
              email,
              name,
              role,
              status,
              logging_status,
              avatar,
              groups,
              password,
              password_confirmation,
              params: {
                maxActiveTickets: limit.value,
                readyAfterLogin: false
              }
            }
          })
        : http.post<BaseAgent, RequestResult<GetAgent>>("/admin/users", {
            data: {
              email,
              name,
              role,
              status,
              logging_status,
              avatar,
              groups,
              password,
              password_confirmation,
              params: {
                maxActiveTickets: limit.value,
                readyAfterLogin: false
              }
            }
          });

      httpRequest.then(result => {
        dataLoading.value = false;
        if (result?.success) {
          message("Submitted successfully", { type: "success" });
          formVisible.value = false;
          isResetForm.value = true;
          selectedList.value = [];
          resetForm(formEl);
          emit("update-list");
        }
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  isEmptyAvatar.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

const uploadImage = data => {
  if (!data) {
    isEmptyAvatar.value = true;
  } else {
    isEmptyAvatar.value = false;
  }
  formData.value.avatar = data;
};

const closeDialog = () => {
  resetForm(ruleFormRef.value);
  selectedList.value = [];
  isResetForm.value = true;
  formVisible.value = false;
  limit.value = 1;
};

const emit = defineEmits([
  "update:visible",
  "update-list",
  "change-group-select"
]);
watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    isEmptyAvatar.value = false;
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
    limit.value = val.params.maxActiveTickets;
    selectedList.value = [];
    val.groups.forEach(item => {
      selectedList.value.push(item.name);
    });
  }
);

watch(
  () => props.groups,
  val => {
    groupList.value = val;
  }
);

const changeGroupSelect = () => {
  emit("change-group-select", selectedList.value);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (!isEdit.value) {
    if (!value || value === "") {
      return callback(new Error("Please input the password"));
    } else if (value.length < 6) {
      return callback(new Error("Password must be at least 6 characters"));
    } else if (value.length > 18) {
      return callback(new Error("Password must be no more than 18 characters"));
    } else if (/^\d+$/.test(value)) {
      return callback(new Error("Password cannot consist of only numbers"));
    } else if (formData.value.password_confirmation !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("password_confirmation", () => null);
    }
  } else {
    if (value && value.length) {
      if (value.length < 6) {
        return callback(new Error("Password must be at least 6 characters"));
      } else if (value.length > 18) {
        return callback(
          new Error("Password must be no more than 18 characters")
        );
      } else if (/^\d+$/.test(value)) {
        return callback(new Error("Password cannot consist of only numbers"));
      } else if (formData.value.password_confirmation !== "") {
        if (!ruleFormRef.value) return;
        ruleFormRef.value.validateField("password_confirmation", () => null);
      }
    }
  }
  callback();
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== formData.value.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const handleInputNumber = value => {
  if (value < 1) {
    limit.value = 1;
  } else if (value > 99) {
    limit.value = 99;
  } else {
    limit.value = value;
  }
};

const rules = {
  email: [
    { required: true, message: "Please input the email", trigger: "blur" },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"]
    }
  ],
  name: [{ required: true, message: "Please input the name", trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur", required: true }],
  password_confirmation: [
    { validator: validatePass2, trigger: "blur", required: true }
  ],
  status: [
    { required: true, message: "Please input the status", trigger: "blur" }
  ],
  logging_status: [
    {
      required: false,
      message: "Please input the after logging status",
      trigger: "blur"
    }
  ],
  role: [{ required: true, message: "Please input the role", trigger: "blur" }]
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="isEdit ? 'Edit agent' : 'New agent'"
    :width="760"
    draggable
    destroy-on-close
    :before-close="closeDialog"
    class="agent-form"
  >
    <div class="flex justify-center items-center pb-4 avatar-wrapper">
      <upload-avatar
        :data="props.data"
        :isReset="isResetForm"
        @upload-image="uploadImage"
      />
      <span v-if="isEmptyAvatar" class="error-label"
        >Please select the avatar</span
      >
    </div>
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="formData.email"
          type="email"
          :style="{ width: '480px' }"
          placeholder="Email"
        />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="formData.name"
          :style="{ width: '480px' }"
          placeholder="Name"
        />
      </el-form-item>
      <template v-if="user.role === 1">
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="formData.password"
            type="text"
            autocomplete="off"
            :style="{ width: '480px' }"
          />
        </el-form-item>
        <el-form-item label="Confirm" prop="password_confirmation">
          <el-input
            v-model="formData.password_confirmation"
            type="text"
            autocomplete="off"
            :style="{ width: '480px' }"
          />
        </el-form-item>
      </template>
      <el-form-item label="Chat limit">
        <el-input-number
          v-model="limit"
          :min="1"
          :max="99"
          controls-position="right"
          @input="handleInputNumber"
        />
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-radio-group v-model="formData.role">
          <el-radio :label="2">Manager</el-radio>
          <el-radio :label="1">Admin</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">Active</el-radio>
          <el-radio :label="0">Inactive</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="After logging status" prop="logging_status">
        <el-radio-group v-model="formData.logging_status">
          <el-radio :label="0">Accept chats</el-radio>
          <el-radio :label="1">Don't accept chats</el-radio>
          <el-radio :label="2">According to working hours</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Groups" prop="groups">
        <el-select
          v-model="selectedList"
          clearable
          :style="{ width: '480px' }"
          multiple
          @change="changeGroupSelect()"
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
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">Cancel</el-button>
      <el-button
        type="primary"
        :loading="dataLoading"
        @click="submitForm(ruleFormRef)"
      >
        Submit
      </el-button>
    </template>
  </el-dialog>
</template>
