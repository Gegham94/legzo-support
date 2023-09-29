import { computed, nextTick, onMounted, ref } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { message } from "@/utils/message";
import { CreateTemplate, Groups } from "@/api/settings/interfaces";
import { INITIAL_DATA } from "@/api/settings/constants";
import { ElMessageBox } from "element-plus";

export function useCannedResponses() {
  const groupsList = ref([]);
  const formDialogVisible = ref(false);
  const formData = ref({ ...INITIAL_DATA });
  const groupSelected = ref({} as Groups);
  const groupTemplateItem = ref({} as Groups);
  const groupId = ref(null);
  const templates = ref([]);
  const dataLoading = ref(true);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const shortcutsAlreadyError = ref(false);
  const emptyShortcutsError = ref(false);
  const isEdit = ref(false);
  const getGroupsList = async () => {
    const { data } = await http.get<void, RequestResult<Groups[]>>(
      `/admin/groups`
    );
    groupsList.value = [...data];
    if (data.length) {
      groupSelected.value = { ...data[0] };
      groupId.value = data[0].id;
      getTemplates().catch();
    }
  };
  const getTemplates = async () => {
    const { data } = await http.get<void, RequestResult<Groups[]>>(
      `/admin/templates?filter[group_id]=${groupId.value}`
    );
    dataLoading.value = false;
    templates.value = [...data];
  };

  const setTemplatesRequest = value => {
    const { text, active, shortcuts, group_id } = value;
    http
      .post<CreateTemplate, RequestResult<CreateTemplate>>("/admin/templates", {
        data: { text, group_id, active, shortcuts }
      })
      .then(() => {
        message("Sanned response has been saved.", { type: "success" });
      })
      .catch(() => {
        message("Error", { type: "error" });
      })
      .finally(() => {
        formData.value = { ...INITIAL_DATA };
        getTemplates().catch();
      });
  };
  const changeGroup = name => {
    const id = groupsList.value.find(item => item.name === name).id;
    formData.value.group_id = id;
  };
  const formDialog = () => {
    formDialogVisible.value = !formDialogVisible.value;
    if (Object.keys(groupSelected.value)) {
      groupTemplateItem.value = { ...groupSelected.value };
      formData.value.group_id = groupTemplateItem.value.id;
      formData.value.group = groupTemplateItem.value;
      formData.value.group_id = groupId.value;
    }
  };
  const handleClose = (tag: string) => {
    formData.value.shortcuts.splice(formData.value.shortcuts.indexOf(tag), 1);
  };
  const showInput = InputRef => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value!.input!.focus();
    });
  };
  const handleInputConfirm = shortcut => {
    if (formData.value.shortcuts.includes(`# ${shortcut}`)) {
      shortcutsAlreadyError.value = true;
      return;
    }
    if (shortcut) {
      formData.value.shortcuts.push(`# ${shortcut}`);
    }
    inputVisible.value = false;
    shortcutsAlreadyError.value = false;
    emptyShortcutsError.value = false;
    inputValue.value = "";
  };
  const resetShortcuts = () => {
    const item = [...formData.value.shortcuts];
    item.forEach(item => {
      handleClose(item);
    });
  };

  const editTemplate = template => {
    isEdit.value = true;
    templateCopy(template);
  };

  const changeSelectedGroup = name => {
    groupId.value = groupsList.value.find(item => item.name === name).id;
    formData.value.group_id = groupId.value;
    getTemplates().catch();
  };
  const templateCopy = template => {
    const groupItem = groupsList.value.find(
      item => item.id === template.group_id
    );
    formData.value.group = { ...groupItem };
    const item = JSON.parse(JSON.stringify(template));
    formData.value = { ...formData.value, ...item };
    formDialogVisible.value = true;
  };

  const resetForm = () => {
    resetShortcuts();
    shortcutsAlreadyError.value = false;
    emptyShortcutsError.value = false;
    inputVisible.value = false;
    inputValue.value = "";
    formData.value = { ...INITIAL_DATA };
  };

  const templateEditRequest = async template => {
    const { text, active, shortcuts, group_id, id } = template;
    await http
      .put<CreateTemplate, RequestResult<CreateTemplate>>(
        `/admin/templates/${id}`,
        {
          data: { text, group_id, active, shortcuts }
        }
      )
      .then(() => {
        message("Canned response has been edited.", { type: "success" });
      })
      .catch(() => {
        message("Error", { type: "error" });
      })
      .finally(() => {
        formData.value = { ...INITIAL_DATA };
        getTemplates().catch();
        isEdit.value = false;
      });
  };
  const templateDeleteRequest = id => {
    ElMessageBox.confirm("Remove this response", "Submit", {
      type: "warning"
    })
      .then(async () => {
        await http
          .delete(`/admin/templates/${id}`)
          .then(() => {
            message("Canned response has been deleted.", { type: "success" });
          })
          .catch(() => {
            message("Error", { type: "error" });
          })
          .finally(() => {
            getTemplates().catch();
          });
      })
      .catch(() => {});
  };

  const submitFormItem = (formEl, isEditForm, data) => {
    emptyShortcutsError.value = !data.shortcuts.length;
    if (!formEl && !data.shortcuts.length) return;
    formEl.validate(valid => {
      if (valid) {
        isEditForm ? templateEditRequest(data) : setTemplatesRequest(data);
        formDialogVisible.value = false;
        nextTick(() => {
          resetForm();
        });
      } else {
        return false;
      }
    });
  };

  onMounted(() => {
    getGroupsList().catch();
  });

  const shortcutsErrorMassage = computed(() => {
    if (emptyShortcutsError.value) return "Enter at least one shortcut.";
    if (shortcutsAlreadyError.value) return "Shortcut is already added.";
    return "";
  });

  return {
    dataLoading,
    groupsList,
    formDialogVisible,
    groupSelected,
    templates,
    formDialog,
    groupTemplateItem,
    formData,
    handleClose,
    showInput,
    handleInputConfirm,
    inputValue,
    inputVisible,
    resetShortcuts,
    shortcutsAlreadyError,
    emptyShortcutsError,
    setTemplatesRequest,
    changeGroup,
    getTemplates,
    changeSelectedGroup,
    templateCopy,
    editTemplate,
    templateEditRequest,
    templateDeleteRequest,
    resetForm,
    submitFormItem,
    isEdit,
    shortcutsErrorMassage
  };
}
