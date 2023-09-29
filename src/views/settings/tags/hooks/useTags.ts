import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRoomTagsStoreHook } from "@/store/modules/roomTags";

export function useTags() {
  const roomTags = useRoomTagsStoreHook();
  const { fetchTags, addNewTag, fetchEditTag, fetchDeleteTag } = roomTags;
  const formTags = ref("");
  const dialogTagVisible = ref(false);
  const editTag = reactive({
    id: 0,
    name: "",
    active: false
  });

  const getTagsList = computed(() => {
    return roomTags.getTags;
  });

  const addTag = async () => {
    const tagId = roomTags.getTags.find(
      tag => tag.value?.toLowerCase() === formTags.value?.toLowerCase()
    )?.id;

    if (!tagId) {
      await addNewTag(formTags.value);
      await fetchTags();
      formTags.value = "";
    }
  };

  const handleEdit = (index, row) => {
    editTag.id = row.id;
    editTag.name = row.value;
    editTag.active = row.active;
    dialogTagVisible.value = true;
  };

  const changeEditTag = async () => {
    await fetchEditTag(editTag);
    await fetchTags();
    dialogTagVisible.value = false;
  };

  const handleDelete = async (index, row) => {
    await fetchDeleteTag(row.id);
    await nextTick(() => {
      fetchTags();
    });
  };

  const fetchTagsList = (queryString: string, cb: any) => {
    const results = queryString
      ? getTagsList.value.filter(
          tag =>
            tag?.value?.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      : getTagsList.value;

    cb(results);
  };

  onMounted(async () => {
    await fetchTags();
  });

  return {
    getTagsList,
    formTags,
    addTag,
    editTag,
    handleEdit,
    changeEditTag,
    handleDelete,
    dialogTagVisible,
    fetchTagsList
  };
}
