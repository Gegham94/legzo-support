import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useNav } from "@/layout/hooks/useNav";
import { useDark } from "@pureadmin/utils";
import { useArchiveRoomsStore } from "@/store/modules/archiveRooms";
import { useUserStore } from "@/store/modules/user";
import { PER_PAGE_COUNT } from "@/constants/common";
import { useRoomTagsStore } from "@/store/modules/roomTags";

export function useChat() {
  const usersStore = useUserStore();
  const { device } = useNav();
  const { isDark } = useDark();

  const { getCurrentUserId } = storeToRefs(usersStore);
  const currentUserId = computed(() => {
    return getCurrentUserId.value;
  });

  const roomsStore = useArchiveRoomsStore();
  const roomTags = useRoomTagsStore();
  const {
    fetchRooms,
    fetchRoom,
    fetchRoomMessages,
    fetchRemoveRoomsTag,
    fetchCurrentUserDetail,
    setSelectedRoomId
  } = roomsStore;
  const { getRooms, getRoomMessages, getCurrentUser } = storeToRefs(roomsStore);

  const loadingRooms = ref(true);
  const roomsLoaded = ref(true);
  const roomId = ref("");
  const roomMessage = ref("");
  const loadedRooms = computed(() => {
    return getRooms.value;
  });
  const getMessages = computed(() => {
    return getRoomMessages.value;
  });
  const currentUser = computed(() => {
    return getCurrentUser.value;
  });
  const query = {
    page: 1,
    perPage: PER_PAGE_COUNT
  };
  const { fetchTags } = roomTags;
  const tagsRoomId = ref(null);
  const setTagsRoomId = async roomId => {
    tagsRoomId.value = roomId;
  };
  const removeRoomTag = async data => {
    await fetchRemoveRoomsTag(data.roomId, data.tagId).catch();
  };
  const closeModalRoom = async () => {
    tagsRoomId.value = null;
  };

  const screenHeight = computed(() => {
    return device.value === "mobile"
      ? window.innerHeight + "px"
      : "calc(100vh - 100px)";
  });
  const theme = computed(() => {
    return isDark.value ? "dark" : "light";
  });
  const resetRooms = async () => {
    loadingRooms.value = true;
    roomsLoaded.value = true;
    query.page = 1;
  };

  const fetchMoreRooms = async (reset = false) => {
    fetchRooms({ params: { ...query } }, reset).then(totalCount => {
      if (getRooms.value?.length < totalCount) {
        roomsLoaded.value = false;
        query.page++;
      } else {
        roomsLoaded.value = true;
      }

      loadingRooms.value = false;
    });
  };
  const fetchRoomId = async val => {
    await fetchRoom(val).catch();
    roomId.value = val;
  };
  const fetchMessages = async ({ room, options = { reset: false } }) => {
    if (options.reset) {
      await fetchCurrentUserDetail(room.customer_id);
    }

    await setSelectedRoomId(room.id);
    await fetchRoomMessages();
  };
  const openFile = ({ file }) => {
    window.open(file.file.url, "_blank");
  };
  const menuActionHandler = ({ action, roomId }) => {
    switch (action.name) {
      case "addTag":
        return setTagsRoomId(roomId);
    }
  };

  onMounted(async () => {
    await resetRooms();
    await fetchMoreRooms(true).catch();
    await fetchTags().catch();
  });

  return {
    screenHeight,
    theme,
    currentUserId,
    currentUser,
    menuActionHandler,
    loadedRooms,
    loadingRooms,
    roomsLoaded,
    roomMessage,
    roomId,
    fetchMoreRooms,
    getMessages,
    fetchMessages,
    openFile,
    fetchRoomId,
    tagsRoomId,
    removeRoomTag,
    closeModalRoom
  };
}
