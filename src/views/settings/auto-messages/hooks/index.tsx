import { onMounted, reactive, ref } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { AutoMessage, Groups } from "@/api/settings/interfaces";
import * as yup from "yup";

export function usePresenter() {
  const groupsList = ref([]);
  const groupSelected = ref({} as Groups);
  const groupId = ref(null);
  const editableTabsValue = ref("en");
  const initialData = reactive({
    welcome_message: ""
  });
  const dataLoading = ref(true);
  const getGroupsList = async () => {
    const { data } = await http.get<void, RequestResult<Groups[]>>(
      `/admin/groups`
    );
    groupsList.value = [...data];
    if (data.length) {
      groupSelected.value = { ...data[0] };
      groupId.value = data[0].id;
      getInitialData().catch();
    }
  };
  const getInitialData = async () => {
    dataLoading.value = true;
    const { data } = await http.get<void, RequestResult<AutoMessage>>(
      `/admin/groups/${groupId.value}/auto-messages`
    );
    initialData.welcome_message = data?.welcome_message ?? "";
    dataLoading.value = false;
  };

  const setInitialData = async data => {
    const { success } = await http.post<
      AutoMessage,
      RequestResult<AutoMessage>
    >(`/admin/groups/${groupId.value}/auto-messages`, {
      data: { ...data }
    });

    return success;
  };

  const changeSelectedGroup = name => {
    groupId.value = groupsList.value.find(item => item.name === name).id;
    getInitialData().catch();
  };

  const schema = yup.object().shape({
    translate: yup
      .array()
      .of(
        yup.object().shape({
          welcome_message: yup.string().required().label("welcome_message")
        })
      )
      .strict()
  });

  const onSubmit = values => {
    setInitialData(values).catch();
  };

  onMounted(() => {
    getGroupsList().catch();
  });

  return {
    groupsList,
    groupSelected,
    dataLoading,
    changeSelectedGroup,
    initialData,
    schema,
    editableTabsValue,
    onSubmit,
    getInitialData
  };
}
