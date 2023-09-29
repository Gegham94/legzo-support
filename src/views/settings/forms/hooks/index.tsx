import { onMounted, ref } from "vue";
import { http } from "@/utils/http";
import { RequestResult } from "@/api/interfaces";
import { Groups } from "@/api/settings/interfaces";
import * as yup from "yup";
import { ChatForm } from "@/api/chats/interfaces";
import { useRoute } from "vue-router";

export function usePresenter() {
  const route = useRoute();
  const groupsList = ref([]);
  const groupSelected = ref({} as Groups);
  const groupId = ref(null);
  const formId = ref(null);
  const title = ref("");
  const isEmptyForm = ref(true);
  const initialValues = ref({});
  const dataLoading = ref(true);
  const initNewQuestions = ref(false);
  const initData = ref({
    active: false,
    info: "Info",
    questions: [
      {
        id: "",
        question: "",
        type: "radio",
        required: false,
        answers: ["", ""]
      }
    ]
  });

  const schema = yup.object().shape({
    questions: yup
      .array()
      .of(
        yup.object().shape({
          question: yup.string().required().label("Question"),
          answers: yup
            .array()
            .of(yup.string().required().label("Answer"))
            .strict()
        })
      )
      .strict()
  });

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

    const { data } = await http.get<void, RequestResult<ChatForm>>(
      `/admin/groups/${groupId.value}/form/${formId.value}`
    );

    if (!data.active && !data?.questions?.length) {
      isEmptyForm.value = true;
      initialValues.value = { active: false };
    } else {
      isEmptyForm.value = false;
      initialValues.value = { ...data };
    }

    dataLoading.value = false;
  };

  const fetchEditForm = async (data: ChatForm): Promise<boolean> => {
    if (isEmptyForm.value) {
      const { success } = await http.post<ChatForm, RequestResult<ChatForm>>(
        `/admin/groups/${groupId.value}/form/${formId.value}`,
        {
          data: { ...data }
        }
      );

      return success;
    } else {
      const { success } = await http.put<ChatForm, RequestResult<ChatForm>>(
        `/admin/groups/${groupId.value}/form/${formId.value}`,
        {
          data: { ...data }
        }
      );

      return success;
    }
  };

  const changeSelectedGroup = name => {
    groupId.value = groupsList.value.find(item => item.name === name).id;
    getInitialData().catch();
  };

  const onSubmit = values => {
    dataLoading.value = true;

    fetchEditForm(values)
      .then(() => {
        dataLoading.value = false;
        getInitialData().catch();
      })
      .catch(e => {
        console.log("e", e);
        dataLoading.value = false;
      });
  };

  const setActiveForm = (values, push, remove) => {
    dataLoading.value = true;

    if (!values.active && !values.questions?.length) {
      initNewQuestions.value = true;
      push({
        id: "",
        question: "",
        type: "radio",
        required: false,
        answers: ["", ""]
      });
    }

    if (
      values.active &&
      initNewQuestions.value &&
      values.questions?.length === 1
    ) {
      initNewQuestions.value = false;
      remove();
    }

    dataLoading.value = false;
  };

  onMounted(() => {
    getGroupsList().catch();

    if (route.name === "pre-chat") {
      formId.value = "pre-chat";
      title.value = "Pre-Chat Form";
    } else {
      formId.value = "post-chat";
      title.value = "Post-Chat Form";
    }
  });

  return {
    groupsList,
    groupSelected,
    dataLoading,
    changeSelectedGroup,
    initialValues,
    schema,
    onSubmit,
    title,
    initData,
    setActiveForm
  };
}
