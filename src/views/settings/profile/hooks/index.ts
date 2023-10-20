import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { RequestResult } from "@/api/interfaces";
import { BaseAgent, GetAgent } from "@/api/agents/interfaces";
import { useGroupsStore } from "@/store/modules/groups";
import { storeToRefs } from "pinia";
import { getUserInfo } from "@/api/auth";

export function usePresenter() {
  let defaultForm = "";
  const avatarErrorTitle = ref("");
  const usersStore = useUserStore();
  const groupsStore = useGroupsStore();
  const { groupList } = storeToRefs(groupsStore);
  const ruleFormRef = ref<FormInstance>();
  const dataLoading = ref(true);
  const formData = ref(null);
  const selectedList = ref([]);
  const isPasswordChangeAction = ref(false);
  const fileList = ref([]);
  const uploadFile = ref();
  const isEmptyAvatar = ref(false);

  const validatePass = (rule: any, value: any, callback: any) => {
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
      return ruleFormRef.value.validateField(
        "password_confirmation",
        () => null
      );
    }
    return callback();
  };

  const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === "") {
      return callback(new Error("Please input the password again"));
    } else if (value !== formData.value.password) {
      return callback(new Error("Two inputs don't match!"));
    }
    return callback();
  };

  const rules = {
    email: [
      {
        type: "email",
        required: true,
        message: "Please input correct email address",
        trigger: ["blur", "change"]
      }
    ],
    name: [
      { required: true, message: "Please input the name", trigger: "blur" }
    ],
    password: [{ validator: validatePass, trigger: "blur", required: true }],
    password_confirmation: [
      { validator: validatePass2, trigger: "blur", required: true }
    ]
  };

  const handleInputNumber = value => {
    if (value < 1) {
      formData.value.params.maxActiveTickets = 1;
    } else if (value > 99) {
      formData.value.params.maxActiveTickets = 99;
    } else {
      formData.value.params.maxActiveTickets = value;
    }
  };

  const uploadImage = data => {
    if (!data) {
      isEmptyAvatar.value = true;
      avatarErrorTitle.value = "Please select the avatar";
    } else {
      isEmptyAvatar.value = false;
      avatarErrorTitle.value = "";
    }
    formData.value.avatar = data;
  };

  const handleRemoveImage = () => {
    uploadFile.value.clearFiles();
    fileList.value = [];
    formData.value.avatar = null;
    uploadImage(null);
  };

  const getFileMsg = content => {
    getBase64(content.raw).then(res => {
      uploadImage(res);
      formData.value.avatar = res;
    });
  };

  const getBase64 = file => {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      let imgResult: string | ArrayBuffer = "";
      const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.svg)$/i;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (allowedExtensions.test(file.name)) {
          imgResult = reader.result;
          resolve(imgResult);
        } else {
          isEmptyAvatar.value = true;
          fileList.value = [];
          reject(
            (avatarErrorTitle.value =
              "Wrong image type. Allowed types are JPEG, JPG, PNG and SVG.")
          );
        }
        imgResult = reader.result;
      };
      reader.onerror = error => {
        reject(error);
      };
      reader.onloadend = () => {
        resolve(imgResult);
      };
    });
  };

  const getUserData = async () => {
    dataLoading.value = true;
    await getUserInfo()
      .then(data => {
        usersStore.setUserData(data.data.user);
        isPasswordChangeAction.value = false;
        selectedList.value = [];
        data.data.groups.forEach(item => {
          selectedList.value.push(item.name);
        });
        formData.value = {
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          logging_status: data.data.user.online.status,
          avatar: data.data.user.avatar_link,
          role: data.data.user.role,
          status: data.data.user.status,
          groups: selectedList.value,
          password: "",
          password_confirmation: "",
          params: {
            readyAfterLogin: data.data.user.params?.readyAfterLogin,
            maxActiveTickets: data.data.user.params?.maxActiveTickets
          }
        };
        defaultForm = JSON.stringify(formData.value);
      })
      .catch(() => {
        message("Error", { type: "error" });
      })
      .finally(() => {
        setTimeout(() => {
          dataLoading.value = false;
        }, 500);
      });
  };

  const changeGroupSelect = groups => {
    formData.value.groups = [];
    groups.forEach(item => {
      const groupsItem = groupList.value.find(group => group.name === item).id;
      if (groupsItem) {
        formData.value.groups.push(groupsItem);
      }
    });
  };

  const getRoleLabel = computed(() => {
    switch (formData.value.role) {
      case 1:
        return "Agent";
      case 2:
        return "Manager";
      default:
        return "Operator";
    }
  });

  const isFormDataChanged = computed(() => {
    const formDataJSON = JSON.stringify(formData.value);
    return formDataJSON === defaultForm;
  });

  const onSubmit = async (formEl: FormInstance | undefined) => {
    dataLoading.value = true;
    if (isEmptyAvatar.value && !formData.value.avatar) {
      dataLoading.value = false;
      return;
    }
    if (!isPasswordChangeAction.value) {
      delete formData.value.password;
      delete formData.value.password_confirmation;
    }
    changeGroupSelect(selectedList.value);
    const { id } = formData.value;
    delete formData.value.id;

    await formEl.validate(valid => {
      if (valid) {
        http
          .put<BaseAgent, RequestResult<GetAgent>>(`/admin/users/${id}`, {
            data: formData.value
          })
          .then(async result => {
            if (result?.success) {
              message("Changes saved successfully", { type: "success" });
            }
          })
          .catch(error => {
            console.log("Save error", error);
          })
          .finally(async () => {
            await getUserData();
          });
      } else {
        setTimeout(() => {
          dataLoading.value = false;
        }, 500);
      }
    });
  };

  onMounted(async () => {
    await getUserData();
  });

  return {
    dataLoading,
    rules,
    formData,
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
  };
}
