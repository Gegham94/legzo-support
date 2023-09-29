import { nextTick, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoomsStore } from "@/store/modules/rooms";
import { useRoomTagsStore } from "@/store/modules/roomTags";

export function useTags(props) {
  const roomsStore = useRoomsStore();
  const { fetchRoomsTag } = roomsStore;
  const roomTags = useRoomTagsStore();
  const { addNewTag } = roomTags;
  const { getTags } = storeToRefs(roomTags);
  const formTags = ref("");
  const showModal = ref(false);

  const addTagToRoom = async () => {
    let tagId = getTags.value.find(
      tag => tag.value?.toLowerCase() === formTags.value?.toLowerCase()
    )?.id;

    if (!tagId) {
      tagId = await addNewTag(formTags.value);
    }

    if (tagId) {
      const success = fetchRoomsTag(props.roomId, tagId).catch();
      if (success) {
        formTags.value = "";
        showModal.value = false;
      }
    }
  };
  const fetchTagsList = (queryString: string, cb: any) => {
    const results = queryString
      ? getTags.value.filter(
          tag =>
            tag?.value?.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      : getTags.value;

    cb(results);
  };

  watch(props, async val => {
    if (val.roomId) {
      showModal.value = true;
      await nextTick();
    }
  });

  return {
    fetchTagsList,
    addTagToRoom,
    formTags,
    showModal
  };
}
